import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import { authService } from '../../services/authService';
import './MoiAuth.css';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        confirmButtonColor: '#0d9e80'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Resend',
        text: error.message || 'Failed to resend verification email. Please try again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#e5534b'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingUnverifiedUser = async (email, userId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Account Already Exists',
      text: 'An account with this email exists but is not verified. Resend the verification email?',
      showCancelButton: true,
      confirmButtonText: 'Resend Verification',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0d9e80',
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
      title: 'Account Created!',
      html: `<p>Welcome to MoiHub! Please verify your email at <strong>${email}</strong> before signing in.</p>`,
      confirmButtonText: 'Got it',
      confirmButtonColor: '#0d9e80',
      allowOutsideClick: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) { setIsLoading(false); return; }
    try {
      const { confirmPassword, ...registrationData } = formData;
      await authService.register(registrationData);
      showVerificationSuccess(registrationData.email);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Registration error:', err);
      if (err.status === 409 && err.data?.action === 'resend_verification') {
        await handleExistingUnverifiedUser(formData.email, err.data.userId);
      } else if (err.status === 400 && err.message?.includes('already exists')) {
        Swal.fire({
          icon: 'error',
          title: 'Account Already Exists',
          text: 'This email or username is already registered. Try signing in instead.',
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#0d9e80'
        }).then((result) => { if (result.isConfirmed) navigate('/login'); });
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    setIsLoading(true);
    try {
      console.log("Token response:", tokenResponse);
      
      // CHANGE THIS LINE - send access_token directly, not wrapped in object
      const response = await authService.googleLogin(tokenResponse.access_token);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.user.userId);
      localStorage.setItem('role', response.user.role);
      localStorage.setItem('username', response.user.username);
      localStorage.setItem('userEmail', response.user.email);
      
      setIsAuthenticated(true);
      navigate('/', { replace: true });
      
    } catch (err) {
      console.error('Google login error:', err);
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  },
  onError: (error) => {
    console.error('Google login error:', error);
    toast.error('Google sign-in failed');
    setIsLoading(false);
  },
  flow: 'implicit',
  scope: 'openid profile email',
});


  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strengthLevel = passwordStrength();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['', '#e5534b', '#f97316', '#eab308', '#0d9e80', '#065c4a'];

  /* ── Verification screen ── */
  if (showVerificationMessage) {
    return (
      <div className="moi-verify-wrap">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="moi-verify-card">
          <div className="moi-verify-icon">
            <Mail size={30} strokeWidth={1.5} />
          </div>
          <h2 className="moi-verify-title">Check your inbox</h2>
          <p className="moi-verify-sub">We sent a verification link to</p>
          <div className="moi-verify-email">{registeredEmail}</div>
          <div className="moi-steps">
            {[
              'Open the email we just sent you',
              'Click the verification link inside',
              'Return here and sign in to MoiHub',
            ].map((text, i) => (
              <div className="moi-step" key={i}>
                <div className="moi-step-num">{i + 1}</div>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <button className="moi-btn-primary" onClick={() => navigate('/login')}>
            Go to Sign in <ArrowRight size={15} />
          </button>
          <p className="moi-verify-help">
            Didn't receive it? Check your spam folder, confirm the email address is correct, or wait a few minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="moi-root">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* ── Left panel ── */}
      <div className="moi-left">
        <div className="moi-left-body">
          <div className="moi-tagchip">
            <span className="moi-tagchip-dot" />
            Moi University · Student Platform
          </div>

          <h1 className="moi-headline">
            The campus<br />
            <em>ecosystem</em> you<br />
            deserve.
          </h1>

          <p className="moi-sub">
            Housing, roommates, food, shopping and more — built by students, for students at Moi University.
          </p>

          <div className="moi-features">
            {[
              { icon: '🏠', label: 'Find verified housing fast' },
              { icon: '🤝', label: 'Smart roommate matching' },
              { icon: '🛒', label: 'Second-hand marketplace' },
              { icon: '🍱', label: 'Order food on campus' },
              { icon: '💊', label: 'Online campus pharmacy' },
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
            <div className="moi-card-eyebrow">Get started free</div>
            <h2>Join MoiHub</h2>
            <p>Already have an account? <Link to="/login" className="moi-link">Sign in</Link></p>
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

          <div className="moi-divider"><span>or register with email</span></div>

          <form onSubmit={handleSubmit} className="moi-form" noValidate>
            <div className={`moi-field${focused === 'username' ? ' is-focused' : ''}`}>
              <label htmlFor="username">Username</label>
              <input
                id="username" name="username" type="text"
                placeholder="e.g. johndoe"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused('')}
                required autoComplete="username"
              />
            </div>

            <div className={`moi-field${focused === 'email' ? ' is-focused' : ''}`}>
              <label htmlFor="email">Email address</label>
              <input
                id="email" name="email" type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                required autoComplete="email"
              />
            </div>

            <div className={`moi-field${focused === 'password' ? ' is-focused' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="moi-input-row">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  required autoComplete="new-password"
                />
                <button type="button" className="moi-eye" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.password && (
                <div className="moi-strength">
                  <div className="moi-strength-bars">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className="moi-strength-bar"
                        style={{ background: i <= strengthLevel ? strengthColors[strengthLevel] : '#dde9e6' }}
                      />
                    ))}
                  </div>
                  <span className="moi-strength-label" style={{ color: strengthColors[strengthLevel] }}>
                    {strengthLabels[strengthLevel]}
                  </span>
                </div>
              )}
            </div>

            <div className={`moi-field${focused === 'confirmPassword' ? ' is-focused' : ''}`}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="moi-input-row">
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused('confirmPassword')}
                  onBlur={() => setFocused('')}
                  required autoComplete="new-password"
                />
                <button type="button" className="moi-eye" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password && (
                <div
                  className="moi-match"
                  style={{ color: formData.password === formData.confirmPassword ? '#0d9e80' : '#e5534b' }}
                >
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </div>

            <button type="submit" className="moi-btn-primary" disabled={isLoading}>
              {isLoading
                ? <><span className="moi-spinner" /> Creating account…</>
                : <>Create account <ArrowRight size={15} /></>
              }
            </button>
          </form>

          <p className="moi-terms">
            By joining you agree to our{' '}
            <a href="#" className="moi-link">Terms of Service</a> and{' '}
            <a href="#" className="moi-link">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
