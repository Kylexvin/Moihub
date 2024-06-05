import React from 'react';
import { useParams } from 'react-router-dom';
import providerData from '../data/moidelish.json';
//    import './ProviderDetails.css';

const ProviderDetails = () => {
    const { providerId } = useParams();
    const provider = providerData.find(p => p.id === parseInt(providerId));

    if (!provider) {
        return <div>Provider not found</div>;
    }

    return (
        <div className="provider-details">
            <h1>{provider.providerName}</h1>
            <div className="ratings">
                <i className="fas fa-star"></i>{provider.rating}
            </div>
            <p>{provider.description}</p>
            <h3>Food Types:</h3>
            <ul className="food-types">
                {provider.foodTypes.map((type, index) => (
                    <li key={index}>{type}</li>
                ))}
            </ul>
            <p className="delivery-time"><i className="far fa-clock"></i>{provider.deliveryTime}</p>
            <p className="offer-tag"><i className="fas fa-tags"></i>{provider.offer}</p>
            <button className="cta-button" onClick={() => window.location.href = `tel:${provider.phoneNumber}`}>Order Now <i className="fas fa-phone"></i></button>
        </div>
    );
};

export default ProviderDetails;
