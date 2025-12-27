// src/context/AuthContext.jsx - Fixed version
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // src/context/AuthContext.jsx - Fixed checkUser function
const checkUser = useCallback(async () => {
  try {
    console.log('🔄 Checking authentication on refresh...');
    
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    console.log('🔑 Token exists:', !!token);
    console.log('👤 Stored user exists:', !!storedUser);
    
    if (token) {
      try {
        // If we have a stored user, use it immediately
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('📦 Setting user from localStorage:', parsedUser.email);
          setUser(parsedUser);
        }
        
        // Then try to fetch fresh data from backend in background
        console.log('🔄 Fetching fresh user data from backend...');
        const response = await authService.getCurrentUser();
        console.log('✅ Fresh user data response:', response);
        
        // Update with fresh data
        if (response?.success && response?.data) {
          console.log('✅ Setting fresh user data:', response.data.email);
          setUser(response.data);
          // Store both token and user data
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (fetchError) {
        console.error('❌ Failed to fetch fresh user data:', fetchError);
        // If fetch fails but we have token, keep using localStorage data
        // Only clear if it's a 401 unauthorized error
        if (fetchError.response?.status === 401) {
          console.log('🔒 Token invalid, clearing storage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } else {
      console.log('❌ No token found in localStorage');
      localStorage.removeItem('user');
      setUser(null);
    }
  } catch (error) {
    console.error('❌ Error in checkUser:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  } finally {
    console.log('✅ Auth check complete, loading false');
    setLoading(false);
  }
}, []);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted');
    checkUser();
  }, [checkUser]);

  // src/context/AuthContext.jsx - Update login function
const login = async (email, password) => {
  try {
    setError(null);
    setLoading(true);
    console.log('🔐 Attempting login for:', email);
    
    const response = await authService.login({ email, password });
    console.log('✅ Login response:', response);
    
    // Extract user data
    let userData = null;
    if (response?.data) {
      userData = response.data; // This should contain token and user info
    } else if (response) {
      userData = response;
    }
    
    console.log('📦 Setting user after login:', userData?.email);
    console.log('🔑 Token stored:', !!localStorage.getItem('token'));
    
    setUser(userData);
    setLoading(false);
    
    return { 
      success: true, 
      data: response,
      user: userData
    };
  } catch (error) {
    console.error('❌ Login failed:', error);
    setError(error.message || 'Login failed');
    setLoading(false);
    return { success: false, error: error.message };
  }
};

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      console.log('📝 Attempting registration for:', userData.email);
      
      const response = await authService.register(userData);
      console.log('✅ Registration response:', response);
      
      // Extract user data
      let extractedUser = null;
      if (response.data) {
        extractedUser = response.data;
      } else if (response.user) {
        extractedUser = response.user;
      } else {
        extractedUser = response;
      }
      
      setUser(extractedUser);
      setLoading(false);
      return { success: true, data: response, user: extractedUser };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setError(error.message || 'Registration failed');
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    setLoading(true);
    await authService.logout();
    setUser(null);
    setLoading(false);
    console.log('✅ Logout complete');
  };

  // Function to manually refresh user data (call this after page refresh)
  const refreshUserData = async () => {
    try {
      if (authService.isAuthenticated()) {
        const freshData = await authService.getCurrentUser();
        if (freshData?.data) {
          setUser(freshData.data);
          localStorage.setItem('user', JSON.stringify(freshData.data));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshUserData,
    isAuthenticated: !!user,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};