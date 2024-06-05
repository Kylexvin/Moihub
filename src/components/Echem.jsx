import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './echem.css';
import pharmacyData from '../data/pharmacy.json'; // Import JSON data

function Echem({ cartItems, setCartItems }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [pharmacies, setPharmacies] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setPharmacies(pharmacyData); // Set pharmacies state with data from JSON file
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
        // Revert back to "Add to Cart" after a few seconds
        setTimeout(() => {
            const revertedPharmacies = pharmacies.map(item => {
                if (item.id === pharmacy.id) {
                    return { ...item, addedToCart: false };
                }
                return item;
            });
            setPharmacies(revertedPharmacies);
        }, 3000); // 3000 milliseconds = 3 seconds
    };

    const handleSearch = () => {
        const filteredPharmacies = pharmacies.filter(pharmacy =>
            pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredPharmacies);
    };

    const handleOrderNow = (pharmacy) => {
        const message = `Hello, I would like to order ${pharmacy.name}.`;
        const whatsappLink = `https://wa.me/254768610613?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink);
    };

    return (
        <>
            <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
                <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
            </svg>

            <div className="container-s">
                <div className="search-panel">
                    <div className="search-container">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search for medications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" id="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="pharmacy-container">
                {(searchResults.length > 0 ? searchResults : pharmacies).map((pharmacy) => (
                    <div key={pharmacy.id} className="pharmacy-card">
                        <img src={pharmacy.image} alt={pharmacy.name} />
                        <div className="pharmacy-details">
                            <h3 className="pharmacy-name">{pharmacy.name}</h3>
                            <p className="pharmacy-price">Ksh {pharmacy.price}</p>
                        </div>
                        <div className="button-container">
                            <button
                                className="pharmacy-add-to-cart"
                                onClick={() => addToCart(pharmacy)}
                                disabled={pharmacy.addedToCart} // Disable button if already added to cart
                            >
                                {pharmacy.addedToCart ? "Added to Cart" : "Add to Cart"}
                            </button>

                            <button 
                                className="pharmacy-order-now"
                                onClick={() => handleOrderNow(pharmacy)}
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
                <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>

            <div className="footer">
                <div className="footer-icons">
                    <Link to="/cart" className="cart-link">
                        <i className="fas fa-shopping-cart"></i>
                    </Link>
                    <span className="cart-counter">{cartItems.length}</span>
                    <a href="/">
                        <i className="fas fa-home"></i>
                    </a>
                    <a href="https://wa.me/254768610613">
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </>
    );
}

export default Echem;
