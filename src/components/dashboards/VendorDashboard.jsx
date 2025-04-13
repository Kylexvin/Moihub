import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import ListingForm from './ListingForm';
import ListingsCards from './ListingsCards';
import FoodOrderNotification from './FoodOrderNotification';
import VendorProfilePage from './VendorProfilePage'; 
import { ShoppingBag, PlusCircle, Bell, User } from 'lucide-react';
import './VendorDashboard.css';

const VendorDashboard = () => {
  // State to track which component to display
  const [activeComponent, setActiveComponent] = useState('listings');
  // State to track the listing being edited (if any)
  const [editingListingId, setEditingListingId] = useState(null);
  
  // Vendor profile and subscription data
  const [vendor, setVendor] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Fetch vendor profile on load
  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get('https://moihub.onrender.com/api/food/vendors/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Adjust auth as needed
          }
        });
        const vendorData = res.data.vendor;
        setVendor(vendorData);

        if (vendorData.subscriptionEndDate) {
          const expiry = new Date(vendorData.subscriptionEndDate);
          const now = new Date();

          if (expiry < now) {
            setIsExpired(true);
          } else {
            // Start countdown
            const interval = setInterval(() => {
              const now = new Date();
              const diff = expiry - now;

              if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('');
                clearInterval(interval);
                return;
              }

              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);

              setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }, 1000);

            return () => clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Failed to load vendor profile:', error);
      }
    };

    fetchVendor();
  }, []);

  // Function to render the correct component based on state
  const renderComponent = () => {
    switch (activeComponent) {
      case 'addListing':
        return <ListingForm listingId={editingListingId} setActiveComponent={setActiveComponent} />;
      case 'listings':
        return <ListingsCards setActiveComponent={setActiveComponent} setEditingListingId={setEditingListingId} />;
      case 'orders':
        return <FoodOrderNotification />;
      case 'profile':
        return <VendorProfilePage />;
      default:
        return <ListingsCards setActiveComponent={setActiveComponent} setEditingListingId={setEditingListingId} />;
    }
  };

  // Handle navigation to Add Product
  const handleAddProduct = () => {
    setEditingListingId(null); // Clear any existing editing ID
    setActiveComponent('addListing');
  };

  return (
    <div className="vendor-dashboard">
      {/* 🔐 Lock screen if subscription expired */}
      {isExpired ? (
        <div className="expired-overlay">
          <div className="expired-message">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Subscription Expired</h2>
            <p className="mb-4">Your access has been restricted. Please renew your subscription to continue using the dashboard.</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Contact Support
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Show countdown timer if active */}
        

          {/* Dashboard Navigation */}
          <div className="top-navigation">
            <button
              className={`nav-button ${activeComponent === 'listings' ? 'active' : ''}`}
              onClick={() => setActiveComponent('listings')}
            >
              <ShoppingBag size={18} />
              <span>My Products</span>
            </button>
            <button
              className={`nav-button ${activeComponent === 'addListing' ? 'active' : ''}`}
              onClick={handleAddProduct}
            >
              <PlusCircle size={18} />
              <span>Add Product</span>
            </button>
            <button
              className={`nav-button ${activeComponent === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveComponent('orders')}
            >
              <Bell size={18} />
              <span>Orders</span>
            </button>
            <button
              className={`nav-button ${activeComponent === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveComponent('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
          </div>

          {/* Active Component */}
          <div className="component-container">
            <div className="page-title">
            {timeLeft && (
            <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm mb-4">
              ⏳ Your subscription expires in: <strong>{timeLeft}</strong>
            </div>
          )}
              {activeComponent === 'listings' && <h2></h2>}
              {activeComponent === 'addListing' && <h2>{editingListingId ? 'Edit Product' : 'Add New Product'}</h2>}
              {activeComponent === 'orders' && <h2></h2>}
              {activeComponent === 'profile' && <h2></h2>}
            </div>
            {renderComponent()}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;
