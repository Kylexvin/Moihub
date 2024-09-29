import React, { useState } from 'react';
import './market.css'; // Import your custom styles if needed
import buyersData from '../data/buyers.json'; // Import the JSON data
import CustomerCare from './customercare';

const BuyersPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(buyersData);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value.trim().toLowerCase());
  };

  const searchProduct = () => {
    const filteredData = buyersData.filter(product => {
      const productName = product.name.toLowerCase();
      return productName.includes(searchInput);
    });
    setFilteredProducts(filteredData);
  };

  return (
    <>
      <div className="navigation">
        <a href="/marketplace" className="nav-link">
          Sellers
        </a>
        <a href="/buyers" className="nav-link active">
          Buyers
        </a>
      </div>
     
      <div className="search-button-container">
        <div className="neomorphic-search-panel">
          <input
            type="text"
            id="searchInput"
            className="search-input"
            placeholder="Search by product name"
            onChange={handleInputChange}
          />
          <div className="search-button-container">
            <button className="search" onClick={searchProduct}>
              Search
            </button>
          </div>
        </div>
      </div>
      
      <section className="products-container">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </section>
{/*       
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg> */}
      <CustomerCare/>
    </>
  );
};

const ProductCard = ({ name, condition, seller, phoneNumber, isAd }) => {
  const handleContact = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      console.error("Phone number not provided.");
    }
  };

  return (
    <div className="card-product">
      <div className="product-details">
        <div className="product-name">{name}</div>
        <div className="condition">{condition}</div>
        <div className="seller-name">{seller}</div>
      </div>
      <button className={isAd ? 'requestbutton' : 'requestbutton'} onClick={handleContact}>{isAd ? 'Claim Now' : 'Contact Now'}</button>
    </div>
  );
};

export default BuyersPage;
