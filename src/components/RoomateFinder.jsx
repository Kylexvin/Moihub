import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../services/authService'; // Fixed import path
import './RoommateFinder.css';

const API_URL = 'https://moihub.onrender.com/api';

const RoommateFinder = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterGender, setFilterGender] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: 'has_room',
    name: '',
    gender: 'male',
    preferredGender: 'any',
    budget: '',
    location: '',
    description: '',
    whatsappNumber: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  // Get authentication state
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchRoommates();
    }
  }, [activeTab, filterGender, filterType]);

  const fetchRoommates = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterGender) params.gender = filterGender;
      if (filterType) params.type = filterType;

      const response = await axios.get(`${API_URL}/roommates`, { params });
      setRoommates(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching roommates:', error);
      alert('Failed to load roommate listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRoommates();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/roommates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRoommates();
      alert('Listing deleted successfully');
    } catch (error) {
      alert('Failed to delete listing');
    } finally {
      setShowDeleteConfirm(false);
      setListingToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setListingToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleCall = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\s+/g, '');
    window.open(`tel:${cleanNumber}`);
  };

  const handleWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\s+/g, '').replace('+', '');
    const message = 'Hi! I found you on the MoiHub roommate finder and would like to discuss room sharing.';
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const isOwnerOfListing = (listing) => {
    if (!currentUser || !isAuthenticated) return false;

    const currentUserId = currentUser.userId || currentUser.id;
    const listingUserId = listing.userId || listing.user_id || listing.user;

    return String(currentUserId) === String(listingUserId);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (!formData.budget.trim() || isNaN(formData.budget) || parseInt(formData.budget) <= 0) {
      errors.push('Please enter a valid budget amount');
    }

    if (!formData.location.trim()) {
      errors.push('Location is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (!formData.whatsappNumber.trim()) {
      errors.push('WhatsApp number is required');
    } else if (!/^\+254\d{9}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      errors.push('Please enter a valid Kenyan phone number (e.g., +254712345678)');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please log in to create a listing');
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const submitData = {
        ...formData,
        budget: parseInt(formData.budget),
        whatsappNumber: formData.whatsappNumber.replace(/\s/g, ''),
      };

      await axios.post(`${API_URL}/roommates`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Your roommate listing has been created successfully!');
      setFormData({
        type: 'has_room',
        name: '',
        gender: 'male',
        preferredGender: 'any',
        budget: '',
        location: '',
        description: '',
        whatsappNumber: '',
      });
      setActiveTab('browse');
      fetchRoommates();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert(error.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const FilterButton = ({ title, value, currentFilter, onPress }) => (
    <button
      className={`moihub-roommate-filter-btn ${currentFilter === value ? 'moihub-roommate-filter-active' : ''}`}
      onClick={() => onPress(currentFilter === value ? '' : value)}
    >
      {title}
    </button>
  );

  const SelectButton = ({ title, value, currentValue, onPress }) => (
    <button
      className={`moihub-roommate-select-btn ${currentValue === value ? 'moihub-roommate-select-active' : ''}`}
      onClick={() => onPress(value)}
    >
      {title}
    </button>
  );

  const renderRoommateCard = (item) => {
    const isOwner = isOwnerOfListing(item);
    
    return (
      <div key={item._id} className="moihub-roommate-card">
        <div className="moihub-roommate-card-header">
          <h3 className="moihub-roommate-name">{item.name}</h3>
          <div className="moihub-roommate-badges">
            <span className={`moihub-roommate-badge moihub-roommate-type-${item.type}`}>
              {item.type === 'has_room' ? 'Has Room' : 'Needs Room'}
            </span>
            <span className="moihub-roommate-badge moihub-roommate-gender">
              {item.gender}
            </span>
            {isOwner && (
              <span className="moihub-roommate-badge moihub-roommate-owner">
                Your Listing
              </span>
            )}
          </div>
        </div>

        <div className="moihub-roommate-card-content">
          <p className="moihub-roommate-location">📍 {item.location}</p>
          <p className="moihub-roommate-budget">💰 KSh {item.budget.toLocaleString()}/month</p>
          <p className="moihub-roommate-preference">👥 Prefers: {item.preferredGender}</p>
          <p className="moihub-roommate-description">{item.description}</p>
        </div>

        <div className="moihub-roommate-card-actions">
          {isOwner ? (
            <div className="moihub-roommate-owner-actions">
              <button 
                className="moihub-roommate-action-btn moihub-roommate-delete-btn"
                onClick={() => confirmDelete(item._id)}
              >
                🗑️ Delete
              </button>
            </div>
          ) : (
            <div className="moihub-roommate-contact-btns">
              <button 
                className="moihub-roommate-action-btn moihub-roommate-call-btn"
                onClick={() => handleCall(item.whatsappNumber)}
              >
                📞 Call
              </button>
              <button 
                className="moihub-roommate-action-btn moihub-roommate-whatsapp-btn"
                onClick={() => handleWhatsApp(item.whatsappNumber)}
              >
                💬 WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBrowseTab = () => {
    if (loading) {
      return (
        <div className="moihub-roommate-loading">
          <div className="moihub-roommate-spinner"></div>
          <p>Loading roommate listings...</p>
        </div>
      );
    }

    return (
      <div className="moihub-roommate-browse">
        {/* Filters */}
        <div className="moihub-roommate-filters">
          <h3 className="moihub-roommate-filters-title">Filters:</h3>
          <div className="moihub-roommate-filters-row">
            <FilterButton
              title="Male"
              value="male"
              currentFilter={filterGender}
              onPress={setFilterGender}
            />
            <FilterButton
              title="Female"
              value="female"
              currentFilter={filterGender}
              onPress={setFilterGender}
            />
            <FilterButton
              title="Has Room"
              value="has_room"
              currentFilter={filterType}
              onPress={setFilterType}
            />
            <FilterButton
              title="Needs Room"
              value="looking_for_room"
              currentFilter={filterType}
              onPress={setFilterType}
            />
          </div>
        </div>

        {/* Roommate List */}
        <div className="moihub-roommate-list">
          {roommates.length > 0 ? (
            roommates.map(renderRoommateCard)
          ) : (
            <div className="moihub-roommate-empty">
              <p className="moihub-roommate-empty-text">No roommate listings found</p>
              <p className="moihub-roommate-empty-subtext">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCreateTab = () => (
    <div className="moihub-roommate-create">
      <div className="moihub-roommate-form">
        {/* Type Selection */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">I am looking for roommate:</label>
          <div className="moihub-roommate-btn-row">
            <SelectButton
              title="With a room"
              value="has_room"
              currentValue={formData.type}
              onPress={(value) => handleInputChange('type', value)}
            />
            <SelectButton
              title="Without a room"
              value="looking_for_room"
              currentValue={formData.type}
              onPress={(value) => handleInputChange('type', value)}
            />
          </div>
        </div>

        {/* Name Input */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Your Name *</label>
          <input
            type="text"
            className="moihub-roommate-input"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        {/* Gender Selection */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Your Gender *</label>
          <div className="moihub-roommate-btn-row">
            <SelectButton
              title="Male"
              value="male"
              currentValue={formData.gender}
              onPress={(value) => handleInputChange('gender', value)}
            />
            <SelectButton
              title="Female"
              value="female"
              currentValue={formData.gender}
              onPress={(value) => handleInputChange('gender', value)}
            />
          </div>
        </div>

        {/* Preferred Gender */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Preferred Roommate Gender</label>
          <div className="moihub-roommate-btn-row">
            <SelectButton
              title="Any"
              value="any"
              currentValue={formData.preferredGender}
              onPress={(value) => handleInputChange('preferredGender', value)}
            />
            <SelectButton
              title="Male"
              value="male"
              currentValue={formData.preferredGender}
              onPress={(value) => handleInputChange('preferredGender', value)}
            />
            <SelectButton
              title="Female"
              value="female"
              currentValue={formData.preferredGender}
              onPress={(value) => handleInputChange('preferredGender', value)}
            />
          </div>
        </div>

        {/* Budget Input */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Monthly Rent (KSh) *</label>
          <input
            type="number"
            className="moihub-roommate-input"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="e.g., 6000"
          />
        </div>

        {/* Location Input */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Location *</label>
          <input
            type="text"
            className="moihub-roommate-input"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Rebo, Stage"
          />
        </div>

        {/* WhatsApp Number */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">WhatsApp Number *</label>
          <input
            type="tel"
            className="moihub-roommate-input"
            value={formData.whatsappNumber}
            onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
            placeholder="+254712345678"
          />
          <p className="moihub-roommate-helper-text">
            Please include country code (e.g., +254 for Kenya)
          </p>
        </div>

        {/* Description */}
        <div className="moihub-roommate-form-section">
          <label className="moihub-roommate-form-label">Description *</label>
          <textarea
            className="moihub-roommate-textarea"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Tell us about yourself, your preferences, lifestyle, etc."
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          className={`moihub-roommate-submit-btn ${formLoading ? 'moihub-roommate-submit-loading' : ''}`}
          onClick={handleSubmit}
          disabled={formLoading}
        >
          {formLoading ? (
            <div className="moihub-roommate-btn-spinner"></div>
          ) : (
            'Create Listing'
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="moihub-roommate-finder">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="moihub-roommate-modal-overlay">
          <div className="moihub-roommate-modal">
            <h3>Delete Listing</h3>
            <p>Are you sure you want to delete this listing?</p>
            <div className="moihub-roommate-modal-actions">
              <button 
                className="moihub-roommate-modal-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="moihub-roommate-modal-confirm"
                onClick={() => handleDelete(listingToDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="moihub-roommate-header">
        <h1 className="moihub-roommate-title">Roommate Finder</h1>
        <p className="moihub-roommate-subtitle">Find your perfect roommate at Moi University</p>
      </div>

      {/* Tabs */}
      <div className="moihub-roommate-tabs">
        <button
          className={`moihub-roommate-tab ${activeTab === 'browse' ? 'moihub-roommate-tab-active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          Browse Listings
        </button>
        <button
          className={`moihub-roommate-tab ${activeTab === 'create' ? 'moihub-roommate-tab-active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Listing
        </button>
      </div>

      {/* Content */}
      <div className="moihub-roommate-content">
        {activeTab === 'browse' ? renderBrowseTab() : renderCreateTab()}
      </div>
    </div>
  );
};

export default RoommateFinder;