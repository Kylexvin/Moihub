import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Eye,
  CheckCircle,
  Trash2,
  User,
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
  Search
} from "lucide-react";
import Swal from "sweetalert2";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionDate, setSubscriptionDate] = useState('');
  const navigate = useNavigate();
  const { vendorId } = useParams();

  // Initial JWT token check
  const token = localStorage.getItem('token');

  // Configure axios with headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        'https://moihub.onrender.com/api/food/admin/vendors',
        config
      );
      setVendors(response.data.vendors);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      setLoading(false);
      
      Swal.fire({
        title: 'Error!',
        text: `Failed to fetch vendors: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  // Approve a vendor with custom subscription date
  const approveVendor = async (vendorId, subscriptionEndDate) => {
    try {
      await axios.patch(
        `https://moihub.onrender.com/api/food/admin/vendors/${vendorId}/approve`,
        { subscriptionEndDate },
        config
      );
      fetchVendors();
      setSubscriptionDate('');
      
      Swal.fire({
        title: 'Success!',
        text: 'Vendor approved successfully!',
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: `Failed to approve vendor: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  // Open approval modal with current date as default
  const openApprovalModal = (vendor) => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() + 1); // Default to 1 year from now
    setSubscriptionDate(defaultDate.toISOString().split('T')[0]);
    setSelectedVendor({...vendor, approvalMode: true});
  };

  // Update vendor status
  const updateVendorStatus = async (vendorId, isApproved, isActive, subscriptionEndDate) => {
    try {
      await axios.put(
        `https://moihub.onrender.com/api/food/admin/vendors/${vendorId}/status`,
        { isApproved, isActive, subscriptionEndDate },
        config
      );
      fetchVendors();
      
      Swal.fire({
        title: 'Success!',
        text: 'Vendor status updated successfully!',
        icon: 'success',
        confirmButtonText: 'Great!',
        confirmButtonColor: '#28a745',
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: `Failed to update vendor status: ${errorMessage}`,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  // Delete a vendor
  const deleteVendor = async (vendorId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://moihub.onrender.com/api/food/admin/vendors/${vendorId}`,
            config
          );
          
          // Update the local state to remove the deleted vendor
          setVendors(vendors.filter(vendor => vendor._id !== vendorId));
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Vendor has been deleted.',
            icon: 'success',
            confirmButtonColor: '#28a745',
          });
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
          
          Swal.fire({
            title: 'Error!',
            text: `Failed to delete vendor: ${errorMessage}`,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
          });
        }
      }
    });
  };

  // Filter vendors by search term
  const filteredVendors = vendors.filter((vendor) =>
    vendor.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    fetchVendors();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-3 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h2 className="fw-bold text-primary mb-2 mb-md-0">Vendor Management</h2>
        <button 
          className="btn btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-1"
          onClick={() => fetchVendors()}
        >
          <span>Refresh</span>
        </button>
      </div>
      
      <div className="card shadow mb-3 border-0 rounded-3 overflow-hidden">
        <div className="card-body p-0">
          <div className="input-group p-2">
            <span className="input-group-text bg-light border-0 ps-3">
              <Search size={16} className="text-muted" />
            </span>
            <input
              type="text"
              placeholder="Search vendors..."
              className="form-control border-0 shadow-none py-2 px-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-4 py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden"></span>
          </div>
          <span className="ms-3 text-muted">Loading vendors...</span>
        </div>
      ) : error ? (
        <div className="alert alert-danger shadow-sm rounded-3 d-flex align-items-center gap-2">
          <AlertTriangle size={18} />
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-4 my-3">
              <div className="mb-2">
                <Search size={36} className="text-muted opacity-50" />
              </div>
              <h5 className="text-muted mb-1">No vendors found</h5>
              <p className="text-muted small">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="vendor-card p-3 rounded-3 position-relative"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f7f9fc)",
                  borderRadius: "1rem",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.03)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.05)";
                }}
              >
                {/* Status badge */}
                <div className="position-absolute end-0 top-0 mt-3 me-3">
                  <span
                    className={`badge px-2 py-1 rounded-pill ${
                      vendor.isApproved && vendor.isActive
                        ? "bg-success-subtle text-success"
                        : vendor.isApproved && !vendor.isActive
                        ? "bg-warning-subtle text-warning"
                        : "bg-secondary-subtle text-secondary"
                    }`}
                  >
                    {vendor.isApproved && vendor.isActive
                      ? "Active"
                      : vendor.isApproved && !vendor.isActive
                      ? "Suspended"
                      : "Pending"}
                  </span>
                </div>
                
                {/* User Section */}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                      color: "#fff",
                    }}
                  >
                    <User size={22} />
                  </div>
                  <div>
                    <div className="fw-bold fs-5 text-dark mb-0">
                      {vendor.user?.username || "Unnamed Vendor"}
                    </div>
                    <div className="text-muted small">
                      {vendor.user?.email}
                      {vendor.phone && (
                        <span className="d-none d-md-inline">
                          <span className="mx-1">•</span>
                          {vendor.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Info Cards - Simplified for mobile */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded-3 h-100" style={{ background: "rgba(13, 110, 253, 0.05)" }}>
                      <div className="d-flex align-items-center mb-1">
                        <Calendar size={14} className="text-primary me-1" />
                        <div className="text-primary small fw-semibold">Subscription</div>
                      </div>
                      <div className="small">
                        {vendor.subscriptionEndDate
                          ? formatDate(vendor.subscriptionEndDate)
                          : "Not set"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="p-2 rounded-3 h-100" style={{ background: "rgba(25, 135, 84, 0.05)" }}>
                      <div className="d-flex align-items-center mb-1">
                        <Clock size={14} className="text-success me-1" />
                        <div className="text-success small fw-semibold">Joined</div>
                      </div>
                      <div className="small">
                        {vendor.createdAt
                          ? formatDate(vendor.createdAt)
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Bottom buttons */}
                <div className="d-flex flex-wrap justify-content-between align-items-center border-top pt-2 mt-1 gap-2">
                  <button
                    className="btn btn-primary btn-sm rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                    onClick={() => setSelectedVendor({ ...vendor, approvalMode: false })}
                  >
                    <Eye size={14} /> 
                    <span className="ms-1 d-none d-sm-inline">View Details</span>
                  </button>
        
                  <div className="d-flex gap-1">
                    {!vendor.isApproved ? (
                      <button
                        className="btn btn-success btn-sm rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                        onClick={() => openApprovalModal(vendor)}
                      >
                        <CheckCircle size={14} /> 
                        <span className="ms-1 d-none d-sm-inline">Approve</span>
                      </button>
                    ) : (
                      <button
                        className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 px-2 py-1 ${
                          vendor.isActive ? "btn-warning" : "btn-success"
                        }`}
                        onClick={() => {
                          updateVendorStatus(
                            vendor._id,
                            true,
                            !vendor.isActive,
                            vendor.subscriptionEndDate
                          );
                        }}
                      >
                        <CheckCircle size={14} /> 
                        <span className="ms-1 d-none d-sm-inline">{vendor.isActive ? "Suspend" : "Activate"}</span>
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm rounded-pill d-flex align-items-center gap-1 px-2 py-1"
                      onClick={() => deleteVendor(vendor._id)}
                    >
                      <Trash2 size={14} /> 
                      <span className="ms-1 d-none d-sm-inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>              
      )}

      {/* Simplified Modal with Backdrop */}
      {selectedVendor && (
        <div
          className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
            zIndex: 1050,
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setSelectedVendor(null);
            }
          }}
        >
          <div 
            className="card border-0 rounded-3 shadow-lg mx-2"
            style={{
              width: "95%",
              maxWidth: "450px",
              maxHeight: "90vh",
              overflow: "auto",
              animation: "modalFadeIn 0.3s ease-out",
            }}
          >
            {/* Header with gradient background */}
            <div className="card-header border-0 py-2 px-3" 
              style={{
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: "0.5rem",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-white fs-5 fw-semibold">
                  {selectedVendor.approvalMode ? "Approve Vendor" : "Vendor Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedVendor(null)}
                  aria-label="Close"
                />
              </div>
            </div>

            <div className="card-body p-3">
              {/* Vendor Basic Info Section */}
              <div className="mb-3 d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle shadow-sm flex-shrink-0"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    color: "#fff",
                  }}
                >
                  <User size={22} />
                </div>
                <div>
                  <div className="fw-bold fs-5 text-dark mb-0">
                    {selectedVendor.user?.username || "Unnamed Vendor"}
                  </div>
                  <div className="text-muted small">{selectedVendor.user?.email}</div>
                  {selectedVendor.phone && (
                    <div className="text-muted small">{selectedVendor.phone}</div>
                  )}
                </div>
              </div>

              {/* Current Status */}
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">Current Status</label>
                <div className="d-flex gap-2 mb-2">
                  <span
                    className={`badge px-2 py-1 rounded-pill ${
                      selectedVendor.isApproved && selectedVendor.isActive
                        ? "bg-success-subtle text-success"
                        : selectedVendor.isApproved && !selectedVendor.isActive
                        ? "bg-warning-subtle text-warning"
                        : "bg-secondary-subtle text-secondary"
                    }`}
                  >
                    {selectedVendor.isApproved && selectedVendor.isActive
                      ? "Active"
                      : selectedVendor.isApproved && !selectedVendor.isActive
                      ? "Suspended"
                      : "Pending"}
                  </span>
                </div>
              </div>

              {/* Subscription Date Field */}
              <div className="mb-3">
                <label className="form-label text-muted small mb-1">
                  Subscription End Date
                </label>
                <input
                  type="date"
                  className="form-control form-control-md rounded-3 shadow-sm"
                  defaultValue={selectedVendor.subscriptionEndDate
                    ? new Date(selectedVendor.subscriptionEndDate).toISOString().split("T")[0]
                    : ""}
                  onChange={(e) => {
                    setSelectedVendor((prev) => ({
                      ...prev,
                      subscriptionEndDate: e.target.value,
                    }));
                  }}
                />
                <div className="form-text small">
                  Set the date when this vendor's subscription will expire
                </div>
              </div>

              {/* Additional Vendor Information */}
              {!selectedVendor.approvalMode && (
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 rounded-3 border">
                      <div className="text-muted small mb-1">Joined On</div>
                      <div className="fw-semibold small">
                        {selectedVendor.createdAt 
                          ? formatDate(selectedVendor.createdAt) 
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 rounded-3 border">
                      <div className="text-muted small mb-1">Last Updated</div>
                      <div className="fw-semibold small">
                        {selectedVendor.updatedAt 
                          ? formatDate(selectedVendor.updatedAt) 
                          : "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer with Action Buttons */}
            <div className="card-footer bg-light px-3 py-2 border-top-0 d-flex flex-wrap justify-content-between gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-3 py-1"
                onClick={() => setSelectedVendor(null)}
              >
                Cancel
              </button>
              
              <div className="d-flex gap-1">
                {selectedVendor.approvalMode ? (
                  <button
                    className="btn btn-success rounded-pill px-3 py-1 fw-semibold"
                    onClick={() => {
                      approveVendor(
                        selectedVendor._id,
                        selectedVendor.subscriptionEndDate
                      );
                      setSelectedVendor(null);
                    }}
                  >
                    <CheckCircle size={16} className="me-1 d-none d-sm-inline" />
                    Approve
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-primary rounded-pill px-3 py-1"
                      onClick={() => {
                        updateVendorStatus(
                          selectedVendor._id,
                          selectedVendor.isApproved,
                          selectedVendor.isActive,
                          selectedVendor.subscriptionEndDate
                        );
                        setSelectedVendor(null);
                      }}
                    >
                      Update
                    </button>

                    <button
                      className={`btn rounded-pill px-3 py-1 ${
                        selectedVendor.isApproved && selectedVendor.isActive 
                          ? "btn-warning" 
                          : !selectedVendor.isApproved 
                          ? "btn-success"
                          : "btn-success"
                      }`}
                      onClick={() => {
                        if (!selectedVendor.isApproved) {
                          updateVendorStatus(
                            selectedVendor._id,
                            true, // approve
                            true, // activate
                            selectedVendor.subscriptionEndDate
                          );
                        } else {
                          updateVendorStatus(
                            selectedVendor._id,
                            true, // keep approved
                            !selectedVendor.isActive, // toggle active status
                            selectedVendor.subscriptionEndDate
                          );
                        }
                        setSelectedVendor(null);
                      }}
                    >
                      {!selectedVendor.isApproved 
                        ? "Approve" 
                        : selectedVendor.isActive 
                        ? "Suspend" 
                        : "Activate"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for modal animation */}
      <style jsx>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default VendorManagement;