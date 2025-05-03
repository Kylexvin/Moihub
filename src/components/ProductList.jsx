import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [showInfo, setShowInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    shippingAddress: '',
    contactNumber: ''
  });
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingImages, setLoadingImages] = useState({});

  // Get token from localStorage with correct key
  const token = localStorage.getItem('token');

  // Configure axios with headers for authenticated requests
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Check authentication status on load using the correct token key
  useEffect(() => {
    const checkAuthStatus = () => {
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };
    
    checkAuthStatus();
  }, [token]);

  // Fetch shop and product data
  useEffect(() => {
    console.log("Shop ID from params:", shopId);

    const fetchShopAndProducts = async () => {
      try {
        // Fetch products which also contains shop data
        const productsResponse = await axios.get(
          `https://moihub.onrender.com/api/eshop/vendor/shop/${shopId}/products?page=1&limit=50`
        );
        
        if (productsResponse.data.success) {
          // Filter out products where isAvailable is false
          const availableProducts = productsResponse.data.data.filter(
            product => product.isAvailable === true
          );
          
          // Set up initial loading state for all product images
          const initialLoadingState = {};
          availableProducts.forEach(product => {
            initialLoadingState[product._id] = true;
          });
          setLoadingImages(initialLoadingState);
          
          // Set only available products
          setProducts(availableProducts);
          
          // Extract shop data from the same response
          if (productsResponse.data.shop) {
            setShop({
              name: productsResponse.data.shop.name,
              contactNumber: productsResponse.data.shop.contactNumber
            });
          } else {
            // Fallback if shop data is missing
            setShop({
              name: "Shop Details",
              contactNumber: "Contact for details"
            });
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopAndProducts();
    window.scrollTo(0, 0);
  }, [shopId]);

  const toggleInfo = (productId) => {
    setShowInfo((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  const handleImageLoad = (productId) => {
    setLoadingImages(prev => ({
      ...prev,
      [productId]: false
    }));
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
  };

  const addToOrderSummary = (product) => {
    setOrderItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.productId === product._id);
      if (existingProduct) {
        return prevItems.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { 
        productId: product._id, 
        name: product.name, 
        price: product.price, 
        image: product.image,
        quantity: 1 
      }];
    });
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromOrderSummary(productId);
      return;
    }
    
    setOrderItems((prevItems) => 
      prevItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromOrderSummary = (productId) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary((prevState) => !prevState);
    
    // Reset form state when opening order summary
    if (!showOrderSummary) {
      setOrderError(null);
      setShowOrderForm(false);
    }
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (orderError) {
      setOrderError(null);
    }
  };

  const handlePlaceOrder = async () => {
    // Check if user is authenticated with the correct token key
    if (!token) {
      setOrderError('Session expired. Please refresh the page.');
      return;
    }
    
    // Show order form if not already showing
    if (!showOrderForm) {
      setShowOrderForm(true);
      return;
    }
  
    // Validate form
    if (!orderFormData.shippingAddress.trim()) {
      setOrderError('Please enter a shipping address');
      return;
    }
    
    if (!orderFormData.contactNumber.trim()) {
      setOrderError('Please enter a contact number');
      return;
    }
  
    try {
      setIsLoading(true);
      setOrderError(null); // Clear any previous errors
      
      const orderData = {
        shopId: shopId, 
        items: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: orderFormData.shippingAddress,
        contactNumber: orderFormData.contactNumber
      };
  
      console.log('Sending order with data:', orderData);
      
      // Use the config object for the request with the correct token
      const response = await axios.post(
        'https://moihub.onrender.com/api/eshop/orders/place',
        orderData,
        config
      );
  
      if (response.data.success) {
        setOrderSuccess(true);
        setOrderItems([]);
        setShowOrderForm(false);
        setOrderFormData({
          shippingAddress: '',
          contactNumber: ''
        });
        
        // Show success message and hide after delay
        setTimeout(() => {
          setOrderSuccess(false);
          setShowOrderSummary(false);
        }, 2000);
      } else {
        setOrderError(response.data.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server returned an error response
        if (error.response.status === 401) {
          setOrderError('Your session has expired. Please refresh the page and try again.');
        } else if (error.response.status === 404) {
          setOrderError('Shop or products not found. Please refresh the page.');
        } else {
          setOrderError(error.response.data.message || 'Failed to place order. Please try again.');
        }
      } else if (error.request) {
        // Request made but no response received
        setOrderError('Network error. Please check your connection and try again.');
      } else {
        // Something else caused the error
        setOrderError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="product-list-container">
        <div className="shop-info p-4 bg-white shadow-md rounded-2xl">
          <h2 className="text-xl font-semibold text-gray-800">{shop?.name || "Shop Details"}</h2>
          <p className="text-sm text-gray-500">Contact: {shop?.contactNumber || "Contact for details"}</p>
        </div>
        <div className="no-products">
          <i className="fas fa-box-open"></i>
          <p>No products available in this shop.</p>
          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-list-container"> 
        <div className="relative">
          {/* Shop info card */}
          <div className="shop-info p-4 bg-white shadow-md flex justify-between items-center rounded-none">
            <h2 className="text-lg font-semibold text-gray-800">
              {shop?.name || "Shop Details"}
            </h2>
            <p className="text-sm text-gray-500">
              <i className="fas fa-phone mr-1"></i>
              {shop?.contactNumber || "N/A"}
            </p>
          </div>
        </div>

        <div className="product-list">
          <div className="card-container">
            {products.map((product) => (
              <div className="mini-card" key={product._id}>
                <div className="img-container" id={`product${product._id}`}>
                  {loadingImages[product._id] && (
                    <div className="image-loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <img
                    className={`item-photo ${loadingImages[product._id] ? 'loading' : 'loaded'}`}
                    src={product.image}
                    alt={product.name}
                    onLoad={() => handleImageLoad(product._id)}
                    onError={handleImageError}
                  />
                </div>

                <div className="item-container">
                  <h2 className="item-name">{product.name}</h2>

                  <div className="price-container">
                    <p className="item-price">
                      <i className="fas fa-tag"></i> Ksh {product.price}
                    </p>
                  </div>

                  <div className="button-container">
                    <button
                      className="button-n"
                      onClick={() => toggleInfo(product._id)}
                      aria-label="Show product info"
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                    <button
                      className="button-n"
                      onClick={() => addToOrderSummary(product)}
                      aria-label="Add to cart"
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                  </div>

                  {showInfo[product._id] && (
                    <div className="extra-info">
                      <p>{product.description || "No description available."}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {orderItems.length > 0 && (
        <div
          className="order-summary-container"
          onClick={toggleOrderSummary}
          role="button"
          aria-label="View order summary"
        >
          <div className="order-icon">
            <i className="fas fa-clipboard-list"></i>
            <span className="order-count">{getTotalQuantity()}</span>
          </div>
          <p className="order-total">Total: Ksh {getTotalPrice()}</p>
        </div>
      )}

      {showOrderSummary && (
        <div className="order-summary-modal-overlay" onClick={toggleOrderSummary}>
          <div className="order-summary-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-summary-content">
              <div className="order-summary-header">
                <h2>Your Order Summary</h2>
                <button className="close-button" onClick={toggleOrderSummary} aria-label="Close">×</button>
              </div>
              
              {orderSuccess && (
                <div className="order-success">
                  <i className="fas fa-check-circle"></i>
                  <p>Order placed successfully!</p>
                </div>
              )}
              
              {orderError && (
                <div className="order-error">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{orderError}</p>
                </div>
              )}
              
              {orderItems.length > 0 ? (
                <>
                  <div className="order-items-list">
                    {orderItems.map((item) => (
                      <div key={item.productId} className="order-item">
                        <div className="order-item-details">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="order-item-image" 
                            onError={handleImageError}
                          />
                          <div className="order-item-info">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-price">Ksh {item.price}</span>
                          </div>
                        </div>
                        <div className="order-item-actions">
                          <div className="quantity-controls">
                            <button 
                              className="quantity-btn"
                              onClick={() => updateItemQuantity(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="order-item-quantity">{item.quantity}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => updateItemQuantity(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <button
                            className="remove-item"
                            onClick={() => removeFromOrderSummary(item.productId)}
                            aria-label="Remove item"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-total-section">
                    <div className="subtotal">
                      <span>Subtotal:</span>
                      <span>Ksh {getTotalPrice()}</span>
                    </div>
                    <div className="total">
                      <span>Total:</span>
                      <span>Ksh {getTotalPrice()}</span>
                    </div>
                  </div>
                  
                  {showOrderForm ? (
                    <div className="order-form">
                      <div className="form-group">
                        <label htmlFor="shippingAddress">Shipping Address</label>
                        <input
                          type="text"
                          id="shippingAddress"
                          name="shippingAddress"
                          value={orderFormData.shippingAddress}
                          onChange={handleFormChange}
                          placeholder="Enter your delivery address"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="contactNumber">Contact Number</label>
                        <input
                          type="text"
                          id="contactNumber"
                          name="contactNumber"
                          value={orderFormData.contactNumber}
                          onChange={handleFormChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="order-actions">
                    <button 
                      className="place-order-button" 
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="button-spinner"></div>
                          Processing...
                        </>
                      ) : showOrderForm ? (
                        'Confirm Order'
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-order">
                  <i className="fas fa-shopping-cart"></i>
                  <p>Your order summary is empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductList;