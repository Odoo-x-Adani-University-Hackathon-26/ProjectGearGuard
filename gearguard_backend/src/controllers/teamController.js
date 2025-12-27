const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');
const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Create maintenance team
// @route   POST /api/teams
// @access  Private (Admin, Manager)
exports.createTeam = async (req, res) => {
  try {
    const { name, description, teamLeader, members, specializations } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide team name'
      });
    }

    // Validate team leader
    if (teamLeader) {
      const leader = await User.findById(teamLeader);
      if (!leader || !['technician', 'admin', 'manager'].includes(leader.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid team leader'
        });
      }
    }

    // Validate members
    if (members && members.length > 0) {
      const users = await User.find({ _id: { $in: members } });
      if (users.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more members not found'
        });
      }

      // Check if all members are technicians or admins
      const invalidMembers = users.filter(user => 
        !['technician', 'admin'].includes(user.role)
      );
      
      if (invalidMembers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Team members must be technicians or admins'
        });
      }
    }

    const team = await MaintenanceTeam.create({
      name,
      description,
      teamLeader,
      members: members || [],
      specializations: specializations || []
    });

    // Populate related fields
    const populatedTeam = await MaintenanceTeam.findById(team._id)
      .populate('teamLeader', 'name email role')
      .populate('members', 'name email role');

    res.status(201).json({
      success: true,
      data: populatedTeam
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all teams
// @route   GET /api/teams
// @access  Private
exports.getAllTeams = async (req, res) => {
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

    const teams = await MaintenanceTeam.find(query)
      .populate('teamLeader', 'name email')
      .populate('members', 'name email role')
      .sort('name')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MaintenanceTeam.countDocuments(query);

    res.json({
      success: true,
      count: teams.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: teams
    });
  } catch (error) {
    console.error('Get all teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get team by ID
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate('teamLeader', 'name email role department')
      .populate('members', 'name email role department');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Admin, Manager)
exports.updateTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Validate team leader if being updated
    if (req.body.teamLeader) {
      const leader = await User.findById(req.body.teamLeader);
      if (!leader || !['technician', 'admin', 'manager'].includes(leader.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid team leader'
        });
      }
    }

    // Validate members if being updated
    if (req.body.members && req.body.members.length > 0) {
      const users = await User.find({ _id: { $in: req.body.members } });
      if (users.length !== req.body.members.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more members not found'
        });
      }

      const invalidMembers = users.filter(user => 
        !['technician', 'admin'].includes(user.role)
      );
      
      if (invalidMembers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Team members must be technicians or admins'
        });
      }
    }

    // Update fields
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      team[key] = updates[key];
    });

    await team.save();

    const populatedTeam = await MaintenanceTeam.findById(team._id)
      .populate('teamLeader', 'name email role')
      .populate('members', 'name email role');

    res.json({
      success: true,
      data: populatedTeam
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add team member
// @route   PUT /api/teams/:id/add-member
// @access  Private (Admin, Manager)
exports.addTeamMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide member ID'
      });
    }

    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const member = await User.findById(memberId);
    if (!member || !['technician', 'admin'].includes(member.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid member. Must be a technician or admin'
      });
    }

    // Check if member already in team
    if (team.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: 'Member already in team'
      });
    }

    team.members.push(memberId);
    await team.save();

    const populatedTeam = await MaintenanceTeam.findById(team._id)
      .populate('teamLeader', 'name email')
      .populate('members', 'name email role');

    res.json({
      success: true,
      data: populatedTeam
    });
  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove team member
// @route   PUT /api/teams/:id/remove-member
// @access  Private (Admin, Manager)
exports.removeTeamMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide member ID'
      });
    }

    const team = await MaintenanceTeam.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if member is in team
    const memberIndex = team.members.indexOf(memberId);
    if (memberIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Member not found in team'
      });
    }

    // Check if member is team leader
    if (team.teamLeader && team.teamLeader.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove team leader. Change team leader first.'
      });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    const populatedTeam = await MaintenanceTeam.findById(team._id)
      .populate('teamLeader', 'name email')
      .populate('members', 'name email role');

    res.json({
      success: true,
      data: populatedTeam
    });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get team requests
// @route   GET /api/teams/:id/requests
// @access  Private
exports.getTeamRequests = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const { status, page = 1, limit = 20 } = req.query;

    const query = { team: team._id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const requests = await MaintenanceRequest.find(query)
      .populate('equipment', 'name serialNumber')
      .populate('technician', 'name email')
      .populate('createdBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MaintenanceRequest.countDocuments(query);

    // Get team stats
    const stats = await MaintenanceRequest.aggregate([
      { $match: { team: team._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats,
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

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Admin)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if team has active equipment
    const equipmentCount = await Equipment.countDocuments({ maintenanceTeam: team._id });
    if (equipmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete team that has assigned equipment'
      });
    }

    // Check if team has active requests
    const activeRequests = await MaintenanceRequest.find({
      team: team._id,
      status: { $nin: ['completed', 'cancelled', 'scrap'] }
    });

    if (activeRequests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete team with active maintenance requests'
      });
    }

    await team.deleteOne();

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};