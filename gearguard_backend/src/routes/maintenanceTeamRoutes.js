const express = require('express');
const router = express.Router();
const {
  getMaintenanceTeams,
  getMaintenanceTeam,
  createMaintenanceTeam,
  updateMaintenanceTeam,
  deleteMaintenanceTeam,
  getAvailableUsers,
  addTeamMember,
  removeTeamMember,
  getUsersByIds, // Add this
  getTeamStats // Add this
} = require('../controllers/maintenanceTeamController');

// Public routes
router.get('/', getMaintenanceTeams);
router.get('/:id', getMaintenanceTeam);
router.get('/:id/stats', getTeamStats); // Add this

// Protected routes (add authentication middleware as needed)
router.post('/', createMaintenanceTeam);
router.put('/:id', updateMaintenanceTeam);
router.delete('/:id', deleteMaintenanceTeam);
router.get('/users/available', getAvailableUsers);
router.post('/:id/members', addTeamMember);
router.delete('/:id/members/:userId', removeTeamMember);
router.post('/users/batch', getUsersByIds); // Add this

module.exports = router;