import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MoiDelish.css';
import CustomerCare from '../customercare';
import FoodModal from './FoodModal';

const MoiDelish = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    
    // Fetch all approved vendors
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch('https://moihub.onrender.com/api/food/vendors/public/approved');
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                
                const data = await response.json();
                console.log("API Response:", data); // For debugging
                
                // Check if data contains vendors, might be directly in the array or in a vendors property
                let vendorsData = [];
                if (Array.isArray(data)) {
                    vendorsData = data; // The response is directly an array of vendors
                } else if (data && Array.isArray(data.vendors)) {
                    vendorsData = data.vendors; // The response has a vendors property
                } else if (data && data.success && Array.isArray(data.data)) {
                    vendorsData = data.data; // Common pattern: { success: true, data: [...] }
                } else {
                    // Attempt to extract any array from the response
                    for (const key in data) {
                        if (Array.isArray(data[key])) {
                            vendorsData = data[key];
                            break;
                        }
                    }
                }
                
                if (vendorsData.length > 0) {
                    setVendors(vendorsData);
                    setFilteredVendors(vendorsData);
                } else {
                    console.warn("No vendors found in the response", data);
                    setVendors([]);
                    setFilteredVendors([]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("API Error:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        
        fetchVendors();
    }, []);

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
        if (!searchTerm.trim()) {
            setFilteredVendors(vendors);
            return;
        }
        
        const filtered = vendors.filter(vendor =>
            (vendor.name && vendor.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
            (vendor.shopName && vendor.shopName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (vendor.description && vendor.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredVendors(filtered);
    };

    const openVendorModal = (vendor) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
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
                <path fill="#FF5722" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
            </svg>

            <div className="container-provider">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search for restaurant..." 
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
                
                {loading ? (
                    <div className="loading">Loading vendors...</div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor, index) => (
                        <div key={vendor._id || index} className="card-provider">
                            <div className="card-header">
                                <h2 className="provider-name">{vendor.shopName || vendor.name || "Food Vendor"}</h2>
                            </div>
                        
                            <div className="card-body">
                                <p className="vendor-description mb-2">
                                    {vendor.description || "Delicious food available"}
                                </p>
                            
                                {vendor.location && (
                                    <div className="flex justify-between items-center">
                                        <p className="vendor-location">
                                            <i className="fas fa-map-marker-alt"></i> {vendor.location}
                                        </p>
                                    
                                        <div className="flex items-center text-green-600">
                                            <i className="fas fa-check-circle mr-2"></i>
                                            <span>Open</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        
                            <div className="card-footer">
                                <button className="cta-button">
                                    <Link 
                                        to={`/vendor/${vendor._id}`}
                                        state={{ 
                                            shopName: vendor.shopName || vendor.name || "Food Vendor",
                                            phone: vendor.phone || vendor.contactNumber || "",
                                            location: vendor.location || "",
                                            description: vendor.description || "Delicious food available"
                                        }}
                                    >
                                        View Menu
                                    </Link>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No vendors found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
        
        {isModalOpen && selectedVendor && (
            <FoodModal 
                vendorId={selectedVendor._id} 
                vendorName={selectedVendor.shopName || selectedVendor.name || "Food Vendor"}
                onClose={() => setIsModalOpen(false)} 
            />
        )}
        
        <CustomerCare />
        </>
    );
};

export default MoiDelish;