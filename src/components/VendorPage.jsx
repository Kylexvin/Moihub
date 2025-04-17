import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VendorPage.css';

const VendorPage = () => {
    const { vendorId } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState(null);
    const [foodListings, setFoodListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [orderStep, setOrderStep] = useState('menu'); // menu, checkout, confirmation
    const [orderStatus, setOrderStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    // We only need to fetch food listings, as that provides vendor info too
    useEffect(() => {
        const fetchFoodListings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/food/listings/vendor/${vendorId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch food listings');
                }
                
                const data = await response.json();
                console.log("API Response:", data); // For debugging
                
                // Handle different response structures
                let listingsData = [];
                if (Array.isArray(data)) {
                    listingsData = data;
                } else if (data && Array.isArray(data.listings)) {
                    listingsData = data.listings;
                } else if (data && data.success && Array.isArray(data.data)) {
                    listingsData = data.data;
                } else {
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            listingsData = data[key];
                            break;
                        }
                    }
                }
                
                // Filter active listings
                const activeListings = listingsData.filter(listing => 
                    listing.isActive === undefined || listing.isActive === true
                );
                
                // Attempt to get vendor info from the first listing
                if (activeListings.length > 0 && activeListings[0].vendor) {
                    setVendor(activeListings[0].vendor);
                } else {
                    // Fallback: try to get vendor info from another source in the response
                    if (data && data.vendor) {
                        setVendor(data.vendor);
                    }
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
    }, [vendorId]);

    // Cart management functions
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
    };

    const removeFromCart = (listingId) => {
        setCart(cart.filter(item => item.listingId !== listingId));
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

    const handleCheckout = () => {
        if (isAuthenticated) {
            setOrderStep('checkout');
        } else {
            // Show auth required message
            setOrderStep('auth-required');
        }
    };

    const handleCallVendor = () => {
        const phoneNumber = vendor?.phone || vendor?.contactNumber;
        if (phoneNumber) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            alert("Vendor phone number not available");
        }
    };

    const handlePlaceOrder = async () => {
        if (!deliveryInstructions.trim()) {
            alert('Please provide delivery instructions');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setOrderStep('auth-required');
                return;
            }

            const orderData = {
                items: cart.map(item => ({
                    listingId: item.listingId,
                    quantity: item.quantity
                })),
                vendorId: vendorId,
                deliveryInstructions: deliveryInstructions
            };

            const response = await fetch('http://localhost:5000/api/food/orders', {
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
            } else {
                setOrderStatus('error');
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            console.error("Order error:", err);
            setOrderStatus('error');
            setError(err.message);
        }
    };

    const renderAuthRequiredMessage = () => {
        return (
            <div className="auth-required-container">
                <div className="auth-card">
                    <h2>Login Required</h2>
                    <p>You need to be logged in to place an order online.</p>
                    
                    <div className="auth-options">
                        <div className="option-divider">
                            <span>OR</span>
                        </div>
                        
                        <div className="call-option">
                            <h3>Order by Phone</h3>
                            <p>Call the vendor directly to place your order:</p>
                            <button 
                                className="call-vendor-button"
                                onClick={handleCallVendor}
                            >
                                <i className="fas fa-phone"></i> 
                                Call {vendor?.shopName || "Vendor"}
                            </button>
                        </div>
                    </div>
                    
                    <div className="auth-actions">
                        <button className="login-button" onClick={() => navigate('/login')}>
                            Login to Order
                        </button>
                        <button className="back-to-menu" onClick={() => setOrderStep('menu')}>
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading-container">Loading vendor menu...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    const vendorName = vendor?.shopName || vendor?.name || "Food Vendor";
    const vendorDescription = vendor?.description || "Delicious food available";
    const vendorLocation = vendor?.location || "";
    const vendorPhone = vendor?.phone || vendor?.contactNumber || "";

    return (
        <div className="vendor-page">
            {/* Vendor Header */}
            <div className="vendor-header">
                <div className="back-button" onClick={() => navigate(-1)}>
                    <i className="fas fa-arrow-left"></i> Back to Vendors
                </div>
                <div className="vendor-info">
                    <h1>{vendorName}</h1>
                    <p className="vendor-description">{vendorDescription}</p>
                    {vendorLocation && (
                        <div className="vendor-location">
                            <i className="fas fa-map-marker-alt"></i> {vendorLocation}
                            <span className="vendor-status open">Open</span>
                        </div>
                    )}
                </div>
                <div className="vendor-actions">
                    <button 
                        className="call-button"
                        onClick={handleCallVendor}
                    >
                        <i className="fas fa-phone"></i> Call Vendor
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="vendor-content">
                {/* Menu Section */}
                <div className="menu-section">
                    {orderStep === 'menu' && (
                        <>
                            <h2>Menu</h2>
                            {foodListings.length === 0 ? (
                                <p className="no-food">No food items available at the moment.</p>
                            ) : (
                                <div className="food-grid">
                                    {foodListings.map(food => (
                                        <div key={food._id} className="food-card">
                                            <div className="food-image">
                                                {food.imageURL ? (
                                                    <img src={food.imageURL} alt={food.name} />
                                                ) : (
                                                    <div className="no-image">No Image</div>
                                                )}
                                            </div>
                                            <div className="food-details">
                                                <h3>{food.name}</h3>
                                                <p className="food-description">{food.description || "No description available"}</p>
                                                <p className="food-price">KSh {food.price}</p>
                                                <button className="add-to-cart" onClick={() => addToCart(food)}>
                                                    Add to Order
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* Auth Required Section */}
                    {orderStep === 'auth-required' && renderAuthRequiredMessage()}

                    {/* Checkout Section */}
                    {orderStep === 'checkout' && (
                        <div className="checkout-container">
                            <h2>Checkout</h2>
                            
                            <div className="order-summary">
                                <h3>Order Summary</h3>
                                {cart.map(item => (
                                    <div key={item.listingId} className="cart-item">
                                        <div className="item-image">
                                            {item.imageURL ? (
                                                <img src={item.imageURL} alt={item.name} />
                                            ) : (
                                                <div className="no-image">No Image</div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <h4>{item.name}</h4>
                                            <p>KSh {item.price} x {item.quantity} = KSh {item.price * item.quantity}</p>
                                        </div>
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="remove-item" onClick={() => removeFromCart(item.listingId)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="delivery-info">
                                <h3>Delivery Information</h3>
                                <textarea
                                    placeholder="Enter delivery instructions (e.g., Hostel Block C, Room 122, Call 0700000000)"
                                    value={deliveryInstructions}
                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="action-buttons">
                                <button className="back-button" onClick={() => setOrderStep('menu')}>
                                    Back to Menu
                                </button>
                                <button className="place-order-button" onClick={handlePlaceOrder}>
                                    Place Order
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Section */}
                    {orderStep === 'confirmation' && (
                        <div className="order-confirmation">
                            {orderStatus === 'error' ? (
                                <>
                                    <h2>Order Failed</h2>
                                    <p>{error || 'There was a problem processing your order. Please try again.'}</p>
                                    <button onClick={() => setOrderStep('checkout')}>Try Again</button>
                                </>
                            ) : (
                                <>
                                    <h2>Order Placed Successfully!</h2>
                                    <p>Thank you for your order from {vendorName}.</p>
                                    <p>Your order will be delivered according to your instructions:</p>
                                    <p className="delivery-note">{deliveryInstructions}</p>
                                    
                                    <div className="confirmation-actions">
                                        <button onClick={() => navigate('/')}>Return to Home</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Cart Sidebar - Only visible during menu browsing */}
                {orderStep === 'menu' && (
                    <div className={`cart-sidebar ${cart.length > 0 ? 'has-items' : ''}`}>
                        <h3>Your Order</h3>
                        {cart.length === 0 ? (
                            <p className="empty-cart">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item.listingId} className="sidebar-cart-item">
                                            <div className="item-name-qty">
                                                <span className="item-name">{item.name}</span>
                                                <div className="item-qty-control">
                                                    <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)}>+</button>
                                                </div>
                                            </div>
                                            <div className="item-price">
                                                KSh {item.price * item.quantity}
                                                <button className="remove-btn" onClick={() => removeFromCart(item.listingId)}>✕</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-footer">
                                    <div className="cart-total">
                                        <span>Total</span>
                                        <span>KSh {calculateTotal()}</span>
                                    </div>
                                    <button className="checkout-button" onClick={handleCheckout}>
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorPage;