import axios from 'axios';

const BASE_URL = 'https://moihub.onrender.com/api/auth';

export const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials);
      console.log("Raw API Response:", response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role);
      } else {
        throw new Error("Token is missing in response!");
      }

      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error('Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getRole: () => {
    return localStorage.getItem('role');
  },

  isAdmin: () => {
    return localStorage.getItem('role') === 'admin';
  },

  isWriter: () => {
    return localStorage.getItem('role') === 'writer';
  }
};
