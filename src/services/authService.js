import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

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

// NEW: Get current user data
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

    // Check if response has required data
    if (!response.data?.token || !response.data?.user) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
},

  // NEW: Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // NEW: Verify email token
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // NEW: Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // NEW: Verify reset token
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // NEW: Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await api.post(`/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // NEW: Change password (for authenticated users)
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

  // NEW: Get current user data
  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      userId: localStorage.getItem('userId'),
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('userEmail'),
    };
  },

  // NEW: Get auth token
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

  // NEW: Check if user has specific role
  hasRole: (role) => {
    return localStorage.getItem('role') === role;
  },

  // NEW: Check if user has any of the specified roles
  hasAnyRole: (roles) => {
    const userRole = localStorage.getItem('role');
    return roles.includes(userRole);
  }
};