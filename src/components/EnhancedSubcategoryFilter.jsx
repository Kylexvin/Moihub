import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './EnhancedSubcategoryFilter.css';

const EnhancedSubcategoryFilter = ({ subcategories, selectedSubcategory, setSelectedSubcategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (subcategories.length === 0) {
    return null;
  }

  return (
    <div className="enhanced-subcategory-filter">
      <div className="filter-content">
        <div className="filter-container">
          <div className="filter-label">
            <Filter />
            <label htmlFor="subcategory-select">Filter by Subcategory</label>
          </div>
          <div className="relative">
            <button
              id="subcategory-select"
              onClick={() => setIsOpen(!isOpen)}
              className="filter-select"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span>{selectedSubcategory || 'All'}</span>
              <ChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
              <ul className="filter-options" role="listbox">
                <li
                  className="filter-option"
                  onClick={() => {
                    setSelectedSubcategory('');
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedSubcategory === ''}
                >
                  All
                </li>
                {subcategories.map((subcategory) => (
                  <li
                    key={subcategory}
                    className="filter-option"
                    onClick={() => {
                      setSelectedSubcategory(subcategory);
                      setIsOpen(false);
                    }}
                    role="option"
                    aria-selected={selectedSubcategory === subcategory}
                  >
                    {subcategory}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSubcategoryFilter;