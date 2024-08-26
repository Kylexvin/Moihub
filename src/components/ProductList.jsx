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
      const existingProduct = prevItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromOrderSummary = (productId) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const toggleOrderSummary = () => {
    setShowOrderSummary(prevState => !prevState);
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePlaceOrder = () => {
    const cartItems = orderItems.map(item => 
      `${item.name} x${item.quantity} - Ksh ${item.price * item.quantity}`
    ).join('\n');
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

  if (isLoading) {
    return <ShopSkeleton />;
  }

  return (
    <>
      <div className="product-list-container">
        {shop ? (
          <div className="product-list">
            <div className="shop-info">
              <div className="shop-name">
                {shop.name}
              </div>
              <div className='shop-location'>
                <div className='location'>
                  {shop.location} <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className='phone'>
                  {shop.phone} <i className="fas fa-phone"></i>
                </div>
              </div>
            </div>
            {shop.products.length > 0 ? (
              <div className="card-container">
                {shop.products.map((product) => (
                  <div className="mini-card" key={product.id}>
                    <div className="img-container" id={`product${product.id}`}>
                      <img className="item-photo" src={product.image} alt={`Product ${product.id}`}/>
                    </div>

                    <div className="item-container">
                      <h2 className="item-name">{product.name}</h2>

                      <div className="price-container">
                        <p className="item-price"><i className="fas fa-tag"></i> Ksh {product.price}</p>
                      </div>

                      <div className="button-container">
                        <button className="button-n" onClick={() => toggleInfo(product.id)}>Info <i className="fas fa-info-circle"></i></button>
                        <button className="button-n" onClick={() => handleOrderLink(product)}>Order <i className="fab fa-whatsapp"></i></button>
                        <button className="button-n" onClick={() => addToOrderSummary(product)}>Add <i className="fas fa-plus-circle"></i></button>
                      </div>

                      {showInfo[product.id] && <div className="extra-info">
                        <p>{product.info}</p>
                      </div>}
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

      <div className="order-summary-container" onClick={(e) => {
        e.stopPropagation();
        toggleOrderSummary();
      }}>
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
                  <button className="remove-item" onClick={() => removeFromOrderSummary(item.id)}>×</button>
                </div>
              ))}
              <div className="order-total">
                <strong>Total: Ksh {getTotalPrice()}</strong>
              </div>
              <div className="button-container">
                <button className="place-order-button" onClick={toggleOrderSummary}>Close</button>
                <button className="place-order-button" onClick={handlePlaceOrder}>Order</button>
              </div>
            </>
          ) : (
            <p>Your order summary is empty</p>
          )}
        </div>
      )}

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

export default ProductList;