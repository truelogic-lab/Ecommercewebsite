import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Security: Validate session on route change
const validateSession = (): boolean => {
  try {
    const session = localStorage.getItem('auth_user');
    if (!session) return false;
    
    const data = JSON.parse(session);
    // Check if session has required fields
    if (!data.id || !data.email || !data.role) {
      localStorage.removeItem('auth_user');
      return false;
    }
    
    // Check session expiration (if stored)
    if (data.expires && Date.now() > data.expires) {
      localStorage.removeItem('auth_user');
      return false;
    }
    
    return true;
  } catch {
    localStorage.removeItem('auth_user');
    return false;
  }
};

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Security: Validate session on every route change
  useEffect(() => {
    if (!validateSession()) {
      localStorage.removeItem('auth_user');
    }
  }, [location.pathname]);

  // Security: Prevent access to admin routes if not authenticated
  if (isLoading) {
    return (
      <div className="admin-route-loading">
        <div className="admin-route-loading__spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Security: Redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
