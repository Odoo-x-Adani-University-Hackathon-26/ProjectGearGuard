// src/components/ProtectedRoute.jsx - More reliable version
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { user, loading, refreshUserData } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if we have a token in localStorage
      const token = localStorage.getItem('token');
      
      if (token && !user && !loading) {
        console.log('🔄 Token exists but user is null, refreshing...');
        try {
          await refreshUserData();
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      }
      
      // Give a small delay to ensure context is fully loaded
      setTimeout(() => {
        setCheckingAuth(false);
      }, 100);
    };
    
    checkAuth();
  }, [loading, user, refreshUserData]);

  // Show loading spinner while checking
  if (checkingAuth || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="mt-3 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // Check authentication - look at localStorage first, then context
  const token = localStorage.getItem('token');
  const isAuthenticated = token || user;
  
  console.log('🔍 Auth check:', {
    hasToken: !!token,
    hasUser: !!user,
    isAuthenticated,
    path: location.pathname
  });
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('✅ User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;