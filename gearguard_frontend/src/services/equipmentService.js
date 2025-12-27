import api from './api';

const equipmentService = {
  // Create equipment
  createEquipment: async (equipmentData) => {
    try {
      console.log('📤 Creating equipment:', equipmentData.name);
      const response = await api.post('/equipment', equipmentData);
      console.log('✅ Equipment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to create equipment' };
    }
  },

  // Get all equipment
  getAllEquipment: async (params = {}) => {
    try {
      console.log('📤 Fetching equipment');
      const response = await api.get('/equipment', { params });
      console.log('✅ Equipment fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch equipment' };
    }
  },

  // Get equipment by ID
  getEquipmentById: async (id) => {
    try {
      console.log(`📤 Fetching equipment ${id}`);
      const response = await api.get(`/equipment/${id}`);
      console.log('✅ Equipment fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch equipment' };
    }
  },

  // Get equipment by department
  getEquipmentByDepartment: async (deptId) => {
    try {
      console.log(`📤 Fetching equipment for department ${deptId}`);
      const response = await api.get(`/equipment/department/${deptId}`);
      console.log('✅ Department equipment fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get department equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch department equipment' };
    }
  },

  // Get equipment maintenance history
  getMaintenanceHistory: async (id) => {
    try {
      console.log(`📤 Fetching maintenance history for equipment ${id}`);
      const response = await api.get(`/equipment/${id}/maintenance-history`);
      console.log('✅ Maintenance history fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get maintenance history error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch maintenance history' };
    }
  },

  // Update equipment
  updateEquipment: async (id, equipmentData) => {
    try {
      console.log(`📤 Updating equipment ${id}:`, equipmentData);
      const response = await api.put(`/equipment/${id}`, equipmentData);
      console.log('✅ Equipment updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update equipment' };
    }
  },

  // Update equipment status
  updateEquipmentStatus: async (id, statusData) => {
    try {
      console.log(`📤 Updating equipment ${id} status:`, statusData);
      const response = await api.put(`/equipment/${id}/status`, statusData);
      console.log('✅ Equipment status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update equipment status error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update equipment status' };
    }
  },

  // Delete equipment
  deleteEquipment: async (id) => {
    try {
      console.log(`📤 Deleting equipment ${id}`);
      const response = await api.delete(`/equipment/${id}`);
      console.log('✅ Equipment deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete equipment error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete equipment' };
    }
  },
};

export default equipmentService;