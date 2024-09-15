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

    // Function to handle phone call
    const handleCall = () => {
        // This will open the phone's dialer with the provider's phone number
        window.location.href = `tel:${provider.phone}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="provider-details bg-white shadow-md rounded-lg p-6 mb-8">
                <h1 className='provider-name text-3xl font-bold mb-4'>{provider.name}</h1>
                <div className="info-row flex justify-between">
                    <p className="flex items-center"><MapPin className="mr-2" /><br /> {provider.location}</p>
                    <p className="flex items-center"><Clock className="mr-2" /><br /> {provider.deliveryTime}</p>
                </div>
            </div>

            <div className="card-food bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Foods Available</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {provider.products.map(product => (
                        <li key={product.id} className="flex flex-col bg-gray-50 rounded-lg overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-48 object-contain" />
                            <div className="p-4 flex-grow">
                                <p className='product-name'>{product.name}</p>
                                <p className='product-price'>
                                    {product.price}
                                    <br />
                                    {product.price2}
                                    <br />
                                    {product.price3}
                                </p>
                            </div>
                            <button  
                                className='order-now-btn w-full bg-blue-500 text-white py-2 px-4 flex items-center justify-center hover:bg-blue-600 transition-colors'
                                onClick={handleCall} // Call function when button is clicked
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
