import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth'; // Adjust to your backend URL

export const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, credentials);
      
      // Store token, user ID, and role in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('role', response.data.role); // Store the user role
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role'); // Remove role on logout
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token'); // Checks if a token exists
  },

  isWriter: () => {
    // Checks if the user role is 'writer'
    return localStorage.getItem('role') === 'writer';
  }
};
 