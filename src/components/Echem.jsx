import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './echem.css';
import pharmacyData from '../data/pharmacy.json';

function Echem({ cartItems, setCartItems }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPharmacies(pharmacyData);
            setLoading(false);
        }, 1500); // Simulated loading delay
    }, []);

    const addToCart = (pharmacy) => {
        const updatedPharmacies = pharmacies.map(item => {
            if (item.id === pharmacy.id) {
                return { ...item, addedToCart: true };
            }
            return item;
        });
        setPharmacies(updatedPharmacies);
        setCartItems([...cartItems, pharmacy]);
        setTimeout(() => {
            const revertedPharmacies = pharmacies.map(item => {
                if (item.id === pharmacy.id) {
                    return { ...item, addedToCart: false };
                }
                return item;
            });
            setPharmacies(revertedPharmacies);
        }, 3000);
    };

    const handleSearch = () => {
        const filteredPharmacies = pharmacies.filter(pharmacy =>
            pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredPharmacies);
    };

    const handleOrderNow = (pharmacy) => {
        const message = `Hello, I would like to order ${pharmacy.name}.`;
        const whatsappLink = `https://wa.me/254718055023?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink);
    };

    const handleConfidentialInquiry = () => {
        const message = "Hello, I have a confidential inquiry.";
        const whatsappLink = `https://wa.me/254718055023?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink);
    };

    return (
        <div className="echem-container">
          <div className="pharmacy-street-view">
    <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
        <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
    </svg>
    <img src="../Team/goodlife.jpg" alt="Pharmacy Street View" />
    <div className="pharmacy-info">
        <h2>Goodlife Pharmacy</h2>
        <p>Stage, opposite Homes, past Megabytes</p>
        {/* <p>Open 24/7</p> */}
    </div>
</div>






            <div className="container-s">
                <div className="search-panel card">
                    <div className="search-container">
                        <input
                            type="text"
                            id="search"
                            className="search-input"
                            placeholder="Search for medications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>Search</button>
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-containerr">
                    <div className="loaderr"></div>
                </div>
            ) : (
                <>
                   
                    <div className="pharmacy-container">
                        {(searchResults.length > 0 ? searchResults : pharmacies).map((pharmacy) => (
                            <div key={pharmacy.id} className="pharmacy-card">
                                <img src={pharmacy.image} alt={pharmacy.name} className="pharmacy-image" />
                                <div className="pharmacy-details">
                                    <h3 className="pharmacy-name">{pharmacy.name}</h3>
                                    <p className="pharmacy-price">Ksh {pharmacy.price}</p>
                                    <span className={`stock-badge ${pharmacy.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                        {pharmacy.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <div className="button-container">
                                    <button
                                        className={`pharmacy-add-to-cart ${pharmacy.addedToCart ? 'added' : ''}`}
                                        onClick={() => addToCart(pharmacy)}
                                        disabled={pharmacy.addedToCart || !pharmacy.inStock}
                                    >
                                        {pharmacy.addedToCart ? "Added to Cart" : "Add to Cart"}
                                    </button>
                                    <button 
                                        className="pharmacy-order-now"
                                        onClick={() => handleOrderNow(pharmacy)}
                                        disabled={!pharmacy.inStock}
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}


<div className='confidential-cardc'>
            <div className="confidential-card">
                <h3 className="confidential-title">
                    <i className="fas fa-lock"></i>
                </h3>
                <p className="confidential-text">
                    Feel free to reach out with any private inquiries.
                </p>
                <button className="confidential-button" onClick={handleConfidentialInquiry}>
                    <i className="fab fa-whatsapp"></i> Inquire Confidentially
                </button>
            </div>
</div>


<div className="map-container">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15955.275859674947!2d35.291438!3d0.290336!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178106fffc37c663%3A0x487e36c633f5b313!2sMoi%20University%20Main%20Campus!5e0!3m2!1sen!2ske!4v1693212345678!5m2!1sen!2ske&marker=color:red%7Clabel:M%7C0.290336,35.291438"
        width="100%"
        height="300"
        style={{ border: "none" }}
        allowFullScreen=""
        aria-hidden="false"
        tabIndex="0"
    ></iframe>
</div>




            {/* <div className="small-footer">
                <p>&copy; 2024 Echem. All rights reserved.</p>
               
            </div> */}

            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
                <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg> */}

            <div className="footer">
                <div className="footer-icons">
                    <Link to="/cart" className="cart-link">
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-counter">{cartItems.length}</span>
                    </Link>
                    <a href="/">
                        <i className="fas fa-home"></i>
                    </a>
                    <a href="https://wa.me/254718055023">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Echem;