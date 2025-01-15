import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Lock } from 'lucide-react';
import { authService } from '../services/authService';
import './Register.css';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Access the `state.from` value

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      const token = response.token;
      const role = response.role;

      // Save token and role to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      setIsAuthenticated(true);

      // Retrieve the `from` path if it exists
      const redirectUrl = location.state?.from;

      if (redirectUrl) {
        // If there's a `from` path, redirect back to it
        navigate(redirectUrl, { replace: true });
      } else {
        // Otherwise, navigate based on the role
        switch (role) {
          case 'admin':
            navigate('/admin-dashboard'); // Redirect to admin dashboard
            break;
          case 'writer':
            navigate('/post-list'); // Redirect writers to their dashboard
            break;
          default:
            navigate('/'); // Default redirect for regular users
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('Login error', err);
    } finally {
      setIsLoading(false);
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
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <div className="input-wrapper">
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
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
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
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
