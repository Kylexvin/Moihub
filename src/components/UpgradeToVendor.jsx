import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { UserPlus, Phone, MapPin } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './Register.css'; // Reuse the Register styles

function UpgradeToVendor() {
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'https://moihub.onrender.com/api/food/vendors/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || 'Vendor upgrade successful!');
      setTimeout(() => {
        navigate('/vendor-dashboard'); // Change this to your vendor dashboard route
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upgrade failed.';
      toast.error(msg);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <UserPlus size={40} className="auth-icon" />
          <h2>Become a Food Vendor</h2>
          <p>Upgrade your account to start selling on the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="input-wrapper">
             
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <div className="input-wrapper">
              
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter your location"
                value={formData.location}
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
            {isLoading ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpgradeToVendor;
