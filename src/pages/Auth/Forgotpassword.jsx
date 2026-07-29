// src/pages/Auth/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="auth-back">← Back to login</Link>
        <span className="auth-tag">Reset password</span>

        {sent ? (
          <>
            <h2 className="auth-title">Check your email</h2>
            <div className="auth-success">
              If an account exists for {email}, a reset link is on its way.
            </div>
            <p className="auth-subtitle">
              Didn't get it? Check your spam folder, or{' '}
              <button type="button" className="auth-link-btn" onClick={() => setSent(false)}>
                try again
              </button>
              .
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-title">Forgot your password?</h2>
            <p className="auth-subtitle">
              Enter the email on your account and we'll send you a link to reset it.
            </p>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
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

              <button type="submit" disabled={loading} className="auth-submit">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <p className="auth-footer">
          Remembered it? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;