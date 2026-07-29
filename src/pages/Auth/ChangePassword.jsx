// src/pages/Auth/ChangePassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setDone(true);
      setTimeout(() => navigate('/profile'), 2500);
    } catch (err) {
      setError(err.message || 'Could not change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/profile" className="auth-back">← Back to profile</Link>
        <span className="auth-tag">Security</span>

        {done ? (
          <>
            <h2 className="auth-title">Password updated</h2>
            <div className="auth-success">
              Your password has been changed successfully.
            </div>
            <Link to="/profile" className="auth-submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Back to profile
            </Link>
          </>
        ) : (
          <>
            <h2 className="auth-title">Change password</h2>
            <p className="auth-subtitle">Use a strong password you haven't used before.</p>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={loading}
                />
              </label>

              <label className="field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? 'Saving…' : 'Change password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;