import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './shoplist.css';

const ShopList = ({ shops }) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredShops = shops.filter((shop) =>
    shop.category === categoryId &&
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShopClick = (shopId) => {
    navigate(`/products/${shopId}`);
  };

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <>
      <style>
        {`
          .search-bar-container {
            margin: 20px;
            text-align: center;
          }

          .search-input {
            padding: 10px;
            width: 80%;
            max-width: 500px;
            border: 2px solid green;
            border-radius: 5px;
            font-size: 16px;
          }

         
        `}
      </style>
      <section className="search-bar-container">
        <input
          type="text"
          placeholder="Search shops..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
      </section>
      <section className="business-cards-container">
        {filteredShops.map((shop) => (
          <div className="business-card" key={shop.id}>
            <div className="biz-title-card">
              <h2>{shop.name}</h2>
            </div>
            <div className="info-cards">
              <div className="location-card">
                <h3>
                  <i className="fas fa-map-marker-alt"></i> {shop.location}
                </h3>
              </div>
            </div>
            <div className="additional-info">
              <div className="info">
                <p>{shop.description}</p>
              </div>
            </div>
            <div className="btn-container">
              <button className="btn-shop" onClick={() => handleShopClick(shop.id)}>
                View Shop <i className="fas fa-store"></i>
              </button>
            </div>
          </div>
        ))}
      </section>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg> */}
    </>
  );
};

export default ShopList;
