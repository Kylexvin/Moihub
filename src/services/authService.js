import axios from 'axios';

const BASE_URL = 'https://moihub.onrender.com/api/auth';

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

// Enhanced error handling function
const handleApiError = (error) => {
  console.error("API Error:", error.response ? error.response.data : error.message);
  
  const customError = {
    message: error.response?.data?.message || error.message || 'An error occurred',
    status: error.response?.status,
    data: error.response?.data
  };
  
  // Handle token expiration
  if (error.response?.status === 401) {
    authService.logout();
    // Only redirect if not already on auth pages
    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
  }
  
  return customError;
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

      if (response.data.token) {
        // Store all user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userEmail', response.data.email);
      } else {
        throw new Error("Token is missing in response!");
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