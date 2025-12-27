const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');

// @desc    Get maintenance schedule for calendar
// @route   GET /api/maintenance/calendar
// @access  Private
exports.getMaintenanceSchedule = async (req, res) => {
  try {
    const { year, month, equipment, team, technician } = req.query;
    
    // Set date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Build query
    const query = {
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      },
      requestType: 'preventive',
      status: { $nin: ['completed', 'cancelled'] }
    };

    if (equipment) query.equipment = equipment;
    if (team) query.team = team;
    if (technician) query.technician = technician;

    // Get maintenance requests
    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .sort('scheduledDate');

    // Format for calendar
    const calendarData = {};
    maintenanceRequests.forEach(request => {
      const date = new Date(request.scheduledDate).getDate();
      if (!calendarData[date]) {
        calendarData[date] = [];
      }

      // Determine event type based on priority or other criteria
      let eventType = 'preventive';
      let color = '#E6F4EA';
      let textColor = '#2E7D32';
      
      if (request.priority === 'high' || request.priority === 'critical') {
        color = '#FDECEA';
        textColor = '#C62828';
      }

      calendarData[date].push({
        _id: request._id,
        type: eventType,
        title: request.subject,
        color,
        textColor,
        priority: request.priority,
        equipment: request.equipment?.name,
        status: request.status,
        isOverdue: request.isOverdue
      });
    });

    res.json({
      success: true,
      data: calendarData,
      count: maintenanceRequests.length,
      month: startDate.toLocaleString('default', { month: 'long' }),
      year
    });
  } catch (error) {
    console.error('Get maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get upcoming maintenance tasks
// @route   GET /api/maintenance/upcoming
// @access  Private
exports.getUpcomingTasks = async (req, res) => {
  try {
    const { days = 30, limit = 20 } = req.query;
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const tasks = await MaintenanceRequest.find({
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      },
      requestType: 'preventive',
      status: { $nin: ['completed', 'cancelled'] }
    })
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .sort('scheduledDate')
      .limit(parseInt(limit));

    // Format tasks
    const formattedTasks = tasks.map(task => ({
      _id: task._id,
      title: task.subject,
      date: task.scheduledDate,
      type: task.requestType,
      priority: task.priority,
      equipment: task.equipment?.name,
      team: task.team?.name,
      technician: task.technician?.name,
      isOverdue: task.isOverdue,
      status: task.status
    }));

    res.json({
      success: true,
      data: formattedTasks,
      count: formattedTasks.length
    });
  } catch (error) {
    console.error('Get upcoming tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Schedule preventive maintenance
// @route   POST /api/maintenance/schedule
// @access  Private (Admin, Manager)
exports.scheduleMaintenance = async (req, res) => {
  try {
    const {
      subject,
      description,
      equipment,
      team,
      requestType = 'preventive',
      priority = 'medium',
      scheduledDate,
      estimatedHours,
      scheduleType = 'one-time',
      recurrencePattern,
      isRecurring = false
    } = req.body;

    // Validate required fields
    if (!subject || !equipment || !team || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, equipment, team, and scheduled date'
      });
    }

    // Create the maintenance request
    const request = await MaintenanceRequest.create({
      subject,
      description,
      equipment,
      team,
      requestType,
      priority,
      scheduledDate,
      estimatedHours,
      scheduleType,
      recurrencePattern,
      isRecurring,
      nextScheduledDate: isRecurring ? scheduledDate : null,
      createdBy: req.user._id
    });

    // If recurring, schedule next occurrence
    if (isRecurring && scheduleType !== 'one-time') {
      await scheduleNextOccurrence(request);
    }

    // Populate related fields
    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRequest,
      message: 'Maintenance scheduled successfully'
    });
  } catch (error) {
    console.error('Schedule maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to schedule next occurrence
const scheduleNextOccurrence = async (request) => {
  try {
    let nextDate = new Date(request.scheduledDate);
    
    switch (request.scheduleType) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    request.nextScheduledDate = nextDate;
    await request.save();
  } catch (error) {
    console.error('Schedule next occurrence error:', error);
  }
};

// @desc    Update maintenance schedule
// @route   PUT /api/maintenance/schedule/:id
// @access  Private (Admin, Manager)
exports.updateSchedule = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found'
      });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        request[key] = updates[key];
      }
    });

    await request.save();

    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email');

    res.json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark task as completed
// @route   PUT /api/maintenance/:id/complete
// @access  Private (Technician, Admin, Manager)
exports.markAsCompleted = async (req, res) => {
  try {
    const { actualHours, notes, partsUsed } = req.body;
    
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task
    request.status = 'completed';
    request.completedAt = new Date();
    request.actualHours = actualHours || 0;
    
    if (notes) {
      request.notes.push({
        content: notes,
        createdBy: req.user._id
      });
    }

    if (partsUsed && Array.isArray(partsUsed)) {
      request.partsUsed = partsUsed;
      request.totalCost = partsUsed.reduce((sum, part) => 
        sum + (part.cost || 0) * (part.quantity || 1), 0);
    }

    // If recurring, schedule next occurrence
    if (request.isRecurring && request.scheduleType !== 'one-time') {
      await scheduleNextOccurrence(request);
    }

    await request.save();

    // Update equipment last maintenance date
    await Equipment.findByIdAndUpdate(request.equipment, {
      lastMaintenanceDate: new Date(),
      nextMaintenanceDate: request.nextScheduledDate
    });

    res.json({
      success: true,
      data: request,
      message: 'Task marked as completed'
    });
  } catch (error) {
    console.error('Mark as completed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/calendar/stats
// @access  Private
exports.getMaintenanceStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get stats for current month
    const monthlyStats = await MaintenanceRequest.aggregate([
      {
        $match: {
          scheduledDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          },
          requestType: 'preventive'
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$estimatedHours' }
        }
      }
    ]);

    // Get upcoming tasks count
    const upcomingCount = await MaintenanceRequest.countDocuments({
      scheduledDate: { $gte: now },
      requestType: 'preventive',
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get overdue tasks count
    const overdueCount = await MaintenanceRequest.countDocuments({
      scheduledDate: { $lt: now },
      requestType: 'preventive',
      status: { $nin: ['completed', 'cancelled'] }
    });

    res.json({
      success: true,
      data: {
        monthlyStats,
        upcomingCount,
        overdueCount,
        totalScheduled: monthlyStats.reduce((sum, stat) => sum + stat.count, 0)
      }
    });
  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get overdue tasks
// @route   GET /api/maintenance/overdue
// @access  Private
exports.getOverdueTasks = async (req, res) => {
  try {
    const now = new Date();
    
    const overdueTasks = await MaintenanceRequest.find({
      scheduledDate: { $lt: now },
      requestType: 'preventive',
      status: { $nin: ['completed', 'cancelled'] }
    })
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .sort('scheduledDate');

    res.json({
      success: true,
      data: overdueTasks,
      count: overdueTasks.length
    });
  } catch (error) {
    console.error('Get overdue tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};