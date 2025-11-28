import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './VendorPage.css';

const VendorPage = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [vendor, setVendor] = useState(null);
    const [foodListings, setFoodListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState({
        phone: '',
        instructions: ''
    });
    const [orderStep, setOrderStep] = useState('menu'); 
    const [orderStatus, setOrderStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [errors, setErrors] = useState({});
    const [displayedItems, setDisplayedItems] = useState(12);
    const [loadingMore, setLoadingMore] = useState(false);
    const itemsPerLoad = 12;

    const vendorFromState = location.state || {};
    const vendorName = vendorFromState.shopName || "Food Vendor";
    const vendorPhone = vendorFromState.phone || "";
    const vendorLocation = vendorFromState.location || "";
    const vendorDescription = vendorFromState.description || "Delicious food available";

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        const fetchFoodListings = async () => {
            try {
                const response = await fetch(
                    `https://moihub.onrender.com/api/food/listings/vendor/${vendorId}?limit=50`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch food listings');
                }
                
                const data = await response.json();
                console.log("API Response:", data);
                
                let listingsData = [];
                if (data.success && Array.isArray(data.listings)) {
                    listingsData = data.listings;
                } else {
                    if (Array.isArray(data)) {
                        listingsData = data;
                    } else if (data && Array.isArray(data.listings)) {
                        listingsData = data.listings;
                    } else if (data && data.success && Array.isArray(data.data)) {
                        listingsData = data.data;
                    }
                }
                
                const activeListings = listingsData.filter(listing => 
                    listing.isActive === undefined || listing.isActive === true
                );
                
                if (activeListings.length > 0 && activeListings[0].vendor && !vendorFromState.shopName) {
                    setVendor(activeListings[0].vendor);
                } else if (data && data.vendor && !vendorFromState.shopName) {
                    setVendor(data.vendor);
                }
                
                setFoodListings(activeListings);
                setLoading(false);
            } catch (err) {
                console.error("Food listings error:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchFoodListings();
    }, [vendorId, vendorFromState.shopName]);

    const handleScroll = useCallback(() => {
        if (loadingMore || displayedItems >= foodListings.length) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - (windowHeight * 0.2)) {
            setLoadingMore(true);
            setTimeout(() => {
                setDisplayedItems(prev => Math.min(prev + itemsPerLoad, foodListings.length));
                setLoadingMore(false);
            }, 500);
        }
    }, [displayedItems, foodListings.length, loadingMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        setDisplayedItems(12);
    }, [foodListings]);

    const addToCart = (listing) => {
        const existingItem = cart.find(item => item.listingId === listing._id);
        
        if (existingItem) {
            setCart(cart.map(item => 
                item.listingId === listing._id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            ));
        } else {
            setCart([...cart, {
                listingId: listing._id,
                name: listing.name,
                price: listing.price,
                imageURL: listing.imageURL,
                quantity: 1
            }]);
        }
        
        setShowCart(true);
    };

    const removeFromCart = (listingId) => {
        setCart(cart.filter(item => item.listingId !== listingId));
        
        if (cart.length <= 1) {
            setShowCart(false);
        }
    };

    const updateQuantity = (listingId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(listingId);
            return;
        }
        
        setCart(cart.map(item => 
            item.listingId === listingId 
                ? { ...item, quantity: newQuantity } 
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const validateDeliveryInfo = () => {
        const newErrors = {};
        
        if (!deliveryInfo.phone.trim()) {
            newErrors.phone = 'Phone number is required for delivery';
        } else if (!/^07\d{8}$/.test(deliveryInfo.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid Kenyan phone number (07XXXXXXXX)';
        }
        
        if (!deliveryInfo.instructions.trim()) {
            newErrors.instructions = 'Delivery instructions are required';
        } else if (deliveryInfo.instructions.trim().length < 10) {
            newErrors.instructions = 'Please provide more detailed delivery instructions';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setDeliveryInfo(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            setOrderStep('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setOrderStep('auth-required');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCallVendor = () => {
        const phoneNumber = vendorPhone || vendor?.phone || vendor?.contactNumber;
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Vendor phone number not available");
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateDeliveryInfo()) {
            alert('Please complete all delivery information correctly');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setOrderStep('auth-required');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const combinedDeliveryInfo = `PHONE: ${deliveryInfo.phone} | DELIVERY: ${deliveryInfo.instructions}`;

            const orderData = {
                items: cart.map(item => ({
                    listingId: item.listingId,
                    quantity: item.quantity
                })),
                vendorId: vendorId,
                deliveryInstructions: combinedDeliveryInfo
            };

            const response = await fetch('https://moihub.onrender.com/api/food/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (response.ok) {
                setOrderStatus('success');
                setOrderStep('confirmation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setOrderStatus('error');
                setError(data.message || 'Failed to place order');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Order error:", err);
            setOrderStatus('error');
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderAuthRequiredMessage = () => {
        return (
            <div className="auth-required-container">
                <div className="auth-card">
                    <div className="auth-icon">
                        <i className="fas fa-lock"></i>
                    </div>
                    <h2>Login Required</h2>
                    <p>You need to be logged in to place an order online.</p>
                    
                    <div className="auth-options">
                        <button className="login-button primary" onClick={() => navigate('/login')}>
                            <i className="fas fa-sign-in-alt"></i>
                            Login to Order
                        </button>
                        
                        <div className="option-divider">
                            <span>OR</span>
                        </div>
                        
                        <button className="call-vendor-button secondary" onClick={handleCallVendor}>
                            <i className="fas fa-phone"></i> 
                            Call {vendorName}
                        </button>
                    </div>
                    
                    <button 
                        className="back-to-menu-link" 
                        onClick={() => {
                            setOrderStep('menu');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <i className="fas fa-arrow-left"></i> Back to Menu
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading vendor menu...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="error-container">
                <i className="fas fa-exclamation-circle"></i>
                <p>Error: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const displayName = vendorName || vendor?.shopName || vendor?.name || "Food Vendor";
    const displayDescription = vendorDescription || vendor?.description || "Delicious food available";
    const displayLocation = vendorLocation || vendor?.location || "";
    const currentItems = foodListings.slice(0, displayedItems);

    return (
        <div className="vendor-page">
            {/* Header */}
            <header className="vendor-header">
                <div className="header-content">

                    <h1 className="vendor-name">{displayName}</h1>
                    <div className="header-actions">
                        <button className="call-button" onClick={handleCallVendor} aria-label="Call vendor">
                            <i className="fas fa-phone"></i>
                        </button>
                        <button className="cart-icon-button" onClick={() => setShowCart(!showCart)} aria-label="View cart">
                            <i className="fas fa-shopping-cart"></i>
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {/* Vendor Info Banner */}
            {/* <div className="vendor-banner">
                <div className="vendor-info">
                    <p className="vendor-description">{displayDescription}</p>
                    {displayLocation && (
                        <div className="vendor-meta">
                            <span className="location">
                                <i className="fas fa-map-marker-alt"></i> {displayLocation}
                            </span>
                            <span className="status-badge open">Open Now</span>
                        </div>
                    )}
                </div>
            </div> */}

            {/* Main Content */}
            <main className="vendor-main">
                {orderStep === 'menu' && (
                    <div className="menu-section">
                        <div className="menu-header">
                            <h2>Menu</h2>
                            <span className="item-count">{foodListings.length} items</span>
                        </div>
                        
                        {foodListings.length === 0 ? (
                            <div className="empty-menu">
                                <i className="fas fa-utensils"></i>
                                <p>No food items available at the moment.</p>
                            </div>
                        ) : (
                            <>
                                <div className="food-grid">
                                    {currentItems.map(food => (
                                        <article key={food._id} className="food-card">
                                            <div className="food-image">
                                                {food.imageURL ? (
                                                    <img src={food.imageURL} alt={food.name} loading="lazy" />
                                                ) : (
                                                    <div className="no-image">
                                                        <i className="fas fa-image"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="food-info">
                                                <h3 className="food-name">{food.name}</h3>
                                                <p className="food-description">{food.description || "No description available"}</p>
                                                <div className="food-footer">
                                                    <span className="food-price">KSh {food.price}</span>
                                                    <button 
                                                        className="add-button" 
                                                        onClick={() => addToCart(food)}
                                                        aria-label={`Add ${food.name} to cart`}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                        <span>Add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                                
                                {displayedItems < foodListings.length && (
                                    <div className="load-more-section">
                                        {loadingMore ? (
                                            <div className="loading-more">
                                                <div className="spinner"></div>
                                                <span>Loading more...</span>
                                            </div>
                                        ) : (
                                            <button 
                                                className="load-more-button"
                                                onClick={() => setDisplayedItems(prev => prev + itemsPerLoad)}
                                            >
                                                Load More
                                            </button>
                                        )}
                                    </div>
                                )}
                                
                                {displayedItems >= foodListings.length && foodListings.length > 0 && (
                                    <div className="end-message">
                                        <p>All {foodListings.length} items displayed</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {orderStep === 'auth-required' && renderAuthRequiredMessage()}

                {orderStep === 'checkout' && (
                    <div className="checkout-section">
                        <h2>Checkout</h2>
                        
                        <div className="order-summary-card">
                            <h3>Order Summary</h3>
                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.listingId} className="checkout-item">
                                        <img src={item.imageURL || '/placeholder.jpg'} alt={item.name} className="item-thumbnail" />
                                        <div className="item-info">
                                            <h4>{item.name}</h4>
                                            <p className="item-price">KSh {item.price} × {item.quantity}</p>
                                        </div>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)} aria-label="Decrease">
                                                <i className="fas fa-minus"></i>
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)} aria-label="Increase">
                                                <i className="fas fa-plus"></i>
                                            </button>
                                        </div>
                                        <span className="item-total">KSh {item.price * item.quantity}</span>
                                        <button 
                                            className="remove-item" 
                                            onClick={() => removeFromCart(item.listingId)}
                                            aria-label="Remove item"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>Total</span>
                                <span className="total-amount">KSh {calculateTotal()}</span>
                            </div>
                        </div>
                        
                        <div className="delivery-form">
                            <h3>Delivery Details</h3>
                            
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className={`form-input ${errors.phone ? 'error' : ''}`}
                                    placeholder="07XX XXX XXX"
                                    value={deliveryInfo.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="instructions">Delivery Address *</label>
                                <textarea
                                    id="instructions"
                                    className={`form-textarea ${errors.instructions ? 'error' : ''}`}
                                    placeholder="Building, floor, landmarks, special instructions..."
                                    value={deliveryInfo.instructions}
                                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                                    rows="4"
                                />
                                {errors.instructions && <span className="error-message">{errors.instructions}</span>}
                            </div>
                        </div>
                        
                        <div className="checkout-actions">
                            <button 
                                className="btn-secondary" 
                                onClick={() => {
                                    setOrderStep('menu');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                Back to Menu
                            </button>
                            <button className="btn-primary" onClick={handlePlaceOrder}>
                                Place Order · KSh {calculateTotal()}
                            </button>
                        </div>
                    </div>
                )}

                {orderStep === 'confirmation' && (
                    <div className="confirmation-section">
                        {orderStatus === 'error' ? (
                            <div className="error-state">
                                <i className="fas fa-exclamation-circle"></i>
                                <h2>Order Failed</h2>
                                <p>{error || 'There was a problem processing your order.'}</p>
                                <button className="btn-primary" onClick={() => setOrderStep('checkout')}>Try Again</button>
                            </div>
                        ) : (
                            <div className="success-state">
                                <div className="success-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <h2>Order Placed!</h2>
                                <p>Thank you for your order from {displayName}</p>

                                <div className="confirmation-actions">
                                    <button className="btn-secondary" onClick={() => navigate('/')}>
                                        Go Home
                                    </button>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => {
                                            setOrderStep('menu');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    >
                                        Order More
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating Cart */}
            {cart.length > 0 && orderStep === 'menu' && (
                <button 
                    className="floating-cart" 
                    onClick={() => setShowCart(true)}
                    aria-label="View cart"
                >
                    <i className="fas fa-shopping-cart"></i>
                    <div className="cart-info">
                        <span className="cart-count">{cart.length} items</span>
                        <span className="cart-total">KSh {calculateTotal()}</span>
                    </div>
                </button>
            )}

            {/* Cart Drawer */}
            {showCart && orderStep === 'menu' && (
                <>
                    <div className="cart-overlay" onClick={() => setShowCart(false)}></div>
                    <aside className="cart-drawer">
                        <div className="drawer-header">
                            <h3>Your Cart</h3>
                            <button className="close-drawer" onClick={() => setShowCart(false)} aria-label="Close">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="drawer-content">
                            {cart.length === 0 ? (
                                <div className="empty-cart">
                                    <i className="fas fa-shopping-cart"></i>
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                <>
                                    <div className="drawer-items">
                                        {cart.map(item => (
                                            <div key={item.listingId} className="drawer-item">
                                                <img src={item.imageURL || '/placeholder.jpg'} alt={item.name} />
                                                <div className="item-details">
                                                    <h4>{item.name}</h4>
                                                    <div className="item-controls">
                                                        <div className="qty-controls">
                                                            <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)}>
                                                                <i className="fas fa-minus"></i>
                                                            </button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)}>
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </div>
                                                        <span className="item-price">KSh {item.price * item.quantity}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    className="remove-btn" 
                                                    onClick={() => removeFromCart(item.listingId)}
                                                    aria-label="Remove"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="drawer-footer">
                                        <div className="drawer-total">
                                            <span>Total</span>
                                            <span>KSh {calculateTotal()}</span>
                                        </div>
                                        <button 
                                            className="checkout-btn" 
                                            onClick={() => {
                                                handleCheckout();
                                                setShowCart(false);
                                            }}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </aside>
                </>
            )}
        </div>
    );
};

export default VendorPage;