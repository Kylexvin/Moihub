import React from 'react';
import './entity.css';
import { Link } from 'react-router-dom'; // Import Link from React Router
import jsonData from './data.json'; // Import JSON data

const BusinessEntity = () => {

    const handleCallClick = () => {
        // You can add additional logic here, such as making a phone call
        window.location.href = "tel:0745276898";
      };
    return (
        <>
        <section className='business-cards-container'>
            {jsonData.map((data) => (
                <div className="business-card" key={data.id}>
                    <div className="biz-title-card">
                        <h2>{data.title}</h2>
                    </div>

                    <div className="info-cards">
                        <div className="location-card">
                            <h3>{data.location}</h3>
                        </div>

                        <div className="hours-card">
                            <h3>{data.hours}</h3>
                        </div>
                    </div>

                    
                     <div className="additional-info">  
                        <h3>Additional Information</h3>
                        <div className="info">
                            <p>{data.description}</p>
                        </div>
                    </div>

                    <div className="btn-container">
                        <Link to={`/myshop/${data.title}/${data.id}`} className="btn-shop">View Shop <i className="fas fa-store"></i></Link>
                    </div> 
                </div>
            ))}

            
             
        </section>
        <div className="shop-setup-card">
        
        <p>
          Are you interested in setting your shop on our website? Take the first step by contacting us now!
        </p>
        <button onClick={handleCallClick}>Call Now</button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
          <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </>
    );
};

export default BusinessEntity;
