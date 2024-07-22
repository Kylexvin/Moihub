import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductList.css'; // Import CSS for styling
import ShopSkeleton from './ShopSkeleton';

const ProductList = ({ shops }) => {
  const { shopId } = useParams();
  const shop = shops.find((s) => s.id === shopId);

  // State for showing additional information
  const [showInfo, setShowInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  // Function to toggle additional information
  const toggleInfo = (productId) => {
    setShowInfo((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  // Function to handle order
  const handleOrderLink = (product) => {
    const message = `Hello, I would like to order the following item:\n\nProduct: ${product.name}\nPrice: Ksh ${product.price}\n\nThank you!`;
    const phoneNumber = shop.phone; // Ensure this number is in the correct format with country code
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    // Simulate loading delay
    const delay = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clear timeout on unmount to avoid memory leaks
    return () => clearTimeout(delay);
  }, []); // Runs only on mount

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page when currentPage changes
  }, []);

  if (isLoading) {
    return <ShopSkeleton />;
  }

  return (
    <>
      <div className="product-list-container">
        {shop ? (
          <div className="product-list">
            {/* Render shop info */}
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
                {/* Render products */}
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

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

export default ProductList;