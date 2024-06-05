import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MoiDelish.css';
import providerData from '../data/moidelish.json';
import CustomerCare from './customercare';

const MoiDelish = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProviders, setFilteredProviders] = useState(providerData);

    useEffect(() => {
        const interval = setInterval(() => {
            showSlide();
        }, 2000);

        return () => clearInterval(interval);
    }, [currentSlide]);

    const showSlide = () => {
        const slides = document.querySelectorAll('.slide');
        slides[currentSlide].classList.remove('active');
        const nextSlide = (currentSlide + 1) % slides.length;
        setCurrentSlide(nextSlide);
        slides[nextSlide].classList.add('active');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const filtered = providerData.filter(provider =>
            provider.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.foodTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProviders(filtered);
    };

    return (
        <>
        <div>
            <section className="orange">
                <div className="hero">
                    <div className="intro-card">
                        <div className="intro-header">
                            <h1>Welcome to MoiDelish</h1>
                            <p>Your one-stop destination for delicious food delivery around Moi University!</p>
                        </div>
                    </div>
                    <div className="slide active">
                        <img src="../delish/image1.png" alt="Food Image 1" />
                    </div>
                    <div className="slide">
                        <img src="../delish/image3.png" alt="Food Image 2" />
                    </div>
                    <div className="slide">
                        <img src="../delish/image4.png" alt="Food Image 3" />
                    </div>
                    <div className="slide">
                        <img src="../delish/image3.png" alt="Food Image 4" />
                    </div>
                </div>
            </section>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
                <path fill="#FF5722" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
            <div className="container-s">
                <div className="search-panel">
                    <div className="search-container">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search for a service..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button type="button" id="button" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="container-provider">
                {filteredProviders.map((provider, index) => (
                    <div key={index} className="card-provider">
                        <div className="card-header">
                            <h2 className="provider-name">{provider.providerName}</h2>
                            <div className="ratings">
                                <i className="fas fa-star"></i>{provider.rating}
                            </div>
                        </div>
                        <div className="card-body">
                            <div>
                                <ul className="food-types">
                                    {provider.foodTypes.map((type, typeIndex) => (
                                        <li key={typeIndex}>{type}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="delivery-time"><i className="far fa-clock"></i>{provider.deliveryTime}</p>
                            <p className="offer-tag"><i className="fas fa-tags"></i>{provider.offer}</p>
                        </div>
                        <div className={`card-footer ${provider.hasDetails ? '' : 'single-button'}`}>
                            {provider.hasDetails && (
                                <Link to={`/provider/${provider.id}`} className="cta-button">More Details</Link>
                            )}
                            <button className="cta-button" onClick={() => window.location.href = `tel:${provider.phoneNumber}`}>Order Now <i className="fas fa-phone"></i></button>
                        </div>
                    </div>
                ))}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
                <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
        </div>
        <CustomerCare/>
        </>
    );
};

export default MoiDelish;
