// src/services/authService.js
import axios from './api'; // Make sure this is your configured axios instance

const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log('📤 Sending registration request:', userData.email);
      const response = await axios.post('/auth/register', userData);
      console.log('✅ Registration API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('📤 Sending login request:', credentials.email);
      const response = await axios.post('/auth/login', credentials);
      console.log('✅ Login API response:', response.data);
      
      // Store token and user data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      console.log('📤 Fetching current user with token');
      const response = await axios.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('✅ Current user API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get user error:', error.response?.data || error.message);
      
      // Clear invalid token
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      throw error.response?.data || { message: 'Failed to get user' };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get stored user data
  getUserFromStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;