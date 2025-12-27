import api from './api';

const maintenanceService = {
  // Create maintenance request
  createRequest: async (requestData) => {
    try {
      console.log('📤 Creating maintenance request:', requestData);
      const response = await api.post('/maintenance', requestData);
      console.log('✅ Request created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create request error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to create request' };
    }
  },

  // Get all maintenance requests
  getAllRequests: async (params = {}) => {
    try {
      console.log('📤 Fetching maintenance requests');
      const response = await api.get('/maintenance', { params });
      console.log('✅ Requests fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get requests error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch requests' };
    }
  },

  // Get request by ID
  getRequestById: async (id) => {
    try {
      console.log(`📤 Fetching request ${id}`);
      const response = await api.get(`/maintenance/${id}`);
      console.log('✅ Request fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get request error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch request' };
    }
  },

  // Get my requests (for employees)
  getMyRequests: async () => {
    try {
      console.log('📤 Fetching my requests');
      const response = await api.get('/maintenance/my-requests');
      console.log('✅ My requests fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get my requests error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch my requests' };
    }
  },

  // Get team requests (for technicians)
  getTeamRequests: async () => {
    try {
      console.log('📤 Fetching team requests');
      const response = await api.get('/maintenance/team-requests');
      console.log('✅ Team requests fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get team requests error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch team requests' };
    }
  },

  // Update request status
  updateRequestStatus: async (id, statusData) => {
    try {
      console.log(`📤 Updating request ${id} status:`, statusData);
      const response = await api.put(`/maintenance/${id}/status`, statusData);
      console.log('✅ Status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update status error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update status' };
    }
  },

  // Assign technician
  assignTechnician: async (id, technicianId) => {
    try {
      console.log(`📤 Assigning technician ${technicianId} to request ${id}`);
      const response = await api.put(`/maintenance/${id}/assign`, { technicianId });
      console.log('✅ Technician assigned:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Assign technician error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to assign technician' };
    }
  },

  // Add note to request
  addNote: async (id, content) => {
    try {
      console.log(`📤 Adding note to request ${id}:`, content);
      const response = await api.post(`/maintenance/${id}/notes`, { content });
      console.log('✅ Note added:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Add note error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to add note' };
    }
  },

  // Get maintenance statistics
  getRequestsStats: async () => {
    try {
      console.log('📤 Fetching maintenance statistics');
      const response = await api.get('/maintenance/stats');
      console.log('✅ Stats fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get stats error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },

  // Update request
  updateRequest: async (id, requestData) => {
    try {
      console.log(`📤 Updating request ${id}:`, requestData);
      const response = await api.put(`/maintenance/${id}`, requestData);
      console.log('✅ Request updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update request error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update request' };
    }
  },

  // Delete request
  deleteRequest: async (id) => {
    try {
      console.log(`📤 Deleting request ${id}`);
      const response = await api.delete(`/maintenance/${id}`);
      console.log('✅ Request deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete request error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete request' };
    }
  },
};

export default maintenanceService;