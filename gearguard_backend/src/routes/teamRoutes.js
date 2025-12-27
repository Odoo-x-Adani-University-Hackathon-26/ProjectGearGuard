const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  getTeamRequests
} = require('../controllers/teamController');

router.use(protect);

router.post('/', authorize('admin', 'manager'), createTeam);
router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/:id/requests', getTeamRequests);
router.put('/:id', authorize('admin', 'manager'), updateTeam);
router.put('/:id/add-member', authorize('admin', 'manager'), addTeamMember);
router.put('/:id/remove-member', authorize('admin', 'manager'), removeTeamMember);
router.delete('/:id', authorize('admin'), deleteTeam);

module.exports = router;