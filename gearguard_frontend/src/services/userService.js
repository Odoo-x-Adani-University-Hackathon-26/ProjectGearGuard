import api from './api';

const userService = {
  // Get all users (for admin)
  getAllUsers: async (params = {}) => {
    try {
      console.log('📤 Fetching users');
      const response = await api.get('/users', { params });
      console.log('✅ Users fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get users error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      console.log(`📤 Fetching user ${id}`);
      const response = await api.get(`/users/${id}`);
      console.log('✅ User fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get user error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      console.log(`📤 Updating user ${id}:`, userData);
      const response = await api.put(`/users/${id}`, userData);
      console.log('✅ User updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update user error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      console.log(`📤 Deleting user ${id}`);
      const response = await api.delete(`/users/${id}`);
      console.log('✅ User deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete user error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Get technicians
  getTechnicians: async () => {
    try {
      console.log('📤 Fetching technicians');
      const response = await api.get('/users/technicians');
      console.log('✅ Technicians fetched:', response.data.count);
      return response.data;
    } catch (error) {
      console.error('❌ Get technicians error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch technicians' };
    }
  },

  // Update user role
  updateUserRole: async (id, role) => {
    try {
      console.log(`📤 Updating user ${id} role to ${role}`);
      const response = await api.put(`/users/${id}/role`, { role });
      console.log('✅ User role updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update user role error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },
};

export default userService;