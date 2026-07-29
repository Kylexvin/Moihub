// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Protectedroute.css";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="route-loading">
        <div className="route-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Login.jsx reads location.state.from.pathname to redirect back here after signing in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}