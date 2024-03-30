import React from 'react'; 
import './home.css';
import HeroSection from './HeroSection';
 
const Home = () => { 
  return ( 
    <> 
       

<HeroSection/>
 {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
  <path fill="#27a844" fill-opacity="1" d="M0,96L48,128C96,160,192,224,288,256C384,288,480,288,576,282.7C672,277,768,267,864,266.7C960,267,1056,277,1152,272C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" transform="rotate(180 720 160)"></path>
</svg>  */}
 
      <section className="body-cards"> 
  <div className="service-card"> 
    <div className="neumorphic-v2"> 
      <h3 className="neumorphic">Rent Your Space<br /><i className="fas fa-home"></i></h3> 
      <p className="neumorphic">Discover the perfect space for your stay. Browse through a variety of rental houses, check prices, locations, and other details—all from the comfort of your device.</p> 
     <a href="/book"><div className="neumorphic"> <button className="button-b">Explore Rentals <i className="fas fa-key"></i></button></div></a> 
    </div> 
  </div> 
 

  <div className="service-card"> 
    <div className="neumorphic-v2"> 
        <h3 className="neumorphic">Emergency Assistance<br /><i className="fas fa-ambulance"></i></h3> 
        <p className="neumorphic">Get immediate help in emergencies. Our service provides rapid response and assistance during critical situations.</p> 
        <a href="/emergency"><div className="neumorphic"> <button className="button-b">Access Now <i className="fas fa-exclamation-triangle"></i></button></div></a> 
    </div> 
</div>

<div className="service-card"> 
    <div className="neumorphic-v2"> 
        <h3 className="neumorphic">E-shop<br /><i className="fas fa-shopping-cart"></i></h3> 
        <p className="neumorphic">Explore a wide range of products from the comfort of your own home. Browse through our collection and enjoy hassle-free online shopping.</p> 
        <a href="/eshop"><div className="neumorphic"> <button className="button-b">Start Shopping <i className="fas fa-store"></i></button></div></a> 
    </div> 
</div>

  <div className="service-card"> 
    <div className="neumorphic-v2"> 
        <h3 className="neumorphic">Second-hand Market<br /><i className="fas fa-shopping-bag"></i></h3> 
        <p className="neumorphic">Explore a variety of gently used items. From home items to beddings, find great deals on second-hand products right from your screen.</p> 
        <a href="/marketplace"><div className="neumorphic"> <button className="button-b">Explore Now <i className="fas fa-tags"></i></button></div></a> 
    </div> 
</div>

<div className="service-card"> 
    <div className="neumorphic-v2"> 
        <h3 className="neumorphic">Find Your Perfect Roommate<br /><i className="fas fa-users"></i></h3> 
        <p className="neumorphic">Discover compatible roommates for your living space. Browse through profiles, preferences, and connect with potential roommates hassle-free.</p> 
        <a href="/find-roommate"><div className="neumorphic"> <button className="button-b">Explore Roommates <i className="fas fa-search"></i></button></div></a> 
    </div> 
</div>

  <div className="service-card"> 
    <div className="neumorphic-v2"> 
      <h3 className="neumorphic">Blog Post and News<br /><i className="fas fa-newspaper"></i></h3> 
      <p className="neumorphic">Stay informed and entertained! Read our latest blog posts and news articles covering a wide range of topics.</p> 
      <div className="neumorphic"><a href='/bbvvv'><button className="button-b">Read Now <i className="fas fa-book-open"></i></button></a></div> 
    </div> 
  </div> 

  
</section> 
 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)"> 
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path> 
      </svg> 
    </> 
  ); 
}; 
 
export default Home;