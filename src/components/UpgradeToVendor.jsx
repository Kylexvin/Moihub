import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MapPin, Phone, Store } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './UpgradeVendor.css';

function UpgradeToVendor() {
  const [formData, setFormData] = useState({
    shopName: '',
    phone: '',
    location: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(null);
  const navigate = useNavigate();
  
  // Check if user is already a vendor
  useEffect(() => {
    const checkVendorStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to access this feature',
            confirmButtonColor: '#3085d6'
          });
          navigate('/login');
          return;
        }
        
        const res = await axios.get('https://moihub.onrender.com/api/food/vendors/check-status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (res.data.isVendor) {
          setIsVendor(true);
          setVendorStatus(res.data);
          
          if (res.data.isApproved) {
            Swal.fire({
              icon: 'success',
              title: 'Already Approved',
              text: 'Your vendor account is already approved. Redirecting to dashboard.',
              confirmButtonColor: '#3085d6'
            });
            setTimeout(() => navigate('/vendor-dashboard'), 2000);
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Pending Approval',
              text: 'Your vendor application is pending approval. Please wait for admin confirmation.',
              confirmButtonColor: '#3085d6'
            });
          }
        }
      } catch (err) {
        console.error('Error checking vendor status:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to check vendor status. Please try again later.',
          confirmButtonColor: '#3085d6'
        });
      }
    };
    
    checkVendorStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.shopName.trim() || !formData.phone.trim() || !formData.location.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'All fields are required',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    // Phone number validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid phone number',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Error',
          text: 'Please log in to continue',
          confirmButtonColor: '#3085d6'
        });
        navigate('/login');
        return;
      }
      
      // Fixed typo in URL (was 'locallhost')
      const res = await axios.post(
        'https://moihub.onrender.com/api/food/vendors/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Success message with SweetAlert2
      Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <p>Your vendor application has been submitted successfully!</p>
          <p class="mt-2">An admin will review your application within 24-48 hours.</p>
          <p class="mt-2">You'll receive an email notification once your application is approved.</p>
        `,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Great!',
      }).then((result) => {
        if (result.isConfirmed) {
          // Refresh vendor status after successful submission
          setIsVendor(true);
          navigate('/');
        }
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit vendor application. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: errorMessage,
        confirmButtonColor: '#3085d6'
      });
      console.error('Vendor registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isVendor) {
    return (
      <div className="vendor-status-container">
        <div className="status-card">
          <UserPlus size={48} className="status-icon" />
          <h2>Vendor Application Status</h2>
          <p>Your application for <strong>{vendorStatus?.shopName || 'your shop'}</strong> is currently under review.</p>
          <p>Status: <span className="status-badge">{vendorStatus?.isApproved ? 'Approved' : 'Pending'}</span></p>
          <p>You will be notified once an admin approves your request.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/profile')}
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-upgrade-container">
      <div className="upgrade-form-wrapper">
        <div className="upgrade-header">
          <Store size={48} className="upgrade-icon" />
          <h2>Become a Food Vendor</h2>
          <p>Upgrade your account to start selling on the platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="upgrade-form">
          <div className="form-group">
            <label htmlFor="shopName">Shop Name</label>
            <div className="input-wrapper">
              
              <input
                type="text"
                id="shopName"
                name="shopName"
                placeholder="Enter your shop name"
                value={formData.shopName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
              
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter your business phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Business Location</label>
            <div className="input-wrapper">
              
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter your business location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>
          
          <div className="notice-box">
            <p><strong>Note:</strong> Your application will be reviewed by an administrator.</p>
            <p>This process typically takes 24-48 hours. You'll receive an email notification once approved.</p>
          </div>
          
          <button
            type="submit"
            className="upgrade-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpgradeToVendor;