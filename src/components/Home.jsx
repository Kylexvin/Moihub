import React  from 'react';
//import './home.css';
import AdContainer from './AdContainer';
import Hero from './uicomponents/Hero'
//import MobileWebServiceCards from './MobileWebServiceCards';
//import SpectacularFireworks from './SpectacularFireworks';
import HomeCards from './HomeCards';  
const Home = () => {

  return (
    <>
  {/* <SpectacularFireworks/> */} 
      {/* <AdContainer/> */}
      <Hero/>
      {/* <div className="ministrip-card">
        <div className="emergency-number left">
          <p> <i className="fas fa-ambulance"></i> Medical:0710761679</p>
        </div>
        <div className="emergency-number right">
          <p><i className="fas fa-shield-alt"></i> Security:0720253976</p>
                 </div>
      </div> */}
      {/* <MobileWebServiceCards/> */}
      <HomeCards/>
    </>
  );
};

export default Home;
