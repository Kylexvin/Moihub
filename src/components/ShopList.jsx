import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './shoplist.css';

// Skeleton Loading Component for Shop Cards
const ShopCardSkeleton = () => (
  <div className="business-card skeleton-card">
    <div className="biz-title-card skeleton-title">
      <div className="skeleton-text"></div>
    </div>
    <div className="info-cards">
      <div className="location-card skeleton-location">
        <div className="skeleton-text"></div>
      </div>
    </div>
    <div className="additional-info">
      <div className="info skeleton-description">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    </div>
    <div className="btn-container">
      <div className="skeleton-button"></div>
    </div>
  </div>
);

const ShopList = () => {
  const { categorySlug } = useParams(); // Changed from categoryId to categorySlug
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
    
    // Fetch category details to get the name
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`https://moihub.onrender.com/api/eshop/vendor/categories`);
        if (response.data.success) {
          const category = response.data.data.find(cat => cat.slug === categorySlug);  // Find by slug
          if (category) {
            setCategoryName(category.name);
            fetchShops(category.slug);  // Pass slug to fetch shops
          } else {
            setError('Category not found');
            setLoading(false);
          }
        } else {
          setError('Failed to fetch category details');
          setLoading(false);
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching category:', err);
        setLoading(false);
      }
    };

    // Fetch shops for the specific category
    const fetchShops = async (slug) => {
      try {
        // Add a small delay to ensure smooth loading experience
        await new Promise(resolve => setTimeout(resolve, 500));

        const response = await axios.get(`https://moihub.onrender.com/api/eshop/vendor/categories/${slug}/shops`);
        if (response.data.success) {
          setShops(response.data.data);
        } else {
          setError('Failed to fetch shops');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryName();
  }, [categorySlug]); // Changed dependency to categorySlug

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );
   
  const handleShopClick = (shopSlug) => {
    navigate(`/products/${shopSlug}`); // Changed to use shop slug
  };

  return (
    <div className="shop-list-container">
      {/* Search Bar */}
      <section className="search-bar-container">
        <input
          type="text"
          placeholder="Search shops..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          disabled={loading}
        />
      </section>
      
      {/* Shops Content */}
      <section className="business-cards-container">
        {loading 
          ? Array.from({ length: 6 }).map((_, index) => (
              <ShopCardSkeleton key={index} />
            ))
          : error 
          ? (
              <div className="error-container">
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
              </div>
            )
          : filteredShops.length > 0 
          ? (
              filteredShops.map((shop) => (
                <div className="business-card" key={shop._id}>
                  <div className="biz-title-card">
                    <h2>{shop.shopName}</h2>
                  </div>
                  <div className="info-cards">
                    <div className="location-card">
                      <h3>
                        <i className="fas fa-map-marker-alt"></i> {shop.address}
                      </h3>
                    </div>
                  </div>
                  <div className="additional-info">
                    <div className="info">
                      <p>{shop.description}</p>
                    </div>
                  </div>
                  <div className="btn-container">
                    <button 
                      className="btn-shop" 
                      onClick={() => handleShopClick(shop.slug)} // Changed to use shop slug
                    >
                      View Shop <i className="fas fa-store"></i>
                    </button>
                  </div>
                </div>
              ))
            )
          : (
              <div className="no-shops-message">
                <i className="fas fa-store-slash"></i>
                <p>No shops found for this category.</p>
              </div>
            )
        }
      </section>
    </div>
  );
};

export default ShopList;