import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Phone, ChevronDown, ChevronUp, Star, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import providerData from '../data/moidelish.json';
import './providersdetails.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const checkPointer = () => {
      const target = document.elementFromPoint(position.x, position.y);
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkPointer);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkPointer);
    };
  }, [position]);

  return (
    <motion.div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      animate={{
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'var(--secondary-color)' : 'var(--primary-color)',
      }}
    />
  );
};

const ProviderDetails = () => {
  const { providerId } = useParams();
  const provider = providerData.find(p => p.id === providerId);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const headerRef = useRef(null);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 200], [0, -50]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!provider) {
      toast.error("Provider not found", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'toast-error',
      });
    }
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [provider]);

  if (isLoading) {
    return (
      <div className="loading-container">
       <span class="loader"></span>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="provider-not-found">
        <ToastContainer />
        <p>Provider not found.</p>
      </div>
    );
  }

  const handleCall = () => {
    window.location.href = `tel:${provider.phone}`;
    toast.success("Initiating call...", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'toast-success',
    });
  };

  const categories = ['All', ...new Set(provider.products.map(product => product.category))];

  const filteredProducts = selectedCategory === 'All'
    ? provider.products
    : provider.products.filter(product => product.category === selectedCategory);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className={`provider-details-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <CustomCursor />
      <ToastContainer />
      <motion.header
        ref={headerRef}
        className="provider-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ y: headerY }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="header-content">
          <div className="provider-header-top">
            <h1 className="provider-name">{provider.name}</h1>
            {/* <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="call-button"
              onClick={handleCall}
            >
              <Phone className="call-icon" size={18} />
              Call Now
            </motion.button> */}
          </div>
          <AnimatePresence>
            {isHeaderExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="provider-info"
              >
                <p className="info-item">
                  <MapPin className="info-icon" />
                  {provider.location}
                </p>
                <p className="info-item">
                  <Clock className="info-icon" />
                  {provider.deliveryTime}
                </p>
                {/* <div className="info-item">
                  <Star className="info-icon" />
                  <span>{provider.rating} ({provider.reviewCount} reviews)</span>
                </div> */}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            className="toggle-info"
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
          >
            {isHeaderExpanded ? 'Less info' : 'More info'}
            {isHeaderExpanded ? (
              <ChevronUp size={16} className="toggle-icon" />
            ) : (
              <ChevronDown size={16} className="toggle-icon" />
            )}
          </button>
        </div>
      </motion.header>

      <main className="provider-main">
        <div className="category-list">
          {/* <div className="category-items">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`category-button ${
                  selectedCategory === category ? 'active-category' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </motion.button>
            ))}
          </div> */}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="product-card"
              whileHover={{ 
                y: -5,
                rotateY: 5,
                rotateX: 5,
                scale: 1.05
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="image-overlay">
                  <h3 className="product-name">{product.name}</h3>
                </div>
              </div>
              <div className="product-details">
                <div className="product-price-container">
                  <span className="product-price">{product.price}</span>
                  {product.price2 && (
                    <span className="product-price-alt">{product.price2}</span>
                  )}
                </div>
                {product.price3 && (
                  <span className="product-price-secondary">{product.price3}</span>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="order-button"
                  onClick={handleCall}
                >
                  <Phone className="call-icon" size={18} />
                  Order Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      
      <button className="theme-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
};

export default ProviderDetails;