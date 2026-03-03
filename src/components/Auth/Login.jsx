import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../../services/authService';
import { ForgotPasswordLink } from '../Auth';
import './MoiAuth.css';

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case 'admin':     return '/moilinkadmin';
      case 'writer':    return '/post-list';
      case 'vendor':    return '/vendor/dashboard/';
      case 'shopowner': return '/eshop/dashboard/';
      default:          return '/';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      console.log("Login response:", response); // Debug log
      
      if (!response.user?.role) throw new Error('User role is missing from response!');
      setIsAuthenticated(true);
      const redirectUrl = location.state?.from || getDashboardRoute(response.user.role) || '/';
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError(err.message || 'Invalid email/username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null);
      setIsLoading(true);
      try {
        console.log("Google token response:", tokenResponse); // Debug log
        
        // Send access_token directly
        const response = await authService.googleLogin(tokenResponse.access_token);
        console.log("Google login response:", response); // Debug log
        
        // Check the response structure
        if (!response) {
          throw new Error('No response from server');
        }
        
        // Handle different possible response structures
        let userData = response.user || response.data?.user || response;
        let token = response.token || response.data?.token;
        
        if (!token || !userData) {
          console.error("Unexpected response structure:", response);
          throw new Error('Invalid response structure from server');
        }
        
        // Manually store in localStorage if authService didn't already
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token);
          localStorage.setItem('_id', userData._id);
          localStorage.setItem('userId', userData._id);
          localStorage.setItem('role', userData.role);
          localStorage.setItem('username', userData.username);
          localStorage.setItem('userEmail', userData.email);
        }
        
        if (!userData.role) throw new Error('User role is missing from response!');
        
        setIsAuthenticated(true);
        const redirectUrl = location.state?.from || getDashboardRoute(userData.role) || '/';
        navigate(redirectUrl, { replace: true });
      } catch (err) {
        console.error("Google login error:", err);
        setError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError('Google sign-in was cancelled or failed.');
    },
  });

  return (
    <div className="moi-root">
      {/* ── Left panel ── */}
      <div className="moi-left">
        <div className="moi-left-body">
          <div className="moi-tagchip">
            <span className="moi-tagchip-dot" />
            Moi University · Student Platform
          </div>

          <h1 className="moi-headline">
            Your campus,<br />
            <em>all in one place.</em>
          </h1>

          <p className="moi-sub">
            Rentals, roommates, food, shopping — everything you need as a student, right here.
          </p>

          <div className="moi-features">
            {[
              { icon: '🏠', label: 'Verified student housing' },
              { icon: '🤝', label: 'Smart roommate matching' },
              { icon: '🛍️', label: 'Peer-to-peer marketplace' },
              { icon: '🍱', label: 'Food from campus vendors' },
              { icon: '💬', label: 'Real-time messaging' },
            ].map(({ icon, label }) => (
              <div className="moi-feat" key={label}>
                <div className="moi-feat-icon">{icon}</div>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="moi-art" aria-hidden="true">
          <div className="moi-art-circle moi-art-circle--1" />
          <div className="moi-art-circle moi-art-circle--2" />
          <div className="moi-art-circle moi-art-circle--3" />
          <div className="moi-art-glow moi-art-glow--1" />
          <div className="moi-art-glow moi-art-glow--2" />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="moi-right">
        <div className="moi-card">
          <div className="moi-card-header">
            <div className="moi-card-eyebrow">Welcome back</div>
            <h2>Sign in to MoiHub</h2>
            <p>New here? <Link to="/register" className="moi-link">Create a free account</Link></p>
          </div>

          {/* Google SSO — live */}
          <button
            className="moi-btn-google moi-btn-google--active"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
            type="button"
          >
            <svg width="17" height="17" viewBox="0 0 48 48">
              <path d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" fill="#FFC107"/>
              <path d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
              <path d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" fill="#4CAF50"/>
              <path d="M43.6 20.1H42V20H24v8h11.3a12 12 0 01-4.1 5.6l6.2 5.2C42 36.5 44 30.7 44 24c0-1.3-.1-2.6-.4-3.9z" fill="#1976D2"/>
            </svg>
            Continue with Google
          </button>

          <div className="moi-divider"><span>or sign in with email</span></div>

          {error && (
            <div className="moi-error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="moi-form" noValidate>
            <div className={`moi-field${focused === 'emailOrUsername' ? ' is-focused' : ''}`}>
              <label htmlFor="emailOrUsername">Email or Username</label>
              <input
                id="emailOrUsername"
                name="emailOrUsername"
                type="text"
                placeholder="you@email.com or @username"
                value={credentials.emailOrUsername}
                onChange={handleChange}
                onFocus={() => setFocused('emailOrUsername')}
                onBlur={() => setFocused('')}
                required
                autoComplete="username"
              />
            </div>

            <div className={`moi-field${focused === 'password' ? ' is-focused' : ''}`}>
              <div className="moi-field-row">
                <label htmlFor="password">Password</label>
                <ForgotPasswordLink className="moi-forgot" />
              </div>
              <div className="moi-input-row">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="moi-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="moi-btn-primary" disabled={isLoading}>
              {isLoading
                ? <><span className="moi-spinner" /> Signing in…</>
                : <>Sign in <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <p className="moi-footer">
            Don't have an account?{' '}
            <Link to="/register" className="moi-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;