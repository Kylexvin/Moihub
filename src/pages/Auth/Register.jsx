// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import './Auth.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not create your account');
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
        navigate('/', { replace: true });
      } catch (err) {
        setError(err.message || 'Google sign-up failed');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError('Google sign-up failed. Please try again.');
      setGoogleLoading(false);
    },
    flow: 'implicit',
    scope: 'openid profile email',
  });

  return (
    <>
      <Helmet>
        {/* Title */}
        <title>Register - Moihub | Join the Campus Community</title>
        
        {/* Meta Description */}
        <meta name="description" content="Create your Moihub account to find rentals, order food, shop, and access campus services at Moi University. Join the campus community today." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Register - Moihub | Join the Campus Community" />
        <meta property="og:description" content="Create your Moihub account to find rentals, order food, shop, and access campus services at Moi University." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moihub-silk.vercel.app/register" />
        <meta property="og:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Register - Moihub | Join the Campus Community" />
        <meta name="twitter:description" content="Create your Moihub account to find rentals, order food, shop, and access campus services." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dlyfxympd/image/upload/v1745769284/djqvpsaazftvdzbaii1d.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moihub-silk.vercel.app/register" />
        
        {/* No index for register page (optional) */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-tag">Join MoiHub</span>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">One account works across the app and the website.</p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
                disabled={loading}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="At least 8 characters"
                required
                disabled={loading}
              />
            </label>

            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                disabled={loading}
              />
            </label>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Creating account…' : 'Create account'}
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
            {googleLoading ? 'Signing up…' : 'Continue with Google'}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;