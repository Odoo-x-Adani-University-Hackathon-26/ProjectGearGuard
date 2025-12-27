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
  getRequestsStats,
} = require('../controllers/maintanenceController');

// Add these imports
const {
  getMaintenanceSchedule,
  getUpcomingTasks,
  scheduleMaintenance,
  updateSchedule,
  markAsCompleted,
  getMaintenanceStats,
  getOverdueTasks
} = require('../controllers/calenderController');

// Public routes (if any)

// Protected routes
router.use(protect);

// ====== CALENDAR ROUTES FIRST (BEFORE PARAMETERIZED ROUTES) ======
router.get('/calendar', getMaintenanceSchedule);
router.get('/upcoming', getUpcomingTasks);
router.get('/calendar/stats', getMaintenanceStats);
router.get('/overdue', getOverdueTasks);
router.post('/schedule', authorize('admin', 'manager'), scheduleMaintenance);
router.put('/schedule/:id', authorize('admin', 'manager'), updateSchedule);
router.put('/:id/complete', authorize('technician', 'admin', 'manager'), markAsCompleted);

// ====== OTHER ROUTES ======
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
// THIS MUST BE LAST - IT'S A CATCH-ALL FOR IDs
router.get('/:id', getRequestById);
router.put('/:id', authorize('admin', 'manager'), updateRequest);
router.delete('/:id', authorize('admin'), deleteRequest);

module.exports = router;