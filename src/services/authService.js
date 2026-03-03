import axios from 'axios';

const BASE_URL = 'https://moihu.onrender.com/api/auth';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// In authService.js - update the handleApiError function:

const handleApiError = (error) => {
  // Handle 401 Unauthorized
  if (error.response?.status === 401) {
    // Only clear if it's not a login/register attempt
    if (!window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/register')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  }
  
  return {
    message: error.response?.data?.message || error.message || 'An error occurred',
    status: error.response?.status,
    data: error.response?.data
  };
};

export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      console.log("Raw API Response:", response.data);

      if (response.data.token && response.data.user) {
        // Store all user data - use _id consistently
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('_id', response.data.user._id);  // Store as _id
        localStorage.setItem('userId', response.data.user._id); // Also store as userId for backward compatibility
        localStorage.setItem('role', response.data.user.role);
        localStorage.setItem('username', response.data.user.username);
        localStorage.setItem('userEmail', response.data.user.email);
      } else {
        throw new Error("Token or user data is missing in response!");
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get current user data (SINGLE DEFINITION - REMOVED THE DUPLICATE)
  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId') || localStorage.getItem('_id'),
      _id: localStorage.getItem('_id') || localStorage.getItem('userId'),
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('userEmail'),
    };
  },

  googleLogin: async (accessToken) => {
    try {
      const response = await api.post('/social-login', {
        provider: 'google',
        token: accessToken,
      });

      console.log("Google login raw response:", response.data);

      // Check if response has required data
      if (!response.data?.token || !response.data?.user) {
        console.error("Invalid response structure:", response.data);
        throw new Error('Invalid response from server');
      }

      // STORE THE DATA IN LOCALSTORAGE - THIS WAS MISSING!
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('_id', user._id);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userEmail', user.email);

      console.log("Stored user data:", {
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
        role: localStorage.getItem('role')
      });

      return response.data;
    } catch (error) {
      console.error("Google login error in service:", error);
      throw handleApiError(error);
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Verify email token
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Verify reset token
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Change password (for authenticated users)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('_id');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getRole: () => {
    return localStorage.getItem('role');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Role checking methods
  isAdmin: () => {
    return localStorage.getItem('role') === 'admin';
  },

  isWriter: () => {
    return localStorage.getItem('role') === 'writer';
  },

  isVendor: () => {
    return localStorage.getItem('role') === 'vendor';
  },

  isShopOwner: () => {
    return localStorage.getItem('role') === 'shopowner';
  },

  // Check if user has specific role
  hasRole: (role) => {
    return localStorage.getItem('role') === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles) => {
    const userRole = localStorage.getItem('role');
    return roles.includes(userRole);
  }
};