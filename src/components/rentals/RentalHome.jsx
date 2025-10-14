import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RentalHome.css';

const API_URL = 'https://moihub.onrender.com/api';

const RentalHome = () => {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    vacancyStatus: '',
  });
  
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  // Rental types and locations for filter dropdown
  const rentalTypes = ['bedsitter', 'one-bedroom', 'two-bedroom'];
  const vacancyStatuses = [
    { label: 'All', value: '' },
    { label: 'Vacant (Voted)', value: 'vacant' },
    { label: 'Occupied (Voted)', value: 'occupied' },
    { label: 'Vacant (Admin)', value: 'admin_vacant' },
    { label: 'Occupied (Admin)', value: 'admin_occupied' },
    { label: 'Unverified', value: 'unverified' }
  ];

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/rentals?page=${page}&limit=10`);
      if (response.data.success) {
        setRentals(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      alert('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const normalizeFilter = (key, value) => {
    if (typeof value !== 'string') return value;

    switch (key) {
      case 'type':
        return value.toLowerCase();
      case 'vacancyStatus':
        switch (value.toLowerCase()) {
          case 'vacant': return 'verified_vacant';
          case 'occupied': return 'verified_occupied';
          case 'admin_vacant': return 'admin_verified_vacant';
          case 'admin_occupied': return 'admin_verified_occupied';
          case 'unverified': return 'unverified';
          default: return value;
        }
      default:
        return value.trim();
    }
  };

  const searchRentals = async (query = '', appliedFilters = {}, page = 1) => {
    if (!query.trim() && Object.keys(appliedFilters).length === 0) {
      fetchRentals(page);
      return;
    }

    try {
      setIsSearching(true);

      const params = {
        page,
        limit: 10,
      };

      if (query && query.trim()) {
        params.q = query.trim();
      }

      Object.keys(appliedFilters).forEach(key => {
        const raw = appliedFilters[key];
        if (raw !== undefined && raw.toString().trim() !== '') {
          params[key] = normalizeFilter(key, raw);
        }
      });

      const response = await axios.get(`${API_URL}/rentals/search`, { params });

      if (response.data.success) {
        setRentals(response.data.data);
        setPagination(response.data.pagination);
      }

    } catch (error) {
      console.error('Search error:', error);
      alert(error.response?.data?.message || 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    
    const activeFilters = getActiveFilters();
    const hasSearchOrFilters = searchQuery.trim() || Object.keys(activeFilters).length > 0;
    
    if (hasSearchOrFilters) {
      searchRentals(searchQuery, activeFilters, newPage);
    } else {
      await fetchRentals(newPage);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const activeFilters = getActiveFilters();
    
    if (text.length > 0 || Object.keys(activeFilters).length > 0) {
      searchRentals(text, activeFilters);
    } else {
      fetchRentals();
    }
  };

  const getActiveFilters = () => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] && filters[key].toString().trim() !== '') {
        activeFilters[key] = filters[key];
      }
    });
    return activeFilters;
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    const activeFilters = getActiveFilters();
    searchRentals(searchQuery, activeFilters);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      vacancyStatus: '',
    });
    setSearchQuery('');
    setShowFilterModal(false);
    fetchRentals();
  };

  const clearSearch = () => {
    setSearchQuery('');
    const activeFilters = getActiveFilters();
    if (Object.keys(activeFilters).length > 0) {
      searchRentals('', activeFilters);
    } else {
      fetchRentals();
    }
  };

  const clearAllSearchAndFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      vacancyStatus: '',
    });
    fetchRentals();
  };

  const getVacancyStatusColor = (rental) => {
    if (rental.adminOverride?.isActive) {
      return rental.hasVacant ? '#4CAF50' : '#F44336';
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      if (vacantRatio > 0.6) return '#8BC34A';
      if (vacantRatio < 0.4) return '#FF7043';
      return '#FF9800';
    }
    
    return '#9E9E9E';
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
      return rental.hasVacant ? 'check-circle' : 'x-circle';
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      if (vacantRatio > 0.6) return 'check-circle';
      if (vacantRatio < 0.4) return 'x-circle';
      return 'help-circle';
    }
    
    return 'help-circle';
  };

  const handleRentalClick = (rentalId) => {
    navigate(`/rentals/${rentalId}`);
  };

  const renderStatusInfo = (rental) => {
    if (rental.adminOverride?.isActive) {
      return (
        <div className="moihub-rental-status-info">
          <div className="moihub-status-header">
            <span className="moihub-status-icon">🛡️</span>
            <span className="moihub-status-info-text">Admin Verified</span>
          </div>
          <div className="moihub-status-info-detail">
            Confirmed: {new Date(rental.adminOverride.timestamp).toLocaleDateString()}
          </div>
          {rental.adminOverride.reason && (
            <div className="moihub-status-info-detail">
              Note: {rental.adminOverride.reason}
            </div>
          )}
        </div>
      );
    }
    
    if (rental.voteStats?.totalVotes > 0) {
      const vacantRatio = rental.voteStats.vacantVotes / rental.voteStats.totalVotes;
      return (
        <div className="moihub-rental-status-info">
          <div className="moihub-status-header">
            <span className="moihub-status-icon">👥</span>
            <span className="moihub-status-info-text">Community Votes</span>
          </div>
          <div className="moihub-status-info-detail">
            {rental.voteStats.vacantVotes} say vacant, {rental.voteStats.occupiedVotes} say occupied
          </div>
          <div className="moihub-status-info-detail">
            Confidence: {Math.round(Math.max(vacantRatio, 1 - vacantRatio) * 100)}%
          </div>
        </div>
      );
    }
    
    return (
      <div className="moihub-rental-status-info">
        <div className="moihub-status-header">
          <span className="moihub-status-icon">❓</span>
          <span className="moihub-status-info-text">Status Unverified</span>
        </div>
        <div className="moihub-status-info-detail">
          Community voting needed
        </div>
      </div>
    );
  };

  const renderRentalItem = (item) => (
    <div
      key={item._id}
      className="moihub-rental-card"
      onClick={() => handleRentalClick(item._id)}
    >
      <div className="moihub-card-header">
        <h3 className="moihub-rental-name">{item.name}</h3>
        <div 
          className="moihub-status-badge"
          style={{ backgroundColor: getVacancyStatusColor(item) }}
        >
          <span className="moihub-badge-icon">
            {getStatusIcon(item) === 'check-circle' ? '✓' : getStatusIcon(item) === 'x-circle' ? '✗' : '?'}
          </span>
          <span className="moihub-badge-text">
            {getVacancyStatusText(item)}
          </span>
        </div>
      </div>

      <div className="moihub-card-content">
        <div className="moihub-info-row">
          <span className="moihub-row-icon">📍</span>
          <span className="moihub-row-text">{item.location}</span>
        </div>

        <div className="moihub-info-row">
          <span className="moihub-row-icon">🏠</span>
          <span className="moihub-row-text">{item.type}</span>
        </div>

        <div className="moihub-info-row">
          <span className="moihub-row-icon">💰</span>
          <span className="moihub-price-text">KSh {item.amount.toLocaleString()}</span>
        </div>

        {renderStatusInfo(item)}
      </div>
    </div>
  );

  const renderPaginationControls = () => {
    if (pagination.total === 0) return null;

    const canGoPrev = pagination.current > 1;
    const canGoNext = pagination.current < pagination.pages;
    const startItem = ((pagination.current - 1) * 10) + 1;
    const endItem = Math.min(pagination.current * 10, pagination.total);

    return (
      <div className="moihub-pagination-container">
        <div className="moihub-pagination-info">
          <div className="moihub-pagination-text">
            Showing {startItem}-{endItem} of {pagination.total} rentals
          </div>
          <div className="moihub-pagination-page-text">
            Page {pagination.current} of {pagination.pages}
          </div>
        </div>
        
        {pagination.pages > 1 && (
          <div className="moihub-pagination-controls">
            <button
              className={`moihub-pagination-btn ${!canGoPrev ? 'moihub-pagination-btn-disabled' : ''}`}
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={!canGoPrev || loading}
            >
              ← Previous
            </button>

            <button
              className={`moihub-pagination-btn ${!canGoNext ? 'moihub-pagination-btn-disabled' : ''}`}
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={!canGoNext || loading}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFilterModal = () => (
    <div 
      className={`moihub-modal-overlay ${showFilterModal ? 'moihub-modal-show' : ''}`}
      onClick={(e) => {
        if (e.target.className.includes('moihub-modal-overlay')) {
          setShowFilterModal(false);
        }
      }}
    >
      <div className="moihub-modal-content">
        <div className="moihub-modal-header">
          <h2 className="moihub-modal-title">Filter Rentals</h2>
          <button 
            className="moihub-modal-close"
            onClick={() => setShowFilterModal(false)}
          >
            ×
          </button>
        </div>

        <div className="moihub-filter-content">
          {/* Location Filter */}
          <div className="moihub-filter-section">
            <label className="moihub-filter-label">Location</label>
            <input
              type="text"
              className="moihub-filter-input"
              placeholder="Enter location (e.g., Stage, Chebarus)"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>

          {/* Type Filter */}
          <div className="moihub-filter-section">
            <label className="moihub-filter-label">Property Type</label>
            <div className="moihub-type-options">
              {rentalTypes.map((type) => (
                <button
                  key={type}
                  className={`moihub-type-option ${filters.type === type ? 'moihub-type-option-selected' : ''}`}
                  onClick={() => setFilters({ ...filters, type: filters.type === type ? '' : type })}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="moihub-filter-section">
            <label className="moihub-filter-label">Price Range (KSh)</label>
            <div className="moihub-price-range">
              <input
                type="number"
                className="moihub-price-input"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <span className="moihub-price-separator">-</span>
              <input
                type="number"
                className="moihub-price-input"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Vacancy Status Filter */}
          <div className="moihub-filter-section">
            <label className="moihub-filter-label">Vacancy Status</label>
            <div className="moihub-status-options">
              {vacancyStatuses.map((status) => (
                <button
                  key={status.value}
                  className={`moihub-status-option ${filters.vacancyStatus === status.value ? 'moihub-status-option-selected' : ''}`}
                  onClick={() => setFilters({ 
                    ...filters, 
                    vacancyStatus: filters.vacancyStatus === status.value ? '' : status.value 
                  })}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.keys(getActiveFilters()).length > 0 && (
            <div className="moihub-filter-section">
              <label className="moihub-filter-label">Active Filters</label>
              <div className="moihub-active-filters">
                {Object.entries(getActiveFilters()).map(([key, value]) => (
                  <div key={key} className="moihub-active-filter">
                    <span className="moihub-active-filter-text">
                      {key === 'vacancyStatus' 
                        ? vacancyStatuses.find(s => s.value === value)?.label || value
                        : `${key}: ${value}`
                      }
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, [key]: '' })}
                      className="moihub-remove-filter"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="moihub-modal-actions">
          <button
            className="moihub-reset-btn"
            onClick={resetFilters}
          >
            Reset All
          </button>
          <button
            className="moihub-apply-btn"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="moihub-loading-container">
        <div className="moihub-loading-spinner"></div>
        <div className="moihub-loading-text">Loading rentals...</div>
      </div>
    );
  }

  return (
    <div className="moihub-rentals-container">
      {/* Unique Search Panel */}
      <div className="moihub-search-panel">
        <div className="moihub-search-bar">
          <span className="moihub-search-icon">🔍</span>
          <input
            type="text"
            className="moihub-search-input"
            placeholder="Search by location, name, or type..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery.length > 0 && (
            <button onClick={clearSearch} className="moihub-clear-search-btn">
              ×
            </button>
          )}
          {isSearching && (
            <div className="moihub-search-spinner"></div>
          )}
          <button
            className={`moihub-filter-toggle ${Object.keys(getActiveFilters()).length > 0 ? 'moihub-filter-toggle-active' : ''}`}
            onClick={() => setShowFilterModal(true)}
          >
            <span className="moihub-filter-toggle-icon">⚙️</span>
            {Object.keys(getActiveFilters()).length > 0 && (
              <span className="moihub-filter-badge">
                {Object.keys(getActiveFilters()).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {(searchQuery || Object.keys(getActiveFilters()).length > 0) && (
        <div className="moihub-search-results-info">
          <div className="moihub-search-summary">
            {searchQuery && `Search: "${searchQuery}"`}
            {searchQuery && Object.keys(getActiveFilters()).length > 0 && ' • '}
            {Object.keys(getActiveFilters()).length > 0 && 
              `${Object.keys(getActiveFilters()).length} filter(s) applied`
            }
          </div>
          <button
            onClick={clearAllSearchAndFilters}
            className="moihub-clear-all-btn"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Rentals Grid */}
      <div className="moihub-rentals-grid">
        {rentals.length > 0 ? (
          rentals.map(renderRentalItem)
        ) : (
          <div className="moihub-empty-state">
            <div className="moihub-empty-icon">🏠</div>
            <div className="moihub-empty-title">No rentals found</div>
            <div className="moihub-empty-subtitle">
              {searchQuery || Object.keys(getActiveFilters()).length > 0 
                ? 'Try adjusting your search or filters' 
                : 'Check back later for new listings'
              }
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {renderPaginationControls()}

      {/* Filter Modal */}
      {renderFilterModal()}
    </div>
  );
};

export default RentalHome;