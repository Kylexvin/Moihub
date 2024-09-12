import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductList.css';
import ShopSkeleton from './ShopSkeleton';

const ProductList = ({ shops }) => {
  const { shopId } = useParams();
  const shop = shops.find((s) => s.id === shopId);
  const [showInfo, setShowInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (shop && shop.products) {
      // Get unique subcategories from products and filter out null/undefined
      const uniqueSubcategories = [
        ...new Set(shop.products.map((product) => product.subcategory)),
      ].filter(Boolean);
      setSubcategories(uniqueSubcategories);
    } else {
      setSubcategories([]);
    }
  }, [shop]);

  const toggleInfo = (productId) => {
    setShowInfo((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleOrderLink = (product) => {
    const message = `Hello, I would like to order the following item:\n\nProduct: ${product.name}\nPrice: Ksh ${product.price}\n\nThank you!`;
    const phoneNumber = shop.phone;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const addToOrderSummary = (product) => {
    setOrderItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromOrderSummary = (productId) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary((prevState) => !prevState);
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    const cartItems = orderItems
      .map(
        (item) => `${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`
      )
      .join('\n');
    const totalPrice = getTotalPrice();
    const message = `Hello, I would like to order the following items:\n\n${cartItems}\n\nTotal: Ksh ${totalPrice}\n\nThank you!`;
    const phoneNumber = shop.phone;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter products based on the selected subcategory
  const filteredProducts = shop
    ? shop.products.filter(
        (product) =>
          (!selectedSubcategory || product.subcategory === selectedSubcategory) &&
          product.subcategory !== undefined &&
          product.subcategory !== null
      )
    : [];

  // Reset product info display when subcategory changes
  useEffect(() => {
    setShowInfo({});
  }, [selectedSubcategory]);

  if (isLoading) {
    return <ShopSkeleton />;
  }

  return (
    <>
      <div className="product-list-container">
        {shop ? (
          <div className="product-list">
            <div className="shop-info">
              <div className="shop-name">{shop.name}</div>
              <div className="shop-location">
                <div className="location">
                  {shop.location} <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="phone">
                  {shop.phone} <i className="fas fa-phone"></i>
                </div>
              </div>
            </div>

            {/* Subcategory Filter Panel */}
            {subcategories.length > 0 && (
              <div className="subcategory-filter">
                <div className="filter-header">
                  <label htmlFor="subcategory-select" className="filter-label">
                    <i className="fas fa-filter"></i> Filter by Subcategory
                  </label>
                </div>
                <div className="select-wrapper">
                  <select
                    id="subcategory-select"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {filteredProducts.length > 0 ? (
              <div className="card-container">
                {filteredProducts.map((product) => (
                  <div className="mini-card" key={product.id}>
                    <div className="img-container" id={`product${product.id}`}>
                      <img
                        className="item-photo"
                        src={product?.image}
                        alt={`Product ${product?.id}`}
                      />
                    </div>

                    <div className="item-container">
                      <h2 className="item-name">{product?.name}</h2>

                      <div className="price-container">
                        <p className="item-price">
                          <i className="fas fa-tag"></i> Ksh {product?.price}
                        </p>
                      </div>

                      <div className="button-container">
                        <button
                          className="button-n"
                          onClick={() => toggleInfo(product.id)}
                        >
                          <i className="fas fa-info-circle"></i>
                        </button>
                        <button
                          className="button-n"
                          onClick={() => handleOrderLink(product)}
                        >
                          <i className="fab fa-whatsapp"></i>
                        </button>
                        <button
                          className="button-n"
                          onClick={() => addToOrderSummary(product)}
                        >
                          <i className="fas fa-shopping-cart"></i>
                        </button>
                      </div>

                      {showInfo[product.id] && (
                        <div className="extra-info">
                          <p>{product?.info}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available in this shop.</p>
            )}
          </div>
        ) : (
          <p className="error-message">Shop not found.</p>
        )}
      </div>

      <div
        className="order-summary-container"
        onClick={(e) => {
          e.stopPropagation();
          toggleOrderSummary();
        }}
      >
        <div className="order-icon">
          <i className="fas fa-clipboard-list"></i>
          <span className="order-count">{getTotalQuantity()}</span>
        </div>
        <p className="order-total">Total: Ksh {getTotalPrice()}</p>
      </div>

      {showOrderSummary && (
        <div className="order-summary-modal">
          <h2>Your Order Summary</h2>
          {orderItems.length > 0 ? (
            <>
              {orderItems.map((item) => (
                <div key={item.id} className="order-item">
                  <span>{item.name}</span>
                  <span>Ksh {item.price}</span>
                  <span>Quantity: {item.quantity}</span>
                  <button
                    className="remove-item"
                    onClick={() => removeFromOrderSummary(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="order-total">
                <strong>Total: Ksh {getTotalPrice()}</strong>
              </div>
              <div className="button-container">
                <button className="place-order-button" onClick={toggleOrderSummary}>
                  Close
                </button>
                <button className="place-order-button" onClick={handlePlaceOrder}>
                  Order
                </button>
              </div>
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      )}
    </>
  );
};

export default ProductList;
