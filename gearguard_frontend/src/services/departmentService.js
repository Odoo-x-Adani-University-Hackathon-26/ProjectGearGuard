import api from './api';

const departmentService = {
  // Create department
  createDepartment: async (departmentData) => {
    try {
      console.log('📤 Creating department:', departmentData.name);
      const response = await api.post('/departments', departmentData);
      console.log('✅ Department created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create department error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to create department' };
    }
  },

  // Get all departments
  getAllDepartments: async (params = {}) => {
    try {
      console.log('📤 Fetching departments');
      const response = await api.get('/departments', { params });
      console.log('✅ Departments fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get departments error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch departments' };
    }
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    try {
      console.log(`📤 Fetching department ${id}`);
      const response = await api.get(`/departments/${id}`);
      console.log('✅ Department fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get department error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch department' };
    }
  },

  // Get department equipment
  getDepartmentEquipment: async (id, params = {}) => {
    try {
      console.log(`📤 Fetching equipment for department ${id}`);
      const response = await api.get(`/departments/${id}/equipment`, { params });
      console.log('✅ Department equipment fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get department equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch department equipment' };
    }
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    try {
      console.log(`📤 Updating department ${id}:`, departmentData);
      const response = await api.put(`/departments/${id}`, departmentData);
      console.log('✅ Department updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update department error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update department' };
    }
  },

  // Delete department
  deleteDepartment: async (id) => {
    try {
      console.log(`📤 Deleting department ${id}`);
      const response = await api.delete(`/departments/${id}`);
      console.log('✅ Department deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete department error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete department' };
    }
  },
};

export default departmentService;