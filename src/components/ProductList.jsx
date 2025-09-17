import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  
  // Get token and user from localStorage
  const token = localStorage.getItem('token');
  const [currentUser, setCurrentUser] = useState(null);
  
  // State variables
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
  const [fetchError, setFetchError] = useState(null);

  // Configure axios with headers for authenticated requests
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // Get user data from localStorage
  useEffect(() => {
    const fetchCurrentUser = () => {
      if (token) {
        try {
          // Try different possible keys for user data
          const userData = localStorage.getItem('user') || 
                          localStorage.getItem('userData') || 
                          localStorage.getItem('currentUser');
          
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    };
    
    fetchCurrentUser();
  }, [token]);

// Fetch shop and product data 
useEffect(() => {
  const fetchShopAndProducts = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);

      // Fetch products (API already returns shop info)
      const productsResponse = await axios.get(
        `https://moihub.onrender.com/api/eshop/vendor/shops/${shopSlug}/products`
      );

      console.log('Products API Response:', productsResponse.data);

      if (productsResponse.data.success) {
        const products = productsResponse.data.data || [];

        // Filter only available products
        const availableProducts = products.filter(
          (product) => product.isAvailable !== false
        );

        // Set up initial loading state for all product images
        const initialLoadingState = {};
        availableProducts.forEach((product) => {
          initialLoadingState[product._id] = true;
        });
        setLoadingImages(initialLoadingState);
        setProducts(availableProducts);

        // Extract shop data, fallback shopId from first product
        const shopData = productsResponse.data.shop || {};
        const fallbackShopId = products.length > 0 ? products[0].shop : null;

        setShop({
          name: shopData.name || shopData.shopName || 'Shop Details',
          contactNumber:
            shopData.contactNumber ||
            shopData.phoneNumber ||
            'Contact for details',
          shopId: shopData._id || fallbackShopId,
          slug: shopData.slug || shopSlug,
        });

        console.log('Shop data set:', {
          name: shopData.name || shopData.shopName,
          shopId: shopData._id || fallbackShopId,
          slug: shopData.slug || shopSlug,
        });
      } else {
        console.error('API returned success: false', productsResponse.data);
        setFetchError(productsResponse.data.message || 'Failed to fetch products');
        setShop({
          name: 'Shop Details',
          contactNumber: 'Contact for details',
          shopId: null,
          slug: shopSlug,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchError(error.response?.data?.message || 'Error connecting to the server');
      setShop({
        name: 'Shop Details',
        contactNumber: 'Contact for details',
        shopId: null,
        slug: shopSlug,
      });
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  fetchShopAndProducts();
}, [shopSlug]);


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

const addToOrderSummary = (product, productsResponse) => {
  console.log("Raw product received:", product);

  setOrderItems((prevItems) => {
    const productId = product._id || product.id;
    const productName = product.name || product.productName;
    const productImage = product.image || product.imageUrl;

    console.log("Normalized product fields:", {
      productId,
      productName,
      productPrice: product.price,
      productImage,
    });

    const existingProduct = prevItems.find(
      (item) => item.productId === productId
    );

    // Only set shop if response is provided
    if (productsResponse?.shop) {
      const shopData = productsResponse.shop;
      const products = productsResponse.data || [];

      setShop({
        name: shopData.name || shopData.shopName,
        contactNumber: shopData.contactNumber || shopData.phoneNumber,
        shopId: shopData._id || (products.length > 0 ? products[0].shop : null),
        slug: shopData.slug,
      });

      console.log("Shop data set:", {
        name: shopData.name || shopData.shopName,
        shopId: shopData._id || (products.length > 0 ? products[0].shop : null),
        slug: shopData.slug,
      });
    }

    const newItem = {
      productId,
      name: productName,
      price: product.price,
      image: productImage,
      quantity: 1,
    };

    console.log("Adding new product to orderItems:", newItem);

    return [...prevItems, newItem];
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
    
    if (orderError) {
      setOrderError(null);
    }
  };

  const handlePlaceOrder = async () => {
    // Check authentication
    if (!token || !currentUser) {
      setOrderError('Please log in to place an order.');
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

    // Check if we have shop ID
    if (!shop?.shopId) {
      setOrderError('Shop information is missing. Please refresh the page.');
      return;
    }
  
    try {
      setIsLoading(true);
      setOrderError(null);
      
      const orderData = {
        shopId: shop.shopId,
        items: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: orderFormData.shippingAddress.trim(),
        contactNumber: orderFormData.contactNumber.trim(),
        userId: currentUser?.id || currentUser?._id || currentUser?.userId
      };
  
      console.log('Placing order with data:', orderData);
      console.log('Current user:', currentUser);
      
      const response = await axios.post(
        'https://moihub.onrender.com/api/eshop/orders/place',
        orderData,
        config
      );
  
      console.log('Order response:', response.data);
  
      if (response.data.success) {
        setOrderSuccess(true);
        setOrderItems([]);
        setShowOrderForm(false);
        setOrderFormData({
          shippingAddress: '',
          contactNumber: ''
        });
        
        setTimeout(() => {
          setOrderSuccess(false);
          setShowOrderSummary(false);
        }, 3000);
      } else {
        setOrderError(response.data.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || 'Unknown error';
        
        console.log('Error response:', error.response.data);
        
        if (statusCode === 401) {
          setOrderError('Your session has expired. Please refresh the page and log in again.');
        } else if (statusCode === 404) {
          setOrderError('Shop or products not found. The shop may be unavailable.');
        } else if (statusCode === 400) {
          setOrderError(errorMessage || 'Invalid order data. Please check your information.');
        } else {
          setOrderError(errorMessage || 'Failed to place order. Please try again.');
        }
      } else if (error.request) {
        setOrderError('Network error. Please check your connection and try again.');
      } else {
        setOrderError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{fetchError}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
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