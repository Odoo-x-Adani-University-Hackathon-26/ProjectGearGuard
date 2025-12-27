const Department = require('../models/Department');
const User = require('../models/User');
const Equipment = require('../models/Equipment');

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide department name'
      });
    }

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists'
      });
    }

    // Validate manager if provided
    if (manager) {
      const managerExists = await User.findById(manager);
      if (!managerExists) {
        return res.status(400).json({
          success: false,
          message: 'Manager not found'
        });
      }
    }

    const department = await Department.create({
      name,
      description,
      manager
    });

    // Populate manager
    const populatedDepartment = await Department.findById(department._id)
      .populate('manager', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedDepartment
    });
  } catch (error) {
    console.error('Create department error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department name must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
exports.getAllDepartments = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const departments = await Department.find(query)
      .populate('manager', 'name email role')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Department.countDocuments(query);

    res.json({
      success: true,
      count: departments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: departments
    });
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Private
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('manager', 'name email role');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Get department statistics
    const userCount = await User.countDocuments({ department: department._id });
    const equipmentCount = await Equipment.countDocuments({ department: department._id });
    
    const equipmentByStatus = await Equipment.aggregate([
      { $match: { department: department._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...department.toObject(),
        stats: {
          userCount,
          equipmentCount,
          equipmentByStatus
        }
      }
    });
  } catch (error) {
    console.error('Get department by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if name is being changed and is unique
    if (req.body.name && req.body.name !== department.name) {
      const existingDepartment = await Department.findOne({ name: req.body.name });
      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          message: 'Department name already exists'
        });
      }
    }

    // Validate manager if being updated
    if (req.body.manager) {
      const managerExists = await User.findById(req.body.manager);
      if (!managerExists) {
        return res.status(400).json({
          success: false,
          message: 'Manager not found'
        });
      }
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      department[key] = updates[key];
    });

    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('manager', 'name email role');

    res.json({
      success: true,
      data: populatedDepartment
    });
  } catch (error) {
    console.error('Update department error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Department name must be unique'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has users
    const userCount = await User.countDocuments({ department: department._id });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with assigned users'
      });
    }

    // Check if department has equipment
    const equipmentCount = await Equipment.countDocuments({ department: department._id });
    if (equipmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with assigned equipment'
      });
    }

    await department.deleteOne();

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get department equipment
// @route   GET /api/departments/:id/equipment
// @access  Private
exports.getDepartmentEquipment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query = { department: department._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const equipment = await Equipment.find(query)
      .populate('maintenanceTeam', 'name')
      .populate('defaultTechnician', 'name email')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Equipment.countDocuments(query);

    // Get equipment stats
    const equipmentStats = await Equipment.aggregate([
      { $match: { department: department._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: equipment.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats: equipmentStats,
      data: equipment
    });
  } catch (error) {
    console.error('Get department equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};