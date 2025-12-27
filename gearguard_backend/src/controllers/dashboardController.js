const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const MaintenanceTeam = require('../models/MaintenanceTeam');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let query = {};

    // Filter based on user role
    if (userRole === 'employee') {
      query.createdBy = userId;
    } else if (userRole === 'technician') {
      // Get teams where user is a member
      const teams = await MaintenanceTeam.find({ members: userId });
      const teamIds = teams.map(team => team._id);
      query.team = { $in: teamIds };
    }

    // Get total maintenance requests
    const totalRequests = await MaintenanceRequest.countDocuments(query);

    // Get open/overdue requests
    const openRequests = await MaintenanceRequest.countDocuments({
      ...query,
      status: { $in: ['new', 'assigned', 'in_progress'] }
    });

    const overdueRequests = await MaintenanceRequest.countDocuments({
      ...query,
      scheduledDate: { $lt: now },
      status: { $in: ['new', 'assigned', 'in_progress'] }
    });

    // Get critical equipment (status under_maintenance or with high priority requests)
    const criticalEquipment = await Equipment.countDocuments({
      $or: [
        { status: 'under_maintenance' },
        {
          _id: {
            $in: (await MaintenanceRequest.find({
              priority: 'critical',
              status: { $in: ['new', 'assigned', 'in_progress'] }
            })).map(req => req.equipment)
          }
        }
      ]
    });

    // Get technician utilization
    const technicians = await User.countDocuments({ role: 'technician' });
    const activeTechnicians = await MaintenanceRequest.aggregate([
      {
        $match: {
          status: { $in: ['assigned', 'in_progress'] },
          technician: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$technician'
        }
      },
      {
        $count: 'activeCount'
      }
    ]);

    const technicianUtilization = technicians > 0 
      ? Math.round((activeTechnicians[0]?.activeCount || 0) / technicians * 100)
      : 0;

    // Get recent maintenance requests for the table
    const recentRequests = await MaintenanceRequest.find(query)
      .populate('createdBy', 'name email')
      .populate('technician', 'name email')
      .populate('equipment', 'name category')
      .sort('-createdAt')
      .limit(10);

    // Format recent requests
    const formattedRequests = recentRequests.map(request => ({
      id: request._id,
      subject: request.subject,
      employee: request.createdBy?.name || 'Unknown',
      technician: request.technician?.name || 'Not Assigned',
      category: request.equipment?.category || 'Uncategorized',
      stage: request.status.charAt(0).toUpperCase() + request.status.slice(1),
      comments: request.notes.length > 0 ? request.notes[request.notes.length - 1].content : 'No comments',
      priority: request.priority,
      scheduledDate: request.scheduledDate
    }));

    // Get request trends for last 30 days
    const trendData = await MaintenanceRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          ...query
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 7 // Last 7 days
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          criticalEquipment,
          technicianUtilization,
          openRequests,
          overdueRequests,
          totalRequests
        },
        recentRequests: formattedRequests,
        trends: trendData
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get equipment health metrics
// @route   GET /api/dashboard/equipment-health
// @access  Private
exports.getEquipmentHealth = async (req, res) => {
  try {
    const equipmentHealth = await Equipment.aggregate([
      {
        $lookup: {
          from: 'maintenancerequests',
          localField: '_id',
          foreignField: 'equipment',
          as: 'maintenanceHistory'
        }
      },
      {
        $addFields: {
          maintenanceCount: { $size: '$maintenanceHistory' },
          criticalIssues: {
            $size: {
              $filter: {
                input: '$maintenanceHistory',
                as: 'request',
                cond: {
                  $and: [
                    { $in: ['$$request.status', ['new', 'assigned', 'in_progress']] },
                    { $in: ['$$request.priority', ['high', 'critical']] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          status: 1,
          lastMaintenanceDate: 1,
          nextMaintenanceDate: 1,
          maintenanceCount: 1,
          criticalIssues: 1,
          healthScore: {
            $cond: {
              if: { $eq: ['$status', 'scrapped'] },
              then: 0,
              else: {
                $cond: {
                  if: { $eq: ['$status', 'under_maintenance'] },
                  then: 30,
                  else: {
                    $subtract: [
                      100,
                      {
                        $multiply: [
                          { $ifNull: ['$criticalIssues', 0] },
                          20
                        ]
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          healthScore: { $lt: 50 } // Only show equipment with health < 50%
        }
      },
      {
        $sort: { healthScore: 1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: equipmentHealth
    });
  } catch (error) {
    console.error('Get equipment health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get technician workload
// @route   GET /api/dashboard/technician-workload
// @access  Private (Admin, Manager)
exports.getTechnicianWorkload = async (req, res) => {
  try {
    const technicians = await User.aggregate([
      {
        $match: { role: 'technician' }
      },
      {
        $lookup: {
          from: 'maintenancerequests',
          localField: '_id',
          foreignField: 'technician',
          as: 'assignedTasks'
        }
      },
      {
        $addFields: {
          activeTasks: {
            $size: {
              $filter: {
                input: '$assignedTasks',
                as: 'task',
                cond: { $in: ['$$task.status', ['assigned', 'in_progress']] }
              }
            }
          },
          completedTasks: {
            $size: {
              $filter: {
                input: '$assignedTasks',
                as: 'task',
                cond: { $eq: ['$$task.status', 'completed'] }
              }
            }
          },
          overdueTasks: {
            $size: {
              $filter: {
                input: '$assignedTasks',
                as: 'task',
                cond: {
                  $and: [
                    { $in: ['$$task.status', ['assigned', 'in_progress']] },
                    { $lt: ['$$task.scheduledDate', new Date()] }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          activeTasks: 1,
          completedTasks: 1,
          overdueTasks: 1,
          utilization: {
            $min: [
              100,
              {
                $multiply: [
                  { $divide: ['$activeTasks', 5] }, // Max 5 tasks per technician
                  100
                ]
              }
            ]
          }
        }
      },
      {
        $sort: { utilization: -1 }
      }
    ]);

    // Calculate overall utilization
    const overallUtilization = technicians.length > 0
      ? Math.round(technicians.reduce((sum, tech) => sum + tech.utilization, 0) / technicians.length)
      : 0;

    res.json({
      success: true,
      data: {
        technicians,
        overallUtilization
      }
    });
  } catch (error) {
    console.error('Get technician workload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get quick stats for dashboard cards
// @route   GET /api/dashboard/quick-stats
// @access  Private
exports.getQuickStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {};
    
    if (userRole === 'employee') {
      query.createdBy = userId;
    } else if (userRole === 'technician') {
      const teams = await MaintenanceTeam.find({ members: userId });
      const teamIds = teams.map(team => team._id);
      query.team = { $in: teamIds };
    }

    const now = new Date();

    // Parallel database queries for efficiency
    const [
      criticalEquipmentCount,
      openRequestsCount,
      overdueRequestsCount,
      equipmentCount,
      technicianCount
    ] = await Promise.all([
      Equipment.countDocuments({ status: 'under_maintenance' }),
      MaintenanceRequest.countDocuments({ 
        ...query,
        status: { $in: ['new', 'assigned', 'in_progress'] }
      }),
      MaintenanceRequest.countDocuments({
        ...query,
        scheduledDate: { $lt: now },
        status: { $in: ['new', 'assigned', 'in_progress'] }
      }),
      Equipment.countDocuments(),
      User.countDocuments({ role: 'technician' })
    ]);

    // Get technician utilization
    const activeTechnicians = await MaintenanceRequest.distinct('technician', {
      status: { $in: ['assigned', 'in_progress'] },
      technician: { $ne: null }
    });

    const technicianUtilization = technicianCount > 0
      ? Math.round((activeTechnicians.length / technicianCount) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        criticalEquipment: criticalEquipmentCount,
        technicianUtilization,
        openRequests: openRequestsCount,
        overdueRequests: overdueRequestsCount,
        totalEquipment: equipmentCount,
        totalTechnicians: technicianCount
      }
    });
  } catch (error) {
    console.error('Get quick stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};