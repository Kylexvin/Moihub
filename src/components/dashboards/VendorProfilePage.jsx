import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AlertCircle, CheckCircle, XCircle, Phone, MapPin, User, Mail, ShieldCheck, Power, Store } from 'lucide-react';
import { AlignLeft, Image } from 'lucide-react';

const VendorProfilePage = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    description: '',
    location: ''
  });

  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Configure axios with headers
  const api = axios.create({
    baseURL: 'https://moihub.onrender.com/api/food/vendors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  // Fetch vendor profile
  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile');
      setVendor(response.data.vendor);
      setFormData({
        phone: response.data.vendor.phone || '',
        location: response.data.vendor.location || ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load vendor profile: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Profile',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Update vendor profile
  const updateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.put('/profile', formData);
      setVendor(response.data.vendor);
      setLoading(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile information has been updated successfully.',
        confirmButtonColor: '#3085d6'
      });
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message,
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Toggle vendor open status
  const toggleOpenStatus = async () => {
    try {
      setLoading(true);
      const response = await api.patch('/availability/toggle', { 
        isOpen: !vendor.isOpen 
      });
      setVendor(response.data.vendor);
      setLoading(false);
      
      Swal.fire({
        icon: 'success',
        title: vendor.isOpen ? 'Store Closed' : 'Store Opened',
        text: vendor.isOpen ? 'Your store is now closed for orders.' : 'Your store is now open and ready to receive orders!',
        confirmButtonColor: '#3085d6'
      });
    } catch (err) {
      setError('Failed to toggle availability: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Action Failed',
        text: 'Failed to update store availability. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  // Delete vendor account
  const deleteAccount = async () => {
    Swal.fire({
      title: 'Delete Your Account?',
      text: "This action cannot be undone! All your vendor data will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      input: 'text',
      inputLabel: 'Type DELETE to confirm',
      inputPlaceholder: 'DELETE',
      inputValidator: (value) => {
        if (value !== 'DELETE') {
          return 'You need to type DELETE to proceed';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          await api.delete('/profile');
          localStorage.removeItem('token'); // Clear auth token
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Your account has been deleted successfully.',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            navigate('/'); // Redirect to home page
          });
        } catch (err) {
          setLoading(false);
          
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: err.response?.data?.message || err.message,
            confirmButtonColor: '#3085d6'
          });
        }
      }
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchVendorProfile();
  }, []);

  // Loading state
  if (loading && !vendor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state with no vendor
  if (error && !vendor) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500 p-4">
        <AlertCircle size={48} />
        <h2 className="text-xl font-bold mt-4">Something went wrong</h2>
        <p className="mt-2">{error}</p>
        <button 
          onClick={() => fetchVendorProfile()}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Overview Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-600 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="mr-2" size={20} />
                Profile Overview
              </h2>
            </div>
            {vendor && (
              <div className="p-6 space-y-4">
                <div className="flex items-center">
                  <Mail className="text-gray-400 mr-3" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium truncate max-w-[200px]">{vendor.user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="text-gray-400 mr-3" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{vendor.user.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ShieldCheck className="text-gray-400 mr-3" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Approval Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${vendor.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {vendor.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Power className="text-gray-400 mr-3" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {vendor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                {vendor.subscriptionEndDate && (
                  <div className="flex items-center">
                    <AlertCircle className="text-gray-400 mr-3" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Subscription Ends</p>
                      <p className="font-medium">{new Date(vendor.subscriptionEndDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Store Status Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-indigo-600 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Store className="mr-2" size={20} />
                Store Status
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center p-4 mb-4 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center mb-2">
                  {vendor?.isOpen ? (
                    <CheckCircle className="text-green-500 mr-2" size={28} />
                  ) : (
                    <XCircle className="text-red-500 mr-2" size={28} />
                  )}
                </div>
                <p className="text-center font-bold text-xl mb-2">
                  {vendor?.isOpen ? 'OPEN FOR ORDERS' : 'CLOSED'}
                </p>
                <p className="text-gray-600 text-center text-sm">
                  {vendor?.isOpen 
                    ? 'Your store is currently accepting orders' 
                    : 'Your store is not accepting orders at this time'}
                </p>
              </div>
              
              {/* Only show the toggle if account is active and approved */}
              {vendor?.isActive && vendor?.isApproved && (
                <button
                  onClick={toggleOpenStatus}
                  className={`w-full ${vendor?.isOpen 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring transition-colors`}
                  disabled={loading}
                >
                  {vendor?.isOpen ? 'Close Store' : 'Open Store'}
                </button>
              )}
              
              {(!vendor?.isActive || !vendor?.isApproved) && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                  <p className="text-yellow-700">
                    {!vendor?.isApproved ? 'Your account is pending approval. Once approved, you can manage your store status.' : 
                     !vendor?.isActive ? 'Your account is currently inactive. Please contact support to reactivate.' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
          
{/* Edit Profile Card */}
<div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="bg-green-600 p-4">
    <h2 className="text-xl font-semibold text-white flex items-center">
      <User className="mr-2" size={20} />
      Edit Profile
    </h2>
  </div>
  <div className="p-6">
    <form onSubmit={updateProfile}>
      {/* Phone Number */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
          <div className="flex items-center">
            <Phone size={16} className="mr-2" />
            Phone Number
          </div>
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="location">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            Location
          </div>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter your store location"
        />
      </div>

      {/* Shop Description */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
          <div className="flex items-center">
            <AlignLeft size={16} className="mr-2" />
            Shop Description
          </div>
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className="shadow-sm border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write something about your shop"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring transition-colors"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  </div>
</div>

          
          {/* Danger Zone Card */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-red-600 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <AlertCircle className="mr-2" size={20} />
                Danger Zone
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Deleting your vendor account will permanently remove all your vendor data, including orders, menu items, and profile information. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={deleteAccount}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring transition-colors"
              >
                Delete Vendor Account
              </button>
            </div>
          </div>
        </div>
        

      </div>
    </div>
  );
};

export default VendorProfilePage;