// src/pages/Auth/ResetPassword.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyResetToken, resetPassword } = useAuth();

  const [tokenState, setTokenState] = useState('checking'); // 'checking' | 'valid' | 'invalid'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    verifyResetToken(token)
      .then(() => {
        if (!cancelled) setTokenState('valid');
      })
      .catch(() => {
        if (!cancelled) setTokenState('invalid');
      });
    return () => {
      cancelled = true;
    };
  }, [token, verifyResetToken]);

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
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setError(err.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-tag">Reset password</span>

        {tokenState === 'checking' && (
          <>
            <h2 className="auth-title">Checking your link…</h2>
            <div className="auth-spinner" aria-hidden="true" />
            <p className="auth-subtitle" style={{ textAlign: 'center' }}>
              One moment while we verify your reset link.
            </p>
          </>
        )}

        {tokenState === 'invalid' && (
          <>
            <h2 className="auth-title">This link has expired</h2>
            <div className="auth-error" role="alert">
              Reset links only work once and expire after a while. Request a new one to continue.
            </div>
            <Link to="/forgot-password" className="auth-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Request a new link
            </Link>
          </>
        )}

        {tokenState === 'valid' && !done && (
          <>
            <h2 className="auth-title">Set a new password</h2>
            <p className="auth-subtitle">Choose something you haven't used before.</p>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>New password</span>
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
                {loading ? 'Saving…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        {done && (
          <>
            <h2 className="auth-title">Password updated</h2>
            <div className="auth-success">
              You're all set — taking you to the login page…
            </div>
          </>
        )}

        {(tokenState === 'invalid' || tokenState === 'valid') && !done && (
          <p className="auth-footer">
            Remembered it? <Link to="/login">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;