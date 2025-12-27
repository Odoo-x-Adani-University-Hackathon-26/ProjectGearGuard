const asyncHandler = require('express-async-handler');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');
const MaintenanceTeamMember = require('../models/MaintenanceTeamMember');

const getUsersByIds = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  
  if (!userIds || !Array.isArray(userIds)) {
    res.status(400);
    throw new Error('Please provide an array of user IDs');
  }

  const users = await User.find({ _id: { $in: userIds } })
    .select('name email avatar role department');

  res.json(users);
});

// @desc    Get team statistics
// @route   GET /api/maintenance-teams/:id/stats
// @access  Public
const getTeamStats = asyncHandler(async (req, res) => {
  const teamId = req.params.id;
  
  // Mock stats - in real app, calculate from your actual data
  const stats = {
    completedTasks: Math.floor(Math.random() * 50) + 20,
    ongoingTasks: Math.floor(Math.random() * 10) + 1,
    efficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
    avgResponseTime: `${Math.floor(Math.random() * 6) + 1}h ${Math.floor(Math.random() * 60)}m`,
    totalTasks: Math.floor(Math.random() * 100) + 50,
    successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
  };
});


// @desc    Get all maintenance teams with members
// @route   GET /api/maintenance-teams
// @access  Public
const getMaintenanceTeams = asyncHandler(async (req, res) => {
  const teams = await MaintenanceTeam.find()
    .populate('teamLeader', 'name email avatar')
    .populate('members', 'name email avatar role')
    .sort({ createdAt: -1 });

  // Get active request counts for each team (you'll need to implement this based on your requests model)
  const teamsWithStats = await Promise.all(teams.map(async (team) => {
    const teamMembers = await MaintenanceTeamMember.find({ teamId: team._id });
    
    // For now, using a mock active request count
    // You should replace this with actual logic based on your Request model
    const activeRequests = Math.floor(Math.random() * 10); // Mock data
    
    return {
      ...team.toObject(),
      memberCount: team.members.length,
      activeRequests,
      teamMembers: teamMembers.map(member => member.userId)
    };
  }));

  

  res.json(teamsWithStats);
});

// @desc    Get single maintenance team
// @route   GET /api/maintenance-teams/:id
// @access  Public
const getMaintenanceTeam = asyncHandler(async (req, res) => {
  const team = await MaintenanceTeam.findById(req.params.id)
    .populate('teamLeader', 'name email avatar role')
    .populate('members', 'name email avatar role');

  if (!team) {
    res.status(404);
    throw new Error('Maintenance team not found');
  }

  // Get team members from join table
  const teamMembers = await MaintenanceTeamMember.find({ teamId: team._id })
    .populate('userId', 'name email avatar role');

  res.json({
    ...team.toObject(),
    teamMembers: teamMembers.map(member => member.userId)
  });
});

// @desc    Create new maintenance team
// @route   POST /api/maintenance-teams
// @access  Private/Admin
const createMaintenanceTeam = asyncHandler(async (req, res) => {
  const { name, description, teamLeader, members, specializations } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please provide a team name');
  }

  // Check if team leader exists
  if (teamLeader) {
    const leaderExists = await User.findById(teamLeader);
    if (!leaderExists) {
      res.status(400);
      throw new Error('Team leader not found');
    }
  }

  // Check if all members exist
  if (members && members.length > 0) {
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      res.status(400);
      throw new Error('One or more members not found');
    }
  }

  const team = await MaintenanceTeam.create({
    name,
    description,
    teamLeader: teamLeader || null,
    members: members || [],
    specializations: specializations || []
  });

  // Create entries in MaintenanceTeamMember join table
  if (members && members.length > 0) {
    const memberPromises = members.map(memberId => 
      MaintenanceTeamMember.create({
        teamId: team._id,
        userId: memberId
      })
    );
    await Promise.all(memberPromises);
  }

  const populatedTeam = await MaintenanceTeam.findById(team._id)
    .populate('teamLeader', 'name email avatar')
    .populate('members', 'name email avatar role');

  res.status(201).json(populatedTeam);
});

