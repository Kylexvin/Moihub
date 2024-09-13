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
        window.location.href = `tel:${provider.contact}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="provider-details bg-white shadow-md rounded-lg p-6 mb-8">
                <h1 className='provider-name text-3xl font-bold mb-4'>{provider.name}</h1>
                <div className="info-row flex justify-between">
                    <p className="flex items-center"><MapPin className="mr-2" /> {provider.location}</p>
                    <p className="flex items-center"><Clock className="mr-2" /> {provider.deliveryTime}</p>
                </div>
            </div>

            <div className="card-food bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Products</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {provider.products.map(product => (
                        <li key={product.id} className="flex flex-col bg-gray-50 rounded-lg overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-grow">
                                <p className='product-name font-semibold'>{product.name}</p>
                                <p className='product-price text-gray-600'>{product.price}</p>
                                {product.price2 && <p className='product-price text-gray-600'>{product.price2}</p>}
                            </div>
                            <button 
                                className='order-now-btn w-full bg-blue-500 text-white py-2 px-4 flex items-center justify-center hover:bg-blue-600 transition-colors'
                                onClick={handleCall}
                            >
                                <Phone className="mr-2" size={18} />
                                Order Now
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProviderDetails;