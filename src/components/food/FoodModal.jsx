import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './FoodModal.css';

const FoodModal = ({ vendorId, vendorName, onClose }) => {
    const [foodListings, setFoodListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [orderStep, setOrderStep] = useState('menu'); // menu, checkout, confirmation, orders
    const [orderStatus, setOrderStatus] = useState(null);
    const [userOrders, setUserOrders] = useState([]);

    useEffect(() => {
        const fetchFoodListings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/food/listings/vendor/${vendorId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch food listings');
                }
                
                const data = await response.json();
                console.log("Food listings response:", data);
                
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
                
                const activeListings = listingsData.filter(listing => 
                    listing.isActive === undefined || listing.isActive === true
                );
                
                setFoodListings(activeListings);
                setLoading(false);
            } catch (err) {
                console.error("Food listings error:", err);
                setError(err.message);
                setLoading(false);
                
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Load Menu',
                    text: err.message,
                    confirmButtonColor: '#FF5722'
                });
            }
        };
        
        fetchFoodListings();
    }, [vendorId]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/food/orders/user', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            setUserOrders(Array.isArray(data) ? data : data.orders || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setLoading(false);
            
            Swal.fire({
                icon: 'error',
                title: 'Could not load orders',
                text: 'Please check your connection and try again',
                confirmButtonColor: '#FF5722'
            });
        }
    };

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

        // Sweet success notification
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart!',
            text: `${listing.name} has been added to your order`,
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            timerProgressBar: true
        });
    };

    const removeFromCart = (listingId, itemName) => {
        Swal.fire({
            title: 'Remove Item?',
            text: `Are you sure you want to remove ${itemName} from your cart?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF5722',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                setCart(cart.filter(item => item.listingId !== listingId));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    text: `${itemName} has been removed from your cart`,
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        });
    };

    const updateQuantity = (listingId, newQuantity) => {
        if (newQuantity < 1) {
            const item = cart.find(item => item.listingId === listingId);
            removeFromCart(listingId, item?.name);
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
        if (cart.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Cart',
                text: 'Please add some items to your cart before proceeding',
                confirmButtonColor: '#FF5722'
            });
            return;
        }
        setOrderStep('checkout');
    };

    const handlePlaceOrder = async () => {
        if (!deliveryInstructions.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Delivery Instructions Required',
                text: 'Please provide delivery instructions to complete your order',
                confirmButtonColor: '#FF5722'
            });
            return;
        }

        // Show loading while processing
        Swal.fire({
            title: 'Processing Order...',
            text: 'Please wait while we process your order',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const orderData = {
                items: cart.map(item => ({
                    listingId: item.listingId,
                    quantity: item.quantity
                })),
                vendorId: vendorId,
                deliveryInstructions: deliveryInstructions
            };

            console.log("Submitting order:", orderData);

            const response = await fetch('http://localhost:5000/api/food/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log("Order response:", data);
            
            Swal.close(); // Close loading alert
            
            if (response.ok) {
                setOrderStatus('success');
                setOrderStep('confirmation');
                setCart([]); // Clear cart
                setDeliveryInstructions(''); // Clear instructions
                
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed Successfully!',
                    text: `Your order from ${vendorName} has been placed and will be delivered soon.`,
                    confirmButtonColor: '#4CAF50',
                    confirmButtonText: 'Great!'
                });
            } else {
                setOrderStatus('error');
                setError(data.message || 'Failed to place order');
                
                Swal.fire({
                    icon: 'error',
                    title: 'Order Failed',
                    text: data.message || 'There was a problem processing your order. Please try again.',
                    confirmButtonColor: '#FF5722'
                });
            }
        } catch (err) {
            console.error("Order error:", err);
            setOrderStatus('error');
            setError(err.message);
            
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Unable to place order. Please check your internet connection and try again.',
                confirmButtonColor: '#FF5722'
            });
        }
    };

    const handleCloseModal = () => {
        if (cart.length > 0) {
            Swal.fire({
                title: 'Leave without ordering?',
                text: "You have items in your cart. Are you sure you want to leave?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FF5722',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, leave',
                cancelButtonText: 'Stay'
            }).then((result) => {
                if (result.isConfirmed) {
                    onClose();
                }
            });
        } else {
            onClose();
        }
    };

    const renderOrderSteps = () => {
        const steps = [
            { key: 'menu', label: 'Menu', icon: '🍽️' },
            { key: 'checkout', label: 'Checkout', icon: '🛒' },
            { key: 'confirmation', label: 'Complete', icon: '✅' }
        ];
        
        return (
            <div className="order-progress">
                {steps.map((step, index) => (
                    <div key={step.key} className={`step ${orderStep === step.key ? 'active' : ''} ${steps.findIndex(s => s.key === orderStep) > index ? 'completed' : ''}`}>
                        <span className="step-icon">{step.icon}</span>
                        <span className="step-label">{step.label}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderMenuStep = () => {
        if (loading) return <div className="loading-spinner">Loading menu...</div>;
        if (error) return <div className="error-message">Error: {error}</div>;

        return (
            <>
                {renderOrderSteps()}
                <div className="food-listings">
                    <div className="menu-header">
                        <h2>{vendorName}'s Menu</h2>
                        <p className="menu-subtitle">Choose your favorite dishes</p>
                    </div>
                    
                    {foodListings.length === 0 ? (
                        <div className="no-food">
                            <p>No food items available at the moment.</p>
                            <p>Please check back later!</p>
                        </div>
                    ) : (
                        <div className="food-grid">
                            {foodListings.map(food => {
                                const cartItem = cart.find(item => item.listingId === food._id);
                                
                                return (
                                    <div key={food._id} className="food-card">
                                        <div className="food-image">
                                            {food.imageURL ? (
                                                <img src={food.imageURL} alt={food.name} />
                                            ) : (
                                                <div className="no-image">
                                                    <span>🍽️</span>
                                                </div>
                                            )}
                                            {cartItem && (
                                                <div className="cart-badge">
                                                    {cartItem.quantity}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="food-details">
                                            <h3>{food.name}</h3>
                                            <p className="food-description">
                                                {food.description || "Delicious food item"}
                                            </p>
                                            <p className="food-price">KSh {food.price}</p>
                                            
                                            {cartItem ? (
                                                <div className="quantity-controls-inline">
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(food._id, cartItem.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="qty-display">{cartItem.quantity}</span>
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(food._id, cartItem.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    className="add-to-cart" 
                                                    onClick={() => addToCart(food)}
                                                >
                                                    Add to Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Floating Cart Indicator */}
                {cart.length > 0 && (
                    <div className="floating-cart-indicator">
                        <div className="cart-badge-float">
                            <span className="item-count">
                                {cart.reduce((total, item) => total + item.quantity, 0)}
                            </span>
                            <span className="cart-text">Cart • KSh {calculateTotal()}</span>
                        </div>
                        <button className="view-cart-btn" onClick={handleCheckout}>
                            View Cart & Checkout →
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderCheckoutStep = () => {
        return (
            <div className="checkout-container">
                {renderOrderSteps()}
                
                <div className="checkout-header">
                    <h2>Review Your Order</h2>
                    <p>Almost there! Review your items and provide delivery details.</p>
                </div>
                
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    {cart.map(item => (
                        <div key={item.listingId} className="cart-item">
                            <div className="item-image">
                                {item.imageURL ? (
                                    <img src={item.imageURL} alt={item.name} />
                                ) : (
                                    <div className="no-image-small">🍽️</div>
                                )}
                            </div>
                            <div className="item-details">
                                <h4>{item.name}</h4>
                                <p>KSh {item.price} × {item.quantity} = KSh {item.price * item.quantity}</p>
                            </div>
                            <div className="quantity-controls">
                                <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)}>−</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)}>+</button>
                            </div>
                            <button 
                                className="remove-item" 
                                onClick={() => removeFromCart(item.listingId, item.name)}
                                title="Remove item"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                    
                    <div className="total-amount">
                        <h3>Total Amount: KSh {calculateTotal()}</h3>
                    </div>
                </div>
                
                <div className="delivery-info">
                    <h3>Delivery Information</h3>
                    <textarea
                        className="delivery-textarea"
                        placeholder="Enter delivery instructions (e.g., Hostel Block C, Room 122, Call 0700000000)"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        rows="4"
                        required
                    />
                </div>
                
                <div className="action-buttons">
                    <button className="back-button" onClick={() => setOrderStep('menu')}>
                        ← Back to Menu
                    </button>
                    <button className="place-order-button" onClick={handlePlaceOrder}>
                        Place Order • KSh {calculateTotal()}
                    </button>
                </div>
            </div>
        );
    };

    const renderOrdersStep = () => {
        if (loading) return <div className="loading-spinner">Loading your orders...</div>;
        
        return (
            <div className="orders-container">
                <div className="orders-header">
                    <h2>My Orders</h2>
                    <p>Track your recent orders from {vendorName}</p>
                </div>
                
                {userOrders.length === 0 ? (
                    <div className="no-orders">
                        <p>You haven't placed any orders yet.</p>
                        <button onClick={() => setOrderStep('menu')}>Browse Menu</button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {userOrders.map(order => (
                            <div key={order._id} className="order-card">
                                <div className="order-header">
                                    <h4>Order #{order._id?.slice(-6)}</h4>
                                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                                </div>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                                <p className="order-total">KSh {order.totalAmount}</p>
                            </div>
                        ))}
                    </div>
                )}
                
                <button className="back-button" onClick={() => setOrderStep('menu')}>
                    ← Back to Menu
                </button>
            </div>
        );
    };

    const renderConfirmationStep = () => {
        return (
            <div className="order-confirmation">
                <div className="success-animation">
                    <div className="checkmark">✓</div>
                </div>
                
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your order from <strong>{vendorName}</strong>.</p>
                <p>Your delicious meal will be delivered according to your instructions:</p>
                <div className="delivery-note">
                    <strong>Delivery Instructions:</strong>
                    <p>{deliveryInstructions}</p>
                </div>
                
                <div className="confirmation-actions">
                    <button className="primary-button" onClick={onClose}>
                        Done
                    </button>
                    <button className="secondary-button" onClick={() => setOrderStep('orders')}>
                        View My Orders
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (orderStep) {
            case 'menu':
                return renderMenuStep();
            case 'checkout':
                return renderCheckoutStep();
            case 'confirmation':
                return renderConfirmationStep();
            case 'orders':
                return renderOrdersStep();
            default:
                return renderMenuStep();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Enhanced Header */}
                <div className="modal-header">
                    <button className="back-arrow" onClick={handleCloseModal}>
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h1 className="vendor-name-prominent">{vendorName}</h1>
                    <div className="header-actions">
                        <button 
                            className="my-orders-btn"
                            onClick={() => {
                                setOrderStep('orders');
                                fetchUserOrders();
                            }}
                            title="My Orders"
                        >
                            📋
                        </button>
                        <button className="close-modal" onClick={handleCloseModal}>
                            ×
                        </button>
                    </div>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
};

export default FoodModal;