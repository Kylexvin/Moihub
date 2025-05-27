import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import { ForgotPasswordLink } from './Auth'


import './Register.css';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);
      console.log("Login Success:", response);

      if (!response.role) {
        throw new Error("User role is missing from response!");
      }

      localStorage.setItem('role', response.role); // Ensure role is stored
      const userRole = localStorage.getItem('role');
      console.log("Stored Role in LocalStorage:", userRole);

      setIsAuthenticated(true);

      const redirectUrl = location.state?.from || getDashboardRoute(userRole) || '/';
      navigate(redirectUrl, { replace: true });

    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Invalid email/username or password");
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'admin': return '/moilinkadmin';
      case 'writer': return '/post-list';
      case 'vendor': return '/vendor/dashboard/';
      case 'shopowner': return '/eshop/dashboard/';
      default: return '/';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <LogIn size={40} className="auth-icon" />
          <h2>Welcome Back</h2>
          <p>Login to continue to your account</p>
        </div>
        {error && <div className="error-message"><p>{error}</p></div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              placeholder="Enter your email or username"
              value={credentials.emailOrUsername}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
             
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>
          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Register</Link></p>
          <ForgotPasswordLink />
        </div>
      </div>
    </div>
  );
}

export default Login;