// @desc    Update maintenance team
// @route   PUT /api/maintenance-teams/:id
// @access  Private/Admin
const updateMaintenanceTeam = asyncHandler(async (req, res) => {
  const team = await MaintenanceTeam.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Maintenance team not found');
  }

  const { name, description, teamLeader, members, specializations } = req.body;

  // Update team
  team.name = name || team.name;
  team.description = description !== undefined ? description : team.description;
  team.teamLeader = teamLeader !== undefined ? teamLeader : team.teamLeader;
  team.specializations = specializations || team.specializations;

  // If members are being updated, update the join table
  if (members) {
    team.members = members;
    
    // Remove existing team members
    await MaintenanceTeamMember.deleteMany({ teamId: team._id });
    
    // Add new team members
    if (members.length > 0) {
      const memberPromises = members.map(memberId => 
        MaintenanceTeamMember.create({
          teamId: team._id,
          userId: memberId
        })
      );
      await Promise.all(memberPromises);
    }
  }

  const updatedTeam = await team.save();
  
  const populatedTeam = await MaintenanceTeam.findById(updatedTeam._id)
    .populate('teamLeader', 'name email avatar')
    .populate('members', 'name email avatar role');

  res.json(populatedTeam);
});

// @desc    Delete maintenance team
// @route   DELETE /api/maintenance-teams/:id
// @access  Private/Admin
const deleteMaintenanceTeam = asyncHandler(async (req, res) => {
  const team = await MaintenanceTeam.findById(req.params.id);

  if (!team) {
    res.status(404);
    throw new Error('Maintenance team not found');
  }

  // Remove team members from join table
  await MaintenanceTeamMember.deleteMany({ teamId: team._id });
  
  // Remove the team
  await team.deleteOne();

  res.json({ message: 'Maintenance team removed' });
});

// @desc    Get all users for team assignment
// @route   GET /api/maintenance-teams/users/available
// @access  Private/Admin
const getAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ 
    role: { $in: ['technician', 'manager'] },
    isActive: true 
  }).select('name email avatar role department');

  res.json(users);
});

// @desc    Add member to team
// @route   POST /api/maintenance-teams/:id/members
// @access  Private/Admin
const addTeamMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const teamId = req.params.id;

  const team = await MaintenanceTeam.findById(teamId);
  if (!team) {
    res.status(404);
    throw new Error('Maintenance team not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if member already exists
  const existingMember = await MaintenanceTeamMember.findOne({ teamId, userId });
  if (existingMember) {
    res.status(400);
    throw new Error('User is already a member of this team');
  }

  // Add to join table
  await MaintenanceTeamMember.create({ teamId, userId });

  // Add to team's members array
  if (!team.members.includes(userId)) {
    team.members.push(userId);
    await team.save();
  }

  res.status(201).json({ message: 'Member added successfully' });
});

// @desc    Remove member from team
// @route   DELETE /api/maintenance-teams/:id/members/:userId
// @access  Private/Admin
const removeTeamMember = asyncHandler(async (req, res) => {
  const { id: teamId, userId } = req.params;

  const team = await MaintenanceTeam.findById(teamId);
  if (!team) {
    res.status(404);
    throw new Error('Maintenance team not found');
  }

  // Remove from join table
  await MaintenanceTeamMember.deleteOne({ teamId, userId });

  // Remove from team's members array
  team.members = team.members.filter(member => member.toString() !== userId);
  await team.save();

  res.json({ message: 'Member removed successfully' });
});

module.exports = {
  getMaintenanceTeams,
  getMaintenanceTeam,
  createMaintenanceTeam,
  updateMaintenanceTeam,
  deleteMaintenanceTeam,
  getAvailableUsers,
  addTeamMember,
  removeTeamMember,
  getUsersByIds,
   getTeamStats
};