const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  getDepartmentEquipment
} = require('../controllers/departmentController');

router.use(protect);

router.post('/', authorize('admin'), createDepartment);
router.get('/', getAllDepartments);
router.get('/:id', getDepartmentById);
router.get('/:id/equipment', getDepartmentEquipment);
router.put('/:id', authorize('admin'), updateDepartment);
router.delete('/:id', authorize('admin'), deleteDepartment);

module.exports = router;