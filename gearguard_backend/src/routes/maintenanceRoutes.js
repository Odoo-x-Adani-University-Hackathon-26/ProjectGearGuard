const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  assignTechnician,
  updateStatus,
  addNote,
  getMyRequests,
  getTeamRequests,
  getRequestsStats
} = require('../controllers/maintanenceController');

// Public routes (if any)

// Protected routes
router.use(protect);

// Employee routes
router.post('/', authorize('employee', 'admin', 'manager'), createRequest);
router.get('/my-requests', getMyRequests);
router.get('/stats', getRequestsStats);

// Technician routes
router.get('/team-requests', authorize('technician', 'admin', 'manager'), getTeamRequests);
router.put('/:id/assign', authorize('technician', 'admin', 'manager'), assignTechnician);
router.put('/:id/status', authorize('technician', 'admin', 'manager'), updateStatus);
router.post('/:id/notes', authorize('technician', 'admin', 'manager'), addNote);

// Admin/Manager routes
router.get('/', authorize('admin', 'manager'), getAllRequests);
router.get('/:id', getRequestById);
router.put('/:id', authorize('admin', 'manager'), updateRequest);
router.delete('/:id', authorize('admin'), deleteRequest);

module.exports = router;