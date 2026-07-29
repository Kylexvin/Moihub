// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(authService.getCurrentUser());
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const googleLogin = async (accessToken) => {
    const data = await authService.googleLogin(accessToken);
    setUser(authService.getCurrentUser());
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Password reset flow — used by ForgotPassword.jsx and ResetPassword.jsx
  const requestPasswordReset = (email) => authService.requestPasswordReset(email);
  const verifyResetToken = (token) => authService.verifyResetToken(token);
  const resetPassword = (token, password) => authService.resetPassword(token, password);

  // Email verification
  const resendVerification = (email) => authService.resendVerification(email);
  const verifyEmail = (token) => authService.verifyEmail(token);

  // Authenticated-user actions
  const changePassword = (currentPassword, newPassword) =>
    authService.changePassword(currentPassword, newPassword);

  const value = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
    resendVerification,
    verifyEmail,
    changePassword,
    isAuthenticated: !!user,
    role: user?.role,
    isAdmin: authService.isAdmin,
    isVendor: authService.isVendor,
    isShopOwner: authService.isShopOwner,
    isWriter: authService.isWriter,
    hasRole: authService.hasRole,
    hasAnyRole: authService.hasAnyRole,
    getToken: authService.getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}