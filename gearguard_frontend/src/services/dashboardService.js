import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      console.log('📤 Fetching dashboard statistics');
      const response = await api.get('/dashboard/stats');
      console.log('✅ Dashboard stats fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch dashboard statistics' };
    }
  },

  // Get quick stats
  getQuickStats: async () => {
    try {
      console.log('📤 Fetching quick stats');
      const response = await api.get('/dashboard/quick-stats');
      console.log('✅ Quick stats fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get quick stats error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch quick stats' };
    }
  },

  // Get equipment health
  getEquipmentHealth: async () => {
    try {
      console.log('📤 Fetching equipment health');
      const response = await api.get('/dashboard/equipment-health');
      console.log('✅ Equipment health fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get equipment health error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch equipment health' };
    }
  },

  // Get technician workload
  getTechnicianWorkload: async () => {
    try {
      console.log('📤 Fetching technician workload');
      const response = await api.get('/dashboard/technician-workload');
      console.log('✅ Technician workload fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get technician workload error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch technician workload' };
    }
  },
};

export default dashboardService;