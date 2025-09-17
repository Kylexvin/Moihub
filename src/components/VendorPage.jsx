import React, { useState, useEffect } from 'react';
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
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [orderStep, setOrderStep] = useState('menu'); 
    const [orderStatus, setOrderStatus] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showCart, setShowCart] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of food items per page

    // Get vendor info from navigation state (passed from MoiDelish component)
    const vendorFromState = location.state || {};
    const vendorName = vendorFromState.shopName || "Food Vendor";
    const vendorPhone = vendorFromState.phone || "";
    const vendorLocation = vendorFromState.location || "";
    const vendorDescription = vendorFromState.description || "Delicious food available";

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    // We only need to fetch food listings, as that provides vendor info too
    useEffect(() => {
        const fetchFoodListings = async () => {
            try {
                const response = await fetch(`https://moihub.onrender.com/api/food/listings/vendor/${vendorId}`);
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
                
                // Set vendor info from API response if not available from state
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

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = foodListings.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(foodListings.length / itemsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of page when pagination changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
        
        // Show cart when adding an item
        setShowCart(true);
    };

    const removeFromCart = (listingId) => {
        setCart(cart.filter(item => item.listingId !== listingId));
        
        // Hide cart if empty
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

    const handleCheckout = () => {
        if (isAuthenticated) {
            setOrderStep('checkout');
            // Scroll to top when entering checkout
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Show auth required message
            setOrderStep('auth-required');
            // Scroll to top for auth message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCallVendor = () => {
        // Use phone from state first, then fallback to vendor object
        const phoneNumber = vendorPhone || vendor?.phone || vendor?.contactNumber;
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                setCart([]);
                setShowCart(false);
                // Scroll to top for confirmation
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setOrderStatus('error');
                setError(data.message || 'Failed to place order');
                // Scroll to top to show error
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Order error:", err);
            setOrderStatus('error');
            setError(err.message);
            // Scroll to top to show error
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                <button 
                    className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <i className="fas fa-chevron-left"></i>
                </button>
                
                {startPage > 1 && (
                    <>
                        <button 
                            className="pagination-btn" 
                            onClick={() => paginate(1)}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                    </>
                )}
                
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                        onClick={() => paginate(number)}
                    >
                        {number}
                    </button>
                ))}
                
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                        <button 
                            className="pagination-btn" 
                            onClick={() => paginate(totalPages)}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
                
                <button 
                    className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>
        );
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
                                Call {vendorName}
                            </button>
                        </div>
                    </div>
                    
                    <div className="auth-actions">
                        <button className="login-button" onClick={() => navigate('/login')}>
                            Login to Order
                        </button>
                        <button 
                            className="back-to-menu" 
                            onClick={() => {
                                setOrderStep('menu');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading-container">Loading vendor menu...</div>;
    if (error) return <div className="error-container">Error: {error}</div>;

    // Use vendor info from state if available, otherwise fallback to API response
    const displayName = vendorName || vendor?.shopName || vendor?.name || "Food Vendor";
    const displayDescription = vendorDescription || vendor?.description || "Delicious food available";
    const displayLocation = vendorLocation || vendor?.location || "";

    return (
        <div className="vendor-page">
            {/* Fixed Header with Shop Name */}
            <div className="app-header">
                <div className="header-content">
                    <h1 className="shop-name">{displayName}</h1>
                    <div className="header-actions">
                        <button 
                            className="call-button icon-button"
                            onClick={handleCallVendor}
                            aria-label="Call vendor"
                        >
                            <i className="fas fa-phone"></i>
                        </button>
                        <button 
                            className="cart-button icon-button"
                            onClick={() => setShowCart(!showCart)}
                            aria-label="View cart"
                        >
                            <i className="fas fa-shopping-cart"></i>
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="vendor-content">
                {/* Menu Section */}
                <div className="menu-section">
                    {orderStep === 'menu' && (
                        <>
                            <div className="vendor-info-card">
                                <p className="vendor-description">{displayDescription}</p>
                                {displayLocation && (
                                    <div className="vendor-location">
                                        <i className="fas fa-map-marker-alt"></i> {displayLocation}
                                        <span className="vendor-status open">Open</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="menu-header">
                                <h2>Menu</h2>
                                {foodListings.length > itemsPerPage && (
                                    <div className="menu-info">
                                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, foodListings.length)} of {foodListings.length} items
                                    </div>
                                )}
                            </div>
                            
                            {foodListings.length === 0 ? (
                                <p className="no-food">No food items available at the moment.</p>
                            ) : (
                                <>
                                    <div className="food-grid">
                                        {currentItems.map(food => (
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
                                                    <div className="food-card-footer">
                                                        <p className="food-price">KSh {food.price}</p>
                                                        <button className="add-to-cart" onClick={() => addToCart(food)}>
                                                            <i className="fas fa-plus"></i> Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Pagination */}
                                    {renderPagination()}
                                </>
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
                                <div className="order-total">
                                    <strong>Total: KSh {calculateTotal()}</strong>
                                </div>
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
                                <button 
                                    className="back-button" 
                                    onClick={() => {
                                        setOrderStep('menu');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                >
                                    Back to Menu
                                </button>
                                <button className="place-order-button" onClick={handlePlaceOrder}>
                                    Place Order - KSh {calculateTotal()}
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
                                    <p>Thank you for your order from {displayName}.</p>
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

                {/* Floating Cart Button - Always visible */}
                {cart.length > 0 && orderStep === 'menu' && (
                    <div className="floating-cart-button" onClick={() => setShowCart(true)}>
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-count">{cart.length}</span>
                        <span className="cart-total">KSh {calculateTotal()}</span>
                    </div>
                )}

                {/* Cart Drawer - Slides in from bottom */}
                {showCart && orderStep === 'menu' && (
                    <div className="cart-drawer">
                        <div className="drawer-header">
                            <h3>Your Order</h3>
                            <button className="close-drawer" onClick={() => setShowCart(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div className="drawer-content">
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
                                        <button 
                                            className="checkout-button" 
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorPage;