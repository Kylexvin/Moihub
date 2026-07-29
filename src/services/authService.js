// src/services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors to the api instance, not axios directly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const data = response.data;
      
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('avatar', data.user.avatar || '');
        localStorage.setItem('expiresIn', data.expiresIn);
      }
      
      return data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  googleLogin: async (accessToken) => {
    try {
      const response = await api.post('/social-login', {
        provider: 'google',
        token: accessToken,
      });

      const data = response.data;
      console.log("Google login response:", data);

      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('role', data.user.role);
        localStorage.setItem('avatar', data.user.avatar || '');
        localStorage.setItem('expiresIn', data.expiresIn);
      } else {
        throw new Error('Invalid response from server');
      }

      return data;
    } catch (error) {
      console.error("Google login error:", error);
      throw error.response?.data || { message: error.message };
    }
  },

  // ===== PASSWORD RESET FUNCTIONS =====
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // ===== EMAIL VERIFICATION =====
  resendVerification: async (email) => {
    try {
      const response = await api.post('/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // ===== AUTHENTICATED USER ACTIONS =====
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('avatar');
    localStorage.removeItem('expiresIn');
  },

  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email'),
      role: localStorage.getItem('role'),
      avatar: localStorage.getItem('avatar'),
      expiresIn: localStorage.getItem('expiresIn'),
    };
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getRole: () => {
    return localStorage.getItem('role');
  },

  isAdmin: () => {
    return localStorage.getItem('role') === 'admin';
  }
};