import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './shoplist.css';

const ShopList = () => {
  const { categoryId } = useParams();
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
        const response = await axios.get(`http://localhost:5000/api/eshop/vendor/categories`);
        if (response.data.success) {
          const category = response.data.data.find(cat => cat._id === categoryId);
          if (category) {
            setCategoryName(category.name);
            fetchShops(category.name);
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
    const fetchShops = async (name) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/eshop/vendor/categories/${name}/shops`);
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
  }, [categoryId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopClick = (shopId) => {
    navigate(`/products/${shopId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading shops...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      
      
      <section className="search-bar-container">
        <input
          type="text"
          placeholder="Search shops..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </section>
      
      {filteredShops.length > 0 ? (
        <section className="business-cards-container">
          {filteredShops.map((shop) => (
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
                <button className="btn-shop" onClick={() => handleShopClick(shop._id)}>
                  View Shop <i className="fas fa-store"></i>
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div className="no-shops-message">
          <i className="fas fa-store-slash"></i>
          <p>No shops found for this category.</p>
        </div>
      )}
    </>
  );
};

export default ShopList;