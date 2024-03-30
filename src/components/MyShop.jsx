import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './myshop.css';
import NotFoundPage from './NotFoundPage';
import ShopSkeleton from './ShopSkeleton';


  

const MyShop = ({ jsonData }) => {
  const { id } = useParams(); // Extract shop ID from URL parameter
  const [shopData, setShopData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  useEffect(() => {
    // Simulate fetching data from jsonData
    const fetchData = async () => {
      try {
        // Mock API call using setTimeout
        const shop = await new Promise(resolve => {
          setTimeout(() => {
            const shop = jsonData.find(item => item.id === parseInt(id));
            resolve(shop);
          }, 2000); // Simulating delay for demonstration
        });

        setShopData(shop);
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading state to false in case of error
      }
    };

    fetchData(); // Call the function to fetch data
  }, [id, jsonData]);

  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(prevState => !prevState); // Toggle the state
  };

  const handlewalink = () => {
    const message = "I saw this product at Moihub eShop..."; // Message without encoding
    const whatsAppLink = `https://wa.me/${shopData.phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp link in a new tab or window
    window.open(whatsAppLink, '_blank');
  };

  const handleCallClick = () => {
    // You can add additional logic here, such as making a phone call
    window.location.href = `tel:${shopData.phoneNumber}`;
  };

  if (isLoading) {
    return <ShopSkeleton/>;
  }

  if (!shopData) {
    // Show message when no data is available
    return <NotFoundPage />;
  }

  // Once data is fetched and loaded, render the shop details
  return (
    <div>
      <div className="shop-info">
        <div className="shop-name">{shopData.myShopData.shopName}</div>
        <div className='shop-location'>
          <div className='location'>{shopData.location} <i className="fas fa-map-marker-alt"></i></div>
          <div className='phone'>{shopData.phoneNumber} <i className="fas fa-phone"></i></div>
        </div>
      </div>
      
      <div className="card-container">
        {shopData.myShopData.products.map(product => (
          <div className="mini-card" key={product.id}>
            <div className="img-container" id={`product${product.id}`}>
              <img className="item-photo" src={product.image} alt={`Product ${product.id} Photo`} />
            </div>

            <div className="item-container">
              <h2 className="item-name">{product.name}</h2>

              <div className="price-container">
                <p className="item-price"><i className="fas fa-tag"></i> {product.price}</p>
              </div>

              <div className="button-container">
                <button className="button-n" onClick={toggleInfo}>Info <i className="fas fa-info-circle"></i></button>
                <button className="button-n" onClick={handlewalink}>Order <i className="fab fa-whatsapp"></i></button>
              </div>

              {showInfo && <div className="extra-info">
                <p>{product.info}</p>
              </div>}
            </div>
          </div>
        ))}
      </div>

      <div className="shop-setup-card">
        <p>
          Are you interested in showcasing your products on our website? Take the first step by contacting us now!
        </p>
        <button onClick={handleCallClick}>Call Now</button>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default MyShop;
