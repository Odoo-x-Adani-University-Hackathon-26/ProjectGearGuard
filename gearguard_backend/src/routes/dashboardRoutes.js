const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getEquipmentHealth,
  getTechnicianWorkload,
  getQuickStats
} = require('../controllers/dashboardController');

router.use(protect);

// All authenticated users can access dashboard stats
router.get('/stats', getDashboardStats);
router.get('/quick-stats', getQuickStats);
router.get('/equipment-health', getEquipmentHealth);

// Only admins and managers can see technician workload
router.get('/technician-workload', authorize('admin', 'manager'), getTechnicianWorkload);

module.exports = router;