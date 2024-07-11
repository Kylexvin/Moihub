import React from 'react';
import { useParams } from 'react-router-dom';
import providerData from '../data/moidelish.json'; // Assuming this is your JSON data
import './providersdetails.css';

const ProviderDetails = () => {
    const { providerId } = useParams();
    const provider = providerData.find(p => p.id === providerId);

    if (!provider) {
        return <div>Provider not found</div>;
    }

    return ( 
    <>
        <div className="provider-details">
            <h1 className='provider-name'>{provider.name}</h1>
          
            <div className="info-row">
            <p><i className="fas fa-map-marker-alt"></i> <br></br>{provider.location}</p>
            <p><i className="fas fa-clock"></i> <br></br>{provider.deliveryTime}</p>
            </div>
            
            </div>
            <div className="card-food">
                <h2>Products</h2>
                <ul>
                    {provider.products.map(product => (
                        <li key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <div>
                                <p className='product-name'>{product.name}</p>
                                <p className='product-price'>{product.price}</p>
                                <button className='order-now-btn'>Order Now</button>
                            </div>
                        </li>
                    ))}
                </ul>
           
        </div>

       </>
    );
};

export default ProviderDetails;
