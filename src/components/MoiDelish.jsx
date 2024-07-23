import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MoiDelish.css';
import providerData from '../data/moidelish.json';
import CustomerCare from './customercare';

const MoiDelish = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProviders, setFilteredProviders] = useState(providerData);
    const [showComingSoon, setShowComingSoon] = useState(true);

    useEffect(() => {
        let interval;
        if (!showComingSoon) {
            interval = setInterval(() => {
                showSlide();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [currentSlide, showComingSoon]);

    const showSlide = () => {
        const slides = document.querySelectorAll('.slide');
        if (slides.length > 0) {
            slides[currentSlide].classList.remove('active');
            const nextSlide = (currentSlide + 1) % slides.length;
            setCurrentSlide(nextSlide);
            slides[nextSlide].classList.add('active');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        const filtered = providerData.filter(provider =>
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.foodTypes.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredProviders(filtered);
    };

    const closeComingSoonModal = () => {
        setShowComingSoon(false);
    };

    if (showComingSoon) {
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="coming-soon-icon">
                        <i className="fas fa-tools"></i>
                    </div>
                    <h2 className="modal-title">MoiDelish is Coming Soon!</h2>
                    <p className="modal-message">
                        We're working hard to bring you the best food delivery experience around Moi University.
                        The full service will be available soon. You can proceed to view our current progress,
                        but please note that some features may not be fully functional yet.
                    </p>
                    <button onClick={closeComingSoonModal} className="close-modal-button">
                        <span>Proceed</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        );
    }

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
            <div className="container-provider">
                {Array.isArray(filteredProviders) && filteredProviders.map((provider, index) => (
                    <div key={index} className="card-provider">
                        <div className="card-header">
                            <h2 className="provider-name">{provider.name}</h2>
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
        
        <CustomerCare/>
        </>
    );
};

export default MoiDelish;