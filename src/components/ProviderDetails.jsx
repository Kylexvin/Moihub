import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import providerData from '../data/moidelish.json';
import './providersdetails.css';
import { MapPin, Clock, Phone } from 'lucide-react';

const ProviderDetails = () => {
    const { providerId } = useParams();
    const provider = providerData.find(p => p.id === providerId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!provider) {
        return <div>Provider not found</div>;
    }

    const handleCall = () => {
        window.location.href = `tel:${provider.phone}`;
    };

    return (
        <div className="max-w-6xl mx-0 px-4 py-8">
            <div className="provider-details bg-white shadow-md rounded-lg p-6 ">
                <h1 className='provider-name text-3xl font-bold mb-4'>{provider.name}</h1>
                <div className="info-row flex justify-between">
                    <p className="flex items-center"><MapPin className="mr-2" /><br />{provider.location}</p>
                    <p className="flex items-center"><Clock className="mr-2" /><br />{provider.deliveryTime}</p>
                </div>
            </div>
    
            <div className="food-cards">
                <h2 className="text-2xl font-semibold mb-4">Foods Available</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {provider.products.map(product => (
                        <div key={product.id} className="food-card bg-white shadow-md rounded-lg overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                <div className="mb-4">
                                    {product.price && <p className="text-gray-700">{product.price}</p>}
                                    {product.price2 && <p className="text-gray-700">{product.price2}</p>}
                                    {product.price3 && <p className="text-gray-700">{product.price3}</p>}
                                </div>
                                <button
                                    className="order-now-btn w-full bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                                    onClick={handleCall}
                                >
                                    <Phone className="mr-2" size={18} />
                                    Order Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
};

export default ProviderDetails;