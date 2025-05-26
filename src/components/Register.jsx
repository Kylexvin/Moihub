import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserPlus, Mail, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../services/authService';
import './Register.css';

function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }

    return true;
  };

  const handleResendVerification = async (email = registeredEmail) => {
    try {
      setIsLoading(true);
      await authService.resendVerification(email);
      
      Swal.fire({
        icon: 'success',
        title: 'Verification Email Sent!',
        text: `A new verification email has been sent to ${email}. Please check your inbox and spam folder.`,
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#4f46e5'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Resend',
        text: error.message || 'Failed to resend verification email. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUnverifiedUser = async (email, userId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Account Already Exists',
      text: 'An account with this email already exists but is not verified. Would you like to resend the verification email?',
      showCancelButton: true,
      confirmButtonText: 'Resend Verification',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      await handleResendVerification(email);
      setRegisteredEmail(email);
      setShowVerificationMessage(true);
    }
  };

  const showVerificationSuccess = (email) => {
    setRegisteredEmail(email);
    setShowVerificationMessage(true);
    
    Swal.fire({
      icon: 'success',
      title: 'Registration Successful!',
      html: `
        <p>Your account has been created successfully!</p>
        <p><strong>Important:</strong> Please check your email at <strong>${email}</strong> to verify your account before logging in.</p>
        <p>Don't forget to check your spam folder if you don't see the email.</p>
      `,
      confirmButtonText: 'I understand',
      confirmButtonColor: '#4f46e5',
      allowOutsideClick: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await authService.register(registrationData);

      // Registration successful - user needs to verify email
      showVerificationSuccess(registrationData.email);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error scenarios
      if (err.status === 409 && err.data?.action === 'resend_verification') {
        // Existing unverified user
        await handleExistingUnverifiedUser(formData.email, err.data.userId);
      } else if (err.status === 400 && err.message?.includes('already exists')) {
        // User already exists and is verified
        Swal.fire({
          icon: 'error',
          title: 'Account Already Exists',
          text: 'An account with this email or username already exists and is verified. Please try logging in instead.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#4f46e5'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      } else {
        // General registration error
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // If verification message is shown, display verification screen
  if (showVerificationMessage) {
    return (
      <div className="auth-container">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <Mail size={50} className="auth-icon verification-icon" />
            <h2>Check Your Email</h2>
            <p>We've sent a verification link to</p>
            <p className="email-highlight">{registeredEmail}</p>
          </div>

          <div className="verification-content">
            <div className="verification-steps">
              <div className="step">
                <span className="step-number">1</span>
                <span>Check your email inbox</span>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <span>Click the verification link</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Return here to log in</span>
              </div>
            </div>

            <div className="verification-actions">
              {/* <button
                onClick={() => handleResendVerification()}
                className="resend-btn"
                disabled={isLoading}
              >
                <RefreshCw size={18} />
                {isLoading ? 'Sending...' : 'Resend Email'}
              </button> */}

              <button
                onClick={handleLoginRedirect}
                className="auth-submit-btn"
              >
                Go to Login
              </button>
            </div>

            <div className="verification-help">
              <p>Didn't receive the email?</p>
              <ul>
                <li>Check your spam/junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes and try resending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <UserPlus size={40} className="auth-icon" />
          <h2>Create Account</h2>
          <p>Register to start using our platform</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .verification-icon {
          color: #4f46e5;
          margin-bottom: 1rem;
        }

        .email-highlight {
          font-weight: 600;
          color: #4f46e5;
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        .verification-content {
          text-align: center;
          padding: 2rem 0;
        }

        .verification-steps {
          margin: 2rem 0;
        }

        .step {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 1rem 0;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          text-align: left;
        }

        .step-number {
          background: #4f46e5;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
          margin-right: 1rem;
          flex-shrink: 0;
        }

        .verification-actions {
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resend-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .resend-btn:hover:not(:disabled) {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        .resend-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .verification-help {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 8px;
          text-align: left;
        }

        .verification-help p {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .verification-help ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .verification-help li {
          margin: 0.25rem 0;
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

export default Register;