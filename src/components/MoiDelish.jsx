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
            <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
        <path fill=" #FF5722" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
      </svg>

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
                            <button className="cta-button" onClick={() => window.location.href = `tel:${provider.phone}`}>Order Now <i className="fas fa-phone"></i></button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
        <CustomerCare/>
        </>
    );
};

export default MoiDelish;
