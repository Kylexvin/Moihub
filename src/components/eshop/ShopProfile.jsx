import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Phone, Tag, CheckCircle, XCircle } from 'lucide-react';

const ShopProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    description: '',
    address: '',
    phoneNumber: ''
  });
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchShopProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://moihub.onrender.com/api/eshop/vendor/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        // Using the same API endpoint as the dashboard, but just focusing on the shop data
        setProfile(res.data.data.shop);
        setFormData({
          shopName: res.data.data.shop.shopName,
          description: res.data.data.shop.description,
          address: res.data.data.shop.address,
          phoneNumber: res.data.data.shop.phoneNumber
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch shop profile:', err);
        setError('Failed to load shop profile. Please try again.');
        setLoading(false);
      }
    };

    fetchShopProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    
    try {
      // Log the data being sent for debugging
      console.log('Sending data:', formData);
      
      const res = await axios.put(
        'https://moihub.onrender.com/api/eshop/vendor/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('Response:', res.data);
      
      if (res.data.success) {
        setSuccessMessage('Profile updated successfully!');
        setProfile({
          ...profile,
          ...formData
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      
      // Show more detailed error message
      if (err.response) {
        console.log('Error response:', err.response);
        setFormError(err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`);
      } else if (err.request) {
        setFormError('No response from server. Please check your connection.');
      } else {
        setFormError(`Request failed: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return <p>No profile data available.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Shop Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{profile.shopName}</h2>
            <p className="text-blue-100 mt-1">{profile.description}</p>
          </div>
          
        </div>
      </div>

      {/* Shop Logo */}
      <div className="flex justify-center -mt-12 px-6">
        <div className="h-24 w-24 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-white">
          {profile.logo === 'images/eshop.png' ? (
            <div className="h-full w-full bg-blue-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {profile.shopName.charAt(0)}
              </span>
            </div>
          ) : (
            <img 
              src={`../../images/eshop.png`} 
              alt="Shop Logo" 
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Success or Error Messages */}
      {successMessage && (
        <div className="mx-6 mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>{successMessage}</p>
        </div>
      )}
      
      {formError && (
        <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{formError}</p>
        </div>
      )}

      {/* Edit Form or Shop Details */}
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Shop Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form data to current profile
                  setFormData({
                    shopName: profile.shopName,
                    description: profile.description,
                    address: profile.address,
                    phoneNumber: profile.phoneNumber
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{profile.category.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact Number</p>
                    <p className="font-medium">{profile.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Created On</p>
                    <p className="font-medium">{formatDate(profile.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  {profile.isApproved ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Approval Status</p>
                    <p className={`font-medium ${
                      profile.isApproved ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profile.isApproved ? 'Approved' : 'Pending Approval'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {profile.isActive ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mr-3" />
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Shop Status</p>
                    <p className={`font-medium ${
                      profile.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Subscription End Date</p>
                    <p className="font-medium">{formatDate(profile.subscriptionEndDate)}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-gray-700">
                    Last Updated: <span className="font-medium">{formatDate(profile.updatedAt)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Shop Management Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Edit Shop Profile
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;