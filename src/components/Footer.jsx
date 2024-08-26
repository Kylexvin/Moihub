import React from 'react'; 
import './footer.css'
 
const Footer = () => { 
  return ( 
    <footer> 
      <div className="footer-content"> 
        <div className="footer-section"> 
          <h4>About Us</h4> 
          Learn more about our terms,conditions, policy and values by clicking <a href="/learnmore">here.</a>
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
            <li><a href="https://www.facebook.com/profile.php?id=61553038797986" className="fab fa-facebook"></a></li> 
            <li><a href="https://vm.tiktok.com/ZMrhXThUb/" className="fab fa-tiktok"></a></li> 
            <li><a href="https://www.instagram.com/_moihub?igsh=MWMzdG1qZzZ3ZmN2" className="fab fa-instagram"></a></li> 
          </ul> 
        </div> 
      </div> 
      <div className="footer-bottom"> 
        <p>© 2024 <br />✟KYLEX✟ | Sejjo Co. <br />All rights reserved.</p> 
      </div> 
    </footer> 
  ); 
}; 
 
export default Footer; 
