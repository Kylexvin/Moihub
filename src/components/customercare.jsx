import React from 'react';
import './customercare.css';

const CustomerCare = () => {
  const pretypeMessage = encodeURIComponent("Texting via MoiHub"); // Encode your pretype message

  return (
    <div className="customer-care">
      
      <a href={`https://wa.me/254714167758/?text=${pretypeMessage}`} target="_blank">
        <p>Need help?</p>
        <i className="fab fa-whatsapp fa-lg" style={{ color: 'white' }}></i>
      </a>
    </div>
  );
}

export default CustomerCare;
