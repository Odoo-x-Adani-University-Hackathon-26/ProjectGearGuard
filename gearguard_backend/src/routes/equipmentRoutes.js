const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  getEquipmentByDepartment,
  getEquipmentMaintenanceHistory,
  updateEquipmentStatus
} = require('../controllers/equipmentController');

router.use(protect);

router.post('/', authorize('admin', 'manager'), createEquipment);
router.get('/', getAllEquipment);
router.get('/department/:deptId', getEquipmentByDepartment);
router.get('/:id', getEquipmentById);
router.get('/:id/maintenance-history', getEquipmentMaintenanceHistory);
router.put('/:id', authorize('admin', 'manager'), updateEquipment);
router.put('/:id/status', authorize('admin', 'manager', 'technician'), updateEquipmentStatus);
router.delete('/:id', authorize('admin'), deleteEquipment);

module.exports = router;