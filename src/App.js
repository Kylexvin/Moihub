import React, { useState, useEffect } from 'react'; // Add this line
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Booking from './components/Booking';
import ApartmentDetails from './components/ApartmentDetails';
import Home from './components/Home';
import ProductList from './components/ProductList';
import SellersPage from './components/SellersPage';
import NotFoundPage from './components/NotFoundPage'; // Import the NotFoundPage component
import EshopHome from './components/EshopHome';
import BusinessEntity from './components/BusinessEntity';
import MyShop from './components/MyShop';
import jsonData from './components/data.json'; // Import JSON data
//import electronicsData from './components/electronicsData.json';
import RoomateFinder from './components/RoomateFinder';
import './App.css'; // Import CSS file
import ElectronicsEntity from './components/ElectronicsEntity';
import ElectronicShop from './components/ElectronicShop';
import Emergency from './components/Emergency';


const App = () => {
  const plots = [
    { 
      name: 'Emerald Green Estate', 
      plotType: 'Bedsitter', 
      price: 6000, 
      location: 'Stage', 
      vacancy: '1',
      images: ['../assets/image1.jpg', 'image2.jpg', 'image3.jpg'],
      contact: '254745276898',
    },
    { 
      name: 'Reboooooo ', 
      plotType: 'Studio', 
      price: 3000, 
      location: 'Mabs', 
      vacancy: '0',
      images: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
      contact: '987-654-3210',
    },
    { 
      name: 'Maraba', 
      plotType: 'Studio', 
      price: 3000, 
      location: 'chebarus', 
      vacancy: '1',
      images: ['image4.jpg', 'image5.jpg', 'image6.jpg'],
      contact: '987-654-3210',
    },
    
    // Add more plots as needed
  ];

  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data)
    const fetchData = async () => {
      // Perform some async operation here
      // For demonstration purposes, using setTimeout to simulate loading
      setTimeout(() => {
        setIsLoading(false); // Once loading is done, set isLoading to false
      }, 2000); // Simulating a 2-second loading time
    };

    fetchData(); // Call the async function
  }, []); 
  
  if (isLoading) {
    return (
      <div className='load-c'>
        <span className="loader"></span>
      </div>
    ); 
  }
  return (
    <>
      <div>
        <Navbar />
      </div>
      <Router scrollRestoration="auto">
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path='emergency' element={<Emergency/>}/>
    <Route path="/marketplace" element={<ProductList />} />
    <Route path="/sellers" element={<SellersPage />} />
    <Route path="/find-roommate" element={<RoomateFinder />} />
    <Route path="/book" element={<Booking plots={plots} />} />
    <Route path="/eshop" element={<EshopHome />} /> 
    <Route path="/apartment-details/:id" element={<ApartmentDetails plots={plots} />} />
    <Route path="/electronics" element={<ElectronicsEntity/>} /> 
    <Route path="/electronicshop/:title/:id" element={<ElectronicShop />} />
    <Route path="/entity" element={<BusinessEntity />} />
    <Route path="/myshop/:title/:id" element={<MyShop jsonData={jsonData} />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>

      <div>
        <Footer/>
      </div>
    </>
  );
};

export default App;
 