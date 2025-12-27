const Equipment = require('../models/Equipment');
const Department = require('../models/Department');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private (Admin, Manager)
exports.createEquipment = async (req, res) => {
  try {
    const {
      name,
      serialNumber,
      department,
      owner,
      maintenanceTeam,
      defaultTechnician,
      location,
      specifications,
      purchaseDate,
      warrantyEndDate,
      status
    } = req.body;

    // Validate required fields
    if (!name || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide equipment name and department'
      });
    }

    // Check if department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if serial number is unique
    if (serialNumber) {
      const existingEquipment = await Equipment.findOne({ serialNumber });
      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: 'Serial number already exists'
        });
      }
    }

    // Validate maintenance team if provided
    if (maintenanceTeam) {
      const teamExists = await MaintenanceTeam.findById(maintenanceTeam);
      if (!teamExists) {
        return res.status(404).json({
          success: false,
          message: 'Maintenance team not found'
        });
      }
    }

    // Validate default technician if provided
    if (defaultTechnician) {
      const technicianExists = await User.findById(defaultTechnician);
      if (!technicianExists || !['technician', 'admin'].includes(technicianExists.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid technician'
        });
      }
    }

    // Create equipment
    const equipment = await Equipment.create({
      name,
      serialNumber,
      department,
      owner,
      maintenanceTeam,
      defaultTechnician,
      location,
      specifications,
      purchaseDate,
      warrantyEndDate,
      status: status || 'active'
    });

    // Populate related fields
    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('department', 'name')
      .populate('maintenanceTeam', 'name')
      .populate('defaultTechnician', 'name email')
      .populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: populatedEquipment
    });
  } catch (error) {
    console.error('Create equipment error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Serial number must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
exports.getAllEquipment = async (req, res) => {
  try {
    const {
      department,
      status,
      maintenanceTeam,
      search,
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    if (department) query.department = department;
    if (status) query.status = status;
    if (maintenanceTeam) query.maintenanceTeam = maintenanceTeam;

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const equipment = await Equipment.find(query)
      .populate('department', 'name')
      .populate('maintenanceTeam', 'name')
      .populate('defaultTechnician', 'name email')
      .populate('owner', 'name email')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Equipment.countDocuments(query);

    res.json({
      success: true,
      count: equipment.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: equipment
    });
  } catch (error) {
    console.error('Get all equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Private
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('department', 'name description')
      .populate('maintenanceTeam', 'name teamLeader members')
      .populate('defaultTechnician', 'name email role')
      .populate('owner', 'name email')
      .populate('maintenanceHistory');

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Get maintenance history
    const maintenanceHistory = await MaintenanceRequest.find({ 
      equipment: equipment._id 
    })
      .populate('technician', 'name email')
      .populate('team', 'name')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        ...equipment.toObject(),
        maintenanceHistory
      }
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Admin, Manager)
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Check for unique serial number
    if (req.body.serialNumber && req.body.serialNumber !== equipment.serialNumber) {
      const existingEquipment = await Equipment.findOne({ 
        serialNumber: req.body.serialNumber 
      });
      if (existingEquipment) {
        return res.status(400).json({
          success: false,
          message: 'Serial number already exists'
        });
      }
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== '__v') {
        equipment[key] = updates[key];
      }
    });

    // Update maintenance dates if status changed
    if (updates.status === 'under_maintenance' && equipment.status !== 'under_maintenance') {
      equipment.lastMaintenanceDate = new Date();
    }

    await equipment.save();

    const populatedEquipment = await Equipment.findById(equipment._id)
      .populate('department', 'name')
      .populate('maintenanceTeam', 'name')
      .populate('defaultTechnician', 'name email');

    res.json({
      success: true,
      data: populatedEquipment
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Serial number must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update equipment status
// @route   PUT /api/equipment/:id/status
// @access  Private (Admin, Manager, Technician)
exports.updateEquipmentStatus = async (req, res) => {
  try {
    const { status, nextMaintenanceDate } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    equipment.status = status;

    // Update maintenance dates
    if (status === 'under_maintenance') {
      equipment.lastMaintenanceDate = new Date();
    }

    if (nextMaintenanceDate) {
      equipment.nextMaintenanceDate = nextMaintenanceDate;
    }

    await equipment.save();

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Update equipment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get equipment by department
// @route   GET /api/equipment/department/:deptId
// @access  Private
exports.getEquipmentByDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.deptId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const equipment = await Equipment.find({ department: req.params.deptId })
      .populate('maintenanceTeam', 'name')
      .populate('defaultTechnician', 'name email')
      .sort('name');

    res.json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment by department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get equipment maintenance history
// @route   GET /api/equipment/:id/maintenance-history
// @access  Private
exports.getEquipmentMaintenanceHistory = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const maintenanceHistory = await MaintenanceRequest.find({ 
      equipment: equipment._id 
    })
      .populate('technician', 'name email')
      .populate('team', 'name')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: maintenanceHistory.length,
      data: maintenanceHistory
    });
  } catch (error) {
    console.error('Get maintenance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Admin)
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Check if equipment has active maintenance requests
    const activeRequests = await MaintenanceRequest.find({
      equipment: equipment._id,
      status: { $nin: ['completed', 'cancelled', 'scrap'] }
    });

    if (activeRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete equipment with active maintenance requests'
      });
    }

    await equipment.deleteOne();

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};