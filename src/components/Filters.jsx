// Filters.js

import React, { useState } from 'react';
import './styles.css';

const Filters = ({ handleFiltering }) => {
  const [price, setPrice] = useState(10000); // Initial price value

  const handlePriceChange = (event) => {
    const newPrice = parseInt(event.target.value);
    setPrice(newPrice); // Update price state
  };

  return (
    <div className="filter-container">
      <div className="filters">
       
        <label htmlFor="searchInput">Search by Name:</label> 
         <div className="filter-group input-group">
          <input type="text" id="searchInput" placeholder="Enter name" />
          <button onClick={handleFiltering}>Search</button>
        </div>
         <label htmlFor="priceRange">Filter by Price (Ksh):</label>
        <input 
          type="range" 
          id="priceRange" 
          min="3000" 
          max="12000" 
          step="500" 
          defaultValue={price} 
          onChange={handlePriceChange} 
        />
        <span id="priceValue">{price}</span>
       
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="locationFilter">Filter by Location:</label>
            <select id="locationFilter">
              <option value="all">All</option>
              <option value="stage">Stage</option>
              <option value="mabs">Mabs</option>
              <option value="chebarus">Chebarus</option>
              {/* Add more location options as needed */}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="vacancyFilter">Filter by Vacancy:</label>
            <select id="vacancyFilter">
              <option value="all">All</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
        </div>
        <button onClick={handleFiltering}>Apply Filters</button>
      </div>
    </div>
  );
};

export default Filters;
