import React from 'react';
import { Link } from 'react-router-dom';
import electronicsData from './electronicsData.json';

const ElectronicsEntity = () => {
    return (
        <section className='business-cards-container'>
            {electronicsData.map((data) => (
                <div className="business-card" key={data.id}>
                    <div className="biz-title-card">
                        <h2>{data.title}</h2>
                    </div>
                    <div className="info-cards">
                        <div className="location-card">
                            <h3><i className="fas fa-map-marker-alt"></i> {data.location}</h3>
                        </div>
                        <div className="hours-card">
                            <h3><i className="fas fa-clock"></i> {data.hours}</h3>
                        </div>
                    </div>
                    <div className="additional-info">  
                        <h3>Additional Information</h3>
                        <div className="info">
                            <p>{data.description}</p>
                        </div>
                    </div>
                    <div className="btn-container">
                        <Link to={`/electronicshop/${data.title}/${data.id}`} className="btn-shop">View Shop <i className="fas fa-store"></i></Link>
                    </div> 
                </div>
            ))}
        </section>
    );
};

export default ElectronicsEntity;
