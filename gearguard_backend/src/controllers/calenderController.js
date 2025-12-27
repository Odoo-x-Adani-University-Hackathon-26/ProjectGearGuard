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
    endDate.setHours(23, 59, 59, 999); // Include entire last day

    console.log(`Fetching schedule for ${year}-${month}: ${startDate} to ${endDate}`);

    // Build query - REMOVED requestType filter to get ALL types
    const query = {
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
      // REMOVED: requestType: 'preventive' - This was filtering out corrective tasks
    };

    if (equipment) query.equipment = equipment;
    if (team) query.team = team;
    if (technician) query.technician = technician;

    // Get ALL maintenance requests (both preventive and corrective)
    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('equipment', 'name serialNumber')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .sort('scheduledDate');

    console.log(`Found ${maintenanceRequests.length} maintenance requests`);

    // Format for calendar
    const calendarData = {};
    maintenanceRequests.forEach(request => {
      const date = new Date(request.scheduledDate).getDate();
      if (!calendarData[date]) {
        calendarData[date] = [];
      }

      // Determine colors based on priority and status
      let color = '#E6F4EA'; // Default green for preventive
      let textColor = '#2E7D32'; // Default green text
      
      // Different colors for different request types
      if (request.requestType === 'corrective') {
        color = '#E3F2FD'; // Blue for corrective
        textColor = '#1976D2'; // Blue text
      } else if (request.requestType === 'inspection') {
        color = '#FFF3E0'; // Orange for inspection
        textColor = '#E65100'; // Orange text
      }
      
      // Priority-based overrides
      if (request.priority === 'high' || request.priority === 'critical') {
        if (request.requestType === 'corrective') {
          color = '#FFEBEE'; // Light red for high priority corrective
          textColor = '#C62828'; // Dark red text
        } else {
          color = '#FDECEA'; // Light red for high priority preventive
          textColor = '#C62828'; // Dark red text
        }
      } else if (request.priority === 'medium') {
        color = '#FFF4E5'; // Light orange
        textColor = '#E65100'; // Dark orange
      }

      // Status-based adjustments
      if (request.status === 'completed') {
        color = '#F3F4F6'; // Light gray
        textColor = '#6B7280'; // Gray text
      } else if (request.isOverdue) {
        color = '#FDECEA'; // Light red for overdue
        textColor = '#C62828'; // Red text for overdue
      }

      // Determine event type (for icon display)
      let eventType = request.requestType; // Use actual request type
      if (request.subject?.toLowerCase().includes('inspect')) eventType = 'inspection';
      if (request.subject?.toLowerCase().includes('calibrat')) eventType = 'calibration';
      if (request.subject?.toLowerCase().includes('lubricat')) eventType = 'lubrication';

      calendarData[date].push({
        id: request._id,
        _id: request._id,
        type: eventType,
        title: request.subject,
        subject: request.subject,
        description: request.description,
        color,
        textColor,
        priority: request.priority,
        requestType: request.requestType,
        equipment: request.equipment,
        team: request.team,
        status: request.status,
        isOverdue: request.isOverdue,
        scheduledDate: request.scheduledDate,
        date: request.scheduledDate,
        estimatedHours: request.estimatedHours
      });
    });

    console.log(`Calendar data keys: ${Object.keys(calendarData).length}`);
    console.log(`Tasks per date:`, Object.keys(calendarData).map(date => ({
      date,
      count: calendarData[date].length,
      tasks: calendarData[date].map(t => ({ title: t.title, type: t.requestType }))
    })));

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
    const { days = 30, limit = 50 } = req.query;
    
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));
    endDate.setHours(23, 59, 59, 999);

    console.log(`Fetching upcoming tasks for ${days} days: ${startDate} to ${endDate}`);

    // REMOVED requestType filter to get ALL types
    const tasks = await MaintenanceRequest.find({
      scheduledDate: {
        $gte: startDate,
        $lte: endDate
      }
    })
      .populate('equipment', 'name serialNumber model')
      .populate('team', 'name')
      .populate('technician', 'name email')
      .sort('scheduledDate')
      .limit(parseInt(limit));

    console.log(`Found ${tasks.length} upcoming tasks`);

    // Format tasks for frontend
    const formattedTasks = tasks.map(task => {
      // Determine event type for icon
      let type = task.requestType; // Use actual request type
      if (task.subject?.toLowerCase().includes('inspect')) type = 'inspection';
      if (task.subject?.toLowerCase().includes('calibrat')) type = 'calibration';
      if (task.subject?.toLowerCase().includes('lubricat')) type = 'lubrication';

      return {
        _id: task._id,
        id: task._id,
        title: task.subject,
        subject: task.subject,
        date: task.scheduledDate,
        scheduledDate: task.scheduledDate,
        type: type,
        requestType: task.requestType,
        priority: task.priority,
        equipment: task.equipment,
        team: task.team,
        technician: task.technician,
        status: task.status,
        isOverdue: task.isOverdue,
        description: task.description,
        estimatedHours: task.estimatedHours
      };
    });

    res.json({
      success: true,
      data: formattedTasks,
      count: formattedTasks.length,
      message: `Found ${formattedTasks.length} upcoming tasks`
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
      estimatedHours = 2,
      scheduleType = 'one-time',
      recurrencePattern,
      isRecurring = false
    } = req.body;

    console.log('Scheduling maintenance:', {
      subject, equipment, team, scheduledDate, requestType
    });

    // Validate required fields
    if (!subject || !equipment || !team || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, equipment, team, and scheduled date'
      });
    }

    // Validate scheduledDate is valid
    const scheduledDateObj = new Date(scheduledDate);
    if (isNaN(scheduledDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid scheduled date'
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
      scheduledDate: scheduledDateObj,
      estimatedHours,
      scheduleType,
      recurrencePattern,
      isRecurring,
      status: 'scheduled', // Default status
      nextScheduledDate: isRecurring ? scheduledDateObj : null,
      createdBy: req.user._id
    });

    console.log(`Created maintenance request: ${request._id}`);

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
    console.log(`Scheduled next occurrence for ${request._id}: ${nextDate}`);
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
      data: populatedRequest,
      message: 'Schedule updated successfully'
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reschedule a task
// @route   PUT /api/maintenance/:id/reschedule
// @access  Private (Admin, Manager)
exports.rescheduleTask = async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Validate new date
    const newDate = new Date(scheduledDate);
    if (isNaN(newDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Update scheduled date
    request.scheduledDate = newDate;
    request.status = 'scheduled'; // Reset status if it was overdue
    await request.save();

    res.json({
      success: true,
      data: request,
      message: 'Task rescheduled successfully'
    });
  } catch (error) {
    console.error('Reschedule task error:', error);
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
        createdBy: req.user._id,
        createdAt: new Date()
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
    if (request.equipment) {
      await Equipment.findByIdAndUpdate(request.equipment, {
        lastMaintenanceDate: new Date(),
        nextMaintenanceDate: request.nextScheduledDate
      });
    }

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
    endOfMonth.setHours(23, 59, 59, 999);

    console.log('Getting maintenance stats for month:', startOfMonth, 'to', endOfMonth);

    // Get stats for current month - REMOVED requestType filter
    const monthlyStats = await MaintenanceRequest.aggregate([
      {
        $match: {
          scheduledDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
          // REMOVED: requestType: 'preventive'
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

    // Get upcoming tasks count (from today onward) - REMOVED requestType filter
    const upcomingCount = await MaintenanceRequest.countDocuments({
      scheduledDate: { $gte: now },
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get overdue tasks count (before today and not completed/cancelled) - REMOVED requestType filter
    const overdueCount = await MaintenanceRequest.countDocuments({
      scheduledDate: { $lt: now },
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get total scheduled for the month - REMOVED requestType filter
    const totalScheduled = await MaintenanceRequest.countDocuments({
      scheduledDate: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Get breakdown by request type
    const typeStats = await MaintenanceRequest.aggregate([
      {
        $match: {
          scheduledDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: '$requestType',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Stats calculated:', {
      monthlyStats,
      upcomingCount,
      overdueCount,
      totalScheduled,
      typeStats
    });

    res.json({
      success: true,
      data: {
        monthlyStats,
        upcomingCount,
        overdueCount,
        totalScheduled,
        typeStats
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

// @desc    Get overdue tasks - REMOVED requestType filter
exports.getOverdueTasks = async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const overdueTasks = await MaintenanceRequest.find({
      scheduledDate: { $lt: now },
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

// @desc    Get task details by ID
// @route   GET /api/maintenance/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await MaintenanceRequest.findById(req.params.id)
      .populate('equipment', 'name serialNumber model location')
      .populate('team', 'name members')
      .populate('technician', 'name email phone')
      .populate('createdBy', 'name email')
      .populate('completedBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};