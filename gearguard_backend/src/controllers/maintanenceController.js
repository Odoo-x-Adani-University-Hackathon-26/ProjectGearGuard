const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');
const MaintenanceLog = require('../models/MaintenanceLog');

// @desc    Create maintenance request
// @route   POST /api/maintenance
// @access  Private (Employee, Admin, Manager)
exports.createRequest = async (req, res) => {
  try {
    const {
      subject,
      description,
      equipment,
      team,
      requestType,
      priority,
      scheduledDate,
      estimatedHours
    } = req.body;

    // Validate required fields
    if (!subject || !description || !equipment || !team || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, description, equipment, team, and request type'
      });
    }

    // Check if equipment exists
    const equipmentExists = await Equipment.findById(equipment);
    if (!equipmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Check if team exists
    const teamExists = await MaintenanceTeam.findById(team);
    if (!teamExists) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance team not found'
      });
    }

    // Create request
    const request = await MaintenanceRequest.create({
      subject,
      description,
      equipment,
      team,
      requestType,
      priority: priority || 'medium',
      scheduledDate,
      estimatedHours,
      createdBy: req.user._id
    });

    // Create log entry
    await MaintenanceLog.create({
      maintenanceRequest: request._id,
      technician: req.user._id,
      action: 'status_changed',
      previousStatus: null,
      newStatus: 'new',
      note: 'Request created'
    });

    // Populate related fields
    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private (Admin, Manager)
exports.getAllRequests = async (req, res) => {
  try {
    const {
      status,
      priority,
      requestType,
      equipment,
      team,
      technician,
      startDate,
      endDate,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (requestType) query.requestType = requestType;
    if (equipment) query.equipment = equipment;
    if (team) query.team = team;
    if (technician) query.technician = technician;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    const requests = await MaintenanceRequest.find(query)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MaintenanceRequest.countDocuments(query);

    res.json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: requests
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get request by ID
// @route   GET /api/maintenance/:id
// @access  Private
exports.getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment', 'name serialNumber department location')
      .populate('team', 'name teamLeader members')
      .populate('technician', 'name email role')
      .populate('createdBy', 'name email')
      .populate('notes.createdBy', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'employee' && request.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    if (req.user.role === 'technician' && request.technician?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this request'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private (Admin, Manager)
exports.updateRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      request[key] = updates[key];
    });

    await request.save();

    // Populate before returning
    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email');

    res.json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Assign technician to request
// @route   PUT /api/maintenance/:id/assign
// @access  Private (Technician, Admin, Manager)
exports.assignTechnician = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide technician ID'
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id);
    const technician = await User.findById(technicianId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (!technician || !['technician', 'admin'].includes(technician.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid technician'
      });
    }

    // Check if technician is in the team
    const team = await MaintenanceTeam.findById(request.team);
    if (!team.members.includes(technicianId)) {
      return res.status(400).json({
        success: false,
        message: 'Technician is not a member of this team'
      });
    }

    request.technician = technicianId;
    request.assignedAt = new Date();
    request.status = 'assigned';
    await request.save();

    // Create log entry
    await MaintenanceLog.create({
      maintenanceRequest: request._id,
      technician: req.user._id,
      action: 'assigned',
      note: `Assigned to ${technician.name}`,
      metadata: {
        assignedTo: technicianId,
        assignedByName: req.user.name
      }
    });

    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('technician', 'name email')
      .populate('team', 'name');

    res.json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Assign technician error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update request status
// @route   PUT /api/maintenance/:id/status
// @access  Private (Technician, Admin, Manager)
exports.updateStatus = async (req, res) => {
  try {
    const { status, note, actualHours, partsUsed } = req.body;
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      'new': ['assigned', 'cancelled'],
      'assigned': ['in_progress', 'cancelled'],
      'in_progress': ['completed', 'cancelled'],
      'completed': ['scrap'],
      'cancelled': [],
      'scrap': []
    };

    if (!validTransitions[request.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${request.status} to ${status}`
      });
    }

    const previousStatus = request.status;
    request.status = status;

    // Update timestamps based on status
    if (status === 'in_progress' && !request.startedAt) {
      request.startedAt = new Date();
    } else if (status === 'completed' && !request.completedAt) {
      request.completedAt = new Date();
      request.actualHours = actualHours || 0;
      
      // Update parts used and calculate total cost
      if (partsUsed && Array.isArray(partsUsed)) {
        request.partsUsed = partsUsed;
        request.totalCost = partsUsed.reduce((sum, part) => sum + (part.cost || 0) * (part.quantity || 1), 0);
      }
    } else if (status === 'scrap') {
      // Update equipment status to scrapped
      await Equipment.findByIdAndUpdate(request.equipment, {
        status: 'scrapped'
      });
    }

    await request.save();

    // Create log entry
    await MaintenanceLog.create({
      maintenanceRequest: request._id,
      technician: req.user._id,
      action: 'status_changed',
      previousStatus,
      newStatus: status,
      note: note || `Status changed from ${previousStatus} to ${status}`,
      hoursSpent: actualHours,
      metadata: { partsUsed }
    });

    // Add note if provided
    if (note) {
      request.notes.push({
        content: note,
        createdBy: req.user._id
      });
      await request.save();
    }

    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('technician', 'name email')
      .populate('notes.createdBy', 'name email');

    res.json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add note to request
// @route   POST /api/maintenance/:id/notes
// @access  Private (Technician, Admin, Manager)
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide note content'
      });
    }

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.notes.push({
      content,
      createdBy: req.user._id
    });

    await request.save();

    // Create log entry
    await MaintenanceLog.create({
      maintenanceRequest: request._id,
      technician: req.user._id,
      action: 'note_added',
      note: content
    });

    const populatedRequest = await MaintenanceRequest.findById(request._id)
      .populate('notes.createdBy', 'name email')
      .populate('technician', 'name email');

    res.json({
      success: true,
      data: populatedRequest
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get my requests (for employees)
// @route   GET /api/maintenance/my-requests
// @access  Private (Employee)
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ createdBy: req.user._id })
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get team requests (for technicians)
// @route   GET /api/maintenance/team-requests
// @access  Private (Technician)
exports.getTeamRequests = async (req, res) => {
  try {
    // Find teams where user is a member
    const teams = await MaintenanceTeam.find({ members: req.user._id });
    const teamIds = teams.map(team => team._id);

    const requests = await MaintenanceRequest.find({ team: { $in: teamIds } })
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get team requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/stats
// @access  Private
exports.getRequestsStats = async (req, res) => {
  try {
    let query = {};
    
    // Filter by role
    if (req.user.role === 'employee') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'technician') {
      // Get teams where user is a member
      const teams = await MaintenanceTeam.find({ members: req.user._id });
      query.team = { $in: teams.map(t => t._id) };
    }

    const stats = await MaintenanceRequest.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$actualHours' },
          totalCost: { $sum: '$totalCost' }
        }
      },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: '$count' },
          totalHours: { $sum: '$totalHours' },
          totalCost: { $sum: '$totalCost' },
          byStatus: {
            $push: {
              status: '$_id',
              count: '$count'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalRequests: 1,
          totalHours: 1,
          totalCost: 1,
          byStatus: 1
        }
      }
    ]);

    // Get priority distribution
    const priorityStats = await MaintenanceRequest.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...(stats[0] || { totalRequests: 0, totalHours: 0, totalCost: 0, byStatus: [] }),
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin)
exports.deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Delete associated logs
    await MaintenanceLog.deleteMany({ maintenanceRequest: request._id });

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};