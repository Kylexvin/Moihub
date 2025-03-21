import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    console.warn('Access Denied: User not authenticated');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const userRole = localStorage.getItem('role')?.trim().toLowerCase();

  console.log('User Role:', userRole);
  console.log('Allowed Roles:', allowedRoles);

  if (!userRole) {
    console.error('Error: No role found for authenticated user');
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.warn(`Access Denied: User role "${userRole}" is not authorized for this page`);
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
