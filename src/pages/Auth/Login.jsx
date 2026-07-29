// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import './Auth.css';

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ emailOrUsername, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        await googleLogin(tokenResponse.access_token);
        navigate(from, { replace: true });
      } catch (err) {
        setError(err.message || 'Google sign-in failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      if (error.error === 'popup_blocked') {
        setError('Popup was blocked. Please allow popups for this site or try using the email login instead.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
      setGoogleLoading(false);
    },
    flow: 'implicit',
    scope: 'openid profile email',
    authMethod: 'popup',
  });

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Login - Moihub</title>
        
        {/* Meta Description */}
        <meta name="description" content="Login to your Moihub account to access rentals, food delivery, shopping, and campus services at Moi University." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Login - Moihub" />
        <meta property="og:description" content="Login to your Moihub account to access rentals, food delivery, shopping, and campus services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/login" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Moihub" />
        <meta name="twitter:description" content="Login to your Moihub account to access campus services." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/login" />
        
        {/* No index for login page (optional) */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-tag">Welcome back</span>
          <h2 className="auth-title">Log in to MoiHub</h2>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Username or email</span>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter username or email"
                required
                disabled={loading}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </label>

            <div className="field-hint" style={{ textAlign: 'right', marginTop: '-6px' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button
            type="button"
            className="auth-google-btn"
            disabled={googleLoading}
            onClick={() => handleGoogleLogin()}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 45c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2.1 1.5-4.8 2.4-7.7 2.4-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.6 40.5 16.3 45 24 45z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.6 5.6C41.6 35.9 45 30.5 45 24c0-1.4-.1-2.7-.4-3.5z" />
            </svg>
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;