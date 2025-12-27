// src/components/ProtectedRoute.jsx - Updated
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';



const ProtectedRoute = ({ children }) => {
  const { user, loading, refreshUserData } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // If loading from context is done but user is null, 
      // but we have token in localStorage, try to refresh
      if (!loading && !user && localStorage.getItem('token')) {
        console.log('🔄 Token exists but user is null, refreshing...');
        await refreshUserData();
      }
      setCheckingAuth(false);
    };
    
    checkAuth();
  }, [loading, user, refreshUserData]);

  // Show loading spinner while checking
  if (checkingAuth || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Checking authentication...</span>
      </div>
    );
  }

  // Check both user state and localStorage token
  const isAuthenticated = user || localStorage.getItem('token');
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;