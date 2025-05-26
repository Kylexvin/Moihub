// EmailVerification.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // THIS calls your backend API
        const response = await fetch(`https://moihub.onrender.com/api/auth/verify-email/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    if (token) verifyEmail();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      {status === 'verifying' && (
        <div>
          <h2>Verifying your email...</h2>
          <p>Please wait while we verify your account.</p>
        </div>
      )}
      {status === 'success' && (
        <div>
          <h2>✅ Email Verified Successfully!</h2>
          <p>Your account has been verified. Redirecting to login...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>❌ Verification Failed</h2>
          <p>Invalid or expired verification link.</p>
          <button onClick={() => navigate('/register')}>Register Again</button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;