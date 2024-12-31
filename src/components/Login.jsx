import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn,  Lock } from 'lucide-react';
import { authService } from '../services/authService';
import './Register.css';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({
    emailOrUsername: '', // Changed from email to emailOrUsername
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const token = response.token; // Assuming response contains the token
      const role = response.role; // Capture the role from the response
      localStorage.setItem('authToken', token); // Save token to localStorage
      localStorage.setItem('userRole', role); // Save role to localStorage
      setIsAuthenticated(true); // Update authentication state

      // Redirect based on user role
      if (role === 'writer') {
        navigate('/post-list'); // Redirect to the writer's dashboard
      } else {
        navigate('/blog'); // Redirect to the homepage for normal users
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
                type="text" // Changed type from email to text
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
