import React, { useState, useEffect } from 'react';
import './FoodModal.css';

const FoodModal = ({ vendorId, vendorName, onClose }) => {
    const [foodListings, setFoodListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const [deliveryInstructions, setDeliveryInstructions] = useState('');
    const [orderStep, setOrderStep] = useState('menu'); // menu, checkout, confirmation
    const [orderStatus, setOrderStatus] = useState(null);

    useEffect(() => {
        const fetchFoodListings = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/food/listings/vendor/${vendorId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch food listings');
                }
                
                const data = await response.json();
                console.log("Food listings response:", data); // For debugging
                
                // Handle different response structures
                let listingsData = [];
                if (Array.isArray(data)) {
                    listingsData = data; // Direct array of listings
                } else if (data && Array.isArray(data.listings)) {
                    listingsData = data.listings; // { listings: [...] }
                } else if (data && data.success && Array.isArray(data.data)) {
                    listingsData = data.data; // { success: true, data: [...] }
                } else {
                    // Try to find any array in the response
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            listingsData = data[key];
                            break;
                        }
                    }
                }
                
                // Filter active listings if the isActive field exists
                const activeListings = listingsData.filter(listing => 
                    listing.isActive === undefined || listing.isActive === true
                );
                
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
        setOrderStep('checkout');
    };

    const handlePlaceOrder = async () => {
        if (!deliveryInstructions.trim()) {
            alert('Please provide delivery instructions');
            return;
        }

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
                    // Include authorization header if needed
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            console.log("Order response:", data);
            
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

    const renderMenuStep = () => {
        if (loading) return <div className="loading-spinner">Loading menu...</div>;
        if (error) return <div className="error-message">Error: {error}</div>;

        return (
            <div className="food-listings">
                <h2>{vendorName}'s Menu</h2>
                
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
                
                {cart.length > 0 && (
                    <div className="cart-summary">
                        <h3>Your Order ({cart.reduce((total, item) => total + item.quantity, 0)} items)</h3>
                        <p className="cart-total">Total: KSh {calculateTotal()}</p>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderCheckoutStep = () => {
        return (
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
                    
                    <div className="total-amount">
                        <h3>Total Amount: KSh {calculateTotal()}</h3>
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
                    <button className="back-button" onClick={() => setOrderStep('menu')}>
                        Back to Menu
                    </button>
                    <button className="place-order-button" onClick={handlePlaceOrder}>
                        Place Order
                    </button>
                </div>
            </div>
        );
    };

    const renderConfirmationStep = () => {
        if (orderStatus === 'error') {
            return (
                <div className="order-error">
                    <h2>Order Failed</h2>
                    <p>{error || 'There was a problem processing your order. Please try again.'}</p>
                    <button onClick={() => setOrderStep('checkout')}>Try Again</button>
                </div>
            );
        }

        return (
            <div className="order-confirmation">
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your order from {vendorName}.</p>
                <p>Your order will be delivered according to your instructions:</p>
                <p className="delivery-note">{deliveryInstructions}</p>
                
                <div className="confirmation-actions">
                    <button onClick={onClose}>Close</button>
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
            default:
                return renderMenuStep();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-modal" onClick={onClose}>&times;</button>
                {renderContent()}
            </div>
        </div>
    );
};

export default FoodModal;