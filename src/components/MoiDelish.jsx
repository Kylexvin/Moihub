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

        </div>
        <CustomerCare/>
        </>
    );
};

export default MoiDelish;
