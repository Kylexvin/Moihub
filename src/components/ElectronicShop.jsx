import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './myshop.css';
//import NotFoundPage from './NotFoundPage';
import electronicsData from './electronicsData.json';



const ElectronicShop = () => {
    const { id } = useParams();
    const [shopData, setShopData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const shop = await new Promise(resolve => {
                    setTimeout(() => {
                        const shop = electronicsData.find(item => item.id === parseInt(id));
                        resolve(shop);
                    }, 2000);
                });

                setShopData(shop);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const [showInfo, setShowInfo] = useState(false);

    

    const handlewalink = () => {
        const message = "I saw this product at Electronic Shop...";
        const whatsAppLink = `https://wa.me/${shopData.phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsAppLink, '_blank');
    };

    const handleCallClick = () => {
        window.location.href = `tel:${shopData.phoneNumber}`;
    };

    if (isLoading) {
        return (
            <div className="loader-container">
                
            </div>
        );
    }

   

    

    return (
        <div>
            <div className="shop-info">
                <div className="shop-name">{shopData.myShopData.shopName}</div>
                <div className='shop-location'>
                    <div className='location'>{shopData.location} <i className="fas fa-map-marker-alt"></i></div>
                    <div className='phone'>CONTACT:{shopData.phoneNumber} <i className="fas fa-phone"></i></div>
                </div>
            </div>
            <div className="card-container">
                {shopData.myShopData.products.map(product => (
                    <div className="mini-card" key={product.id}>
                        <div className="img-container" id={`product${product.id}`}>
                            <img className="item-photo" src={product.image} alt={`Product ${product.id} Photo`} />
                        </div>
                        <div className="item-container">
                            <div className="item-name">{product.name}</div>
                            <div className="price-container">
                                <p className="item-price"><i className="fas fa-tag"></i> {product.price}</p>
                            </div>
                            <div className="button-container">
                                <button className="button-n" onClick={handlewalink}>Inquire  <i className="fab fa-whatsapp"></i></button>
                            </div>
                            
                        </div>
                    </div>
                ))}
            </div>
            <div className="shop-setup-card">
                <p>Are you interested in showcasing your products on our website? Take the first step by contacting us now!</p>
                <button onClick={handleCallClick}>Call Now</button>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
                <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
        </div>
    );
};

export default ElectronicShop;