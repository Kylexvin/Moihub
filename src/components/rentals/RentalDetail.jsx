import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RentalDetail.css';

const API_URL = 'https://moihub.onrender.com/api';

const RentalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    userName: '',
    userWhatsApp: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    fetchRentalDetail();
  }, [id]);

  const fetchRentalDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/rentals/${id}`);
      if (response.data.success) {
        setRental(response.data.data);
        setImageLoading(true);
        setImageError(false);
      }
    } catch (error) {
      console.error('Error fetching rental detail:', error);
      alert('Failed to load rental details');
      navigate('/rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async () => {
    if (!inquiryForm.userName.trim() || !inquiryForm.userWhatsApp.trim()) {
      alert('Please fill in your name and WhatsApp number');
      return;
    }

    try {
      setInquiryLoading(true);
      const response = await axios.post(`${API_URL}/rentals/${id}/inquire`, {
        userName: inquiryForm.userName.trim(),
        userWhatsApp: inquiryForm.userWhatsApp.trim(),
        message: inquiryForm.message.trim() || "I'm interested in this rental. Please provide more details."
      });

      if (response.data.success) {
        alert('Your inquiry has been sent successfully. The caretaker will contact you soon.');
        setInquiryModalVisible(false);
        setInquiryForm({ userName: '', userWhatsApp: '', message: '' });
      }
    } catch (error) {
      console.error('Inquiry error:', error);
      alert(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setInquiryLoading(false);
    }
  };

  const openLocation = () => {
    if (rental.locationUrl) {
      window.open(rental.locationUrl, '_blank');
    }
  };

  const callCaretaker = () => {
    if (rental.caretakerNumber) {
      const phoneNumber = rental.caretakerNumber.replace(/\s+/g, '');
      window.open(`tel:${phoneNumber}`);
    }
  };

  const whatsappCaretaker = () => {
    if (rental.caretakerNumber) {
      const phoneNumber = rental.caretakerNumber.replace(/\s+/g, '').replace('+', '');
      const message = `Hi, I'm interested in the ${rental.name} rental in ${rental.location}. Is it still available?`;
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const getVacancyStatusColor = (rental) => {
    if (rental.adminOverride?.isActive) {
      return rental.hasVacant ? '#059669' : '#DC2626';
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      if (vacantRatio > 0.6) return '#059669';
      if (vacantRatio < 0.4) return '#DC2626';
      return '#D97706';
    }
    
    return '#6B7280';
  };

  const getVacancyStatusText = (rental) => {
    if (rental.adminOverride?.isActive) {
      return rental.hasVacant ? 'Available ✓' : 'Occupied ✓';
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      if (vacantRatio > 0.6) return 'Likely Available';
      if (vacantRatio < 0.4) return 'Likely Occupied';
      return 'Status Disputed';
    }
    
    return 'Unverified';
  };

  const getStatusIcon = (rental) => {
    if (rental.adminOverride?.isActive) {
      return rental.hasVacant ? '✓' : '✗';
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      if (vacantRatio > 0.6) return '✓';
      if (vacantRatio < 0.4) return '✗';
      return '?';
    }
    
    return '?';
  };

  const renderImage = () => {
    if (!rental.imageUrl) {
      return (
        <div className="moihub-detail-image-container">
          <div className="moihub-detail-placeholder">
            <div className="moihub-detail-placeholder-icon">🏠</div>
            <div className="moihub-detail-placeholder-text">No Image Available</div>
          </div>
        </div>
      );
    }

    return (
      <div className="moihub-detail-image-container">
        {imageLoading && (
          <div className="moihub-detail-image-loading">
            <div className="moihub-detail-loading-spinner"></div>
          </div>
        )}
        <img
          src={rental.imageUrl}
          className={`moihub-detail-image ${imageLoading ? 'moihub-detail-image-hidden' : ''}`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          alt={rental.name}
        />
        {imageError && (
          <div className="moihub-detail-image-error">
            <div className="moihub-detail-error-icon">📷</div>
            <div className="moihub-detail-error-text">Failed to load image</div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="moihub-detail-loading-container">
        <div className="moihub-detail-loading-spinner large"></div>
        <div className="moihub-detail-loading-text">Loading rental details...</div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="moihub-detail-error-container">
        <div className="moihub-detail-error-icon">❌</div>
        <div className="moihub-detail-error-message">Rental not found</div>
        <button className="moihub-detail-back-btn" onClick={() => navigate('/rentals')}>
          Back to Rentals
        </button>
      </div>
    );
  }

  return (
    <div className="moihub-rental-detail">
      {/* Header */}
      <div className="moihub-detail-header">
        {/* <button className="moihub-detail-back-btn" onClick={() => navigate('/rentals')}>
          ← Back
        </button> */}
        <div className="moihub-detail-title-section">
          <h1 className="moihub-detail-title">{rental.name}</h1>
          <div 
            className="moihub-detail-status-badge"
            style={{ backgroundColor: getVacancyStatusColor(rental) }}
          >
            <span className="moihub-detail-status-icon">{getStatusIcon(rental)}</span>
            <span className="moihub-detail-status-text">{getVacancyStatusText(rental)}</span>
          </div>
        </div>
      </div>

      {/* Image */}
      {renderImage()}

      {/* Info Section */}
      <div className="moihub-detail-info-section">
        <div className="moihub-detail-info-row">
          <span className="moihub-detail-info-icon">📍</span>
          <div className="moihub-detail-info-content">
            <div className="moihub-detail-info-label">Location</div>
            <div className="moihub-detail-info-value">{rental.location}</div>
          </div>
          {rental.locationUrl && (
            <button className="moihub-detail-action-btn" onClick={openLocation} title="Open location">
              🗺️
            </button>
          )}
        </div>

        <div className="moihub-detail-info-row">
          <span className="moihub-detail-info-icon">🏠</span>
          <div className="moihub-detail-info-content">
            <div className="moihub-detail-info-label">Type</div>
            <div className="moihub-detail-info-value">{rental.type}</div>
          </div>
        </div>

        <div className="moihub-detail-info-row">
          <span className="moihub-detail-info-icon">💰</span>
          <div className="moihub-detail-info-content">
            <div className="moihub-detail-info-label">Monthly Rent</div>
            <div className="moihub-detail-price">KSh {rental.amount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Votes Section */}
      {rental.voteStats && rental.voteStats.totalVotes > 0 && (
        <div className="moihub-detail-votes-section">
          <h3 className="moihub-detail-votes-title">Community Votes</h3>
          <div className="moihub-detail-votes-grid">
            <div className="moihub-detail-vote-item">
              <div className="moihub-detail-vote-count">{rental.voteStats.vacantVotes}</div>
              <div className="moihub-detail-vote-label">Available</div>
            </div>
            <div className="moihub-detail-vote-item">
              <div className="moihub-detail-vote-count">{rental.voteStats.occupiedVotes}</div>
              <div className="moihub-detail-vote-label">Occupied</div>
            </div>
            <div className="moihub-detail-vote-item">
              <div className="moihub-detail-vote-count">{rental.voteStats.totalVotes}</div>
              <div className="moihub-detail-vote-label">Total</div>
            </div>
          </div>
          <div className="moihub-detail-vote-note">
            <span className="moihub-detail-note-icon">📱</span>
            Vote on availability in the MoiHub mobile app
          </div>
        </div>
      )}

      {/* Admin Override Info */}
      {rental.adminOverride?.isActive && (
        <div className="moihub-detail-admin-section">
          <div className="moihub-detail-admin-header">
            <span className="moihub-detail-admin-icon">🛡️</span>
            Admin Verified
          </div>
          <div className="moihub-detail-admin-info">
            <p>Status confirmed by MoiHub administration</p>
            {rental.adminOverride.reason && (
              <p className="moihub-detail-admin-reason">Note: {rental.adminOverride.reason}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="moihub-detail-actions">
        <button 
          className="moihub-detail-inquiry-btn primary"
          onClick={() => setInquiryModalVisible(true)}
        >
          <span className="moihub-detail-btn-icon">✉️</span>
          Send Inquiry
        </button>
        
        
      </div>

      {/* Inquiry Modal */}
      {inquiryModalVisible && (
        <div className="moihub-detail-modal-overlay active">
          <div className="moihub-detail-modal-content">
            <div className="moihub-detail-modal-header">
              <h2 className="moihub-detail-modal-title">Send Inquiry</h2>
              <button 
                className="moihub-detail-modal-close"
                onClick={() => setInquiryModalVisible(false)}
              >
                ×
              </button>
            </div>
            
            <div className="moihub-detail-modal-body">
              <div className="moihub-detail-form-group">
                <label className="moihub-detail-form-label">Your Name *</label>
                <input
                  type="text"
                  value={inquiryForm.userName}
                  onChange={(e) => setInquiryForm({...inquiryForm, userName: e.target.value})}
                  placeholder="Enter your full name"
                  className="moihub-detail-form-input"
                />
              </div>
              
              <div className="moihub-detail-form-group">
                <label className="moihub-detail-form-label">WhatsApp Number *</label>
                <input
                  type="tel"
                  value={inquiryForm.userWhatsApp}
                  onChange={(e) => setInquiryForm({...inquiryForm, userWhatsApp: e.target.value})}
                  placeholder="+254712345678"
                  className="moihub-detail-form-input"
                />
              </div>
              
              <div className="moihub-detail-form-group">
                <label className="moihub-detail-form-label">Message (Optional)</label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  placeholder="I'm interested in this rental. Please provide more details."
                  className="moihub-detail-form-textarea"
                  rows="4"
                />
              </div>
            </div>
            
            <div className="moihub-detail-modal-footer">
              <button 
                className="moihub-detail-submit-btn"
                onClick={handleInquiry}
                disabled={inquiryLoading}
              >
                {inquiryLoading ? (
                  <div className="moihub-detail-btn-spinner"></div>
                ) : (
                  'Send Inquiry'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalDetail;