// src/services/foodService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/food/vendors';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const foodService = {
  checkStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/check-status`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error checking food status:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  registerVendor: async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/register`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error registering food vendor:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  updateProfile: async (formData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  getDashboard: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  getStats: async (period = 'month') => {
    try {
      const response = await axios.get(`${API_URL}/stats?period=${period}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error.response?.data || { message: error.message };
    }
  },

  toggleStatus: async () => {
    try {
      const response = await axios.patch(`${API_URL}/toggle-status`, {}, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error toggling food status:', error);
      throw error.response?.data || { message: error.message };
    }
  }
};

export default foodService;