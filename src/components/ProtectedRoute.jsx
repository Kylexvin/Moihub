import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check role authorization if roles are specified
  if (allowedRoles) {
    const userRole = localStorage.getItem('userRole'); // Match the key used in your Login component

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
