import React from 'react'; 
import './footer.css'
 
const Footer = () => { 
  return ( 
    <footer> 
      <div className="footer-content"> 
        <div className="footer-section"> 
          <h4>About Us</h4> 
          <p>Learn more about our mission and values.</p> 
        </div> 
        <div className="footer-section"> 
          <h4>Quick Links</h4> 
          <ul> 
            <li><a href="/">Home</a></li> 
            <li><a href="/eshop">Products</a></li> 
           
          </ul> 
        </div> 
        <div className="footer-section"> 
          <h4>Contact Us</h4> 
          <p>info.moihub@gmail.com</p> 
          <p>Phone:+254768610613</p> 
        </div> 
        <div className="footer-section"> 
          <h4>Follow Us</h4> 
          <ul className="social-icons"> 
            <li><a href="moihub.co.ke" className="fab fa-facebook"></a></li> 
            <li><a href="moihub.co.ke" className="fab fa-tiktok"></a></li> 
            <li><a href="moihub.co.ke" className="fab fa-instagram"></a></li> 
          </ul> 
        </div> 
      </div> 
      <div className="footer-bottom"> 
        <p>© 2024 <br />Kylex inc | Sejjo Co. <br />All rights reserved.</p> 
      </div> 
    </footer> 
  ); 
}; 
 
export default Footer; 
