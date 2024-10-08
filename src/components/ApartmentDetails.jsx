import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './apartment.css';

const ApartmentDetails = ({ plots }) => {
  const { id } = useParams();
  const apartmentDetails = plots[id];
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImagesLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Show a brief toast notification when the component mounts
    toast.warning("Please do not send payment without proper consultation.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
  }, []);

  const toggleImageModal = () => {
    setImageModalVisible(!imageModalVisible);
  };

  const handleCallCaretaker = () => {
    window.location.href = `tel:${apartmentDetails.contact}`;
  };

  const handleImageLoad = () => {
    setImagesLoading(false);
  };

  return (
    <>
      <ToastContainer />

      <div>
        <div className="centered-div">
          <p className="apartment-name">{apartmentDetails.name}</p>
        </div>

        <div className="card-section">
          <div className="card-apa">
            <i className="fas fa-bed"></i>
            <p>Vacant Rooms: {apartmentDetails.vacancy}</p>
          </div>
          <div className="card-apa">
            <i className="fas fa-dollar-sign"></i>
            <p>Price: {apartmentDetails.price} {apartmentDetails.price1} {apartmentDetails.price2}/{apartmentDetails.per}</p>
          </div>
          <div className="card-apa">
            <i className="fas fa-map-marker-alt"></i>
            <p>Location: {apartmentDetails.location} {apartmentDetails.pd}</p>
          </div>
        </div>

        <div className="centered-div">
          <button className="toggle-button" onClick={toggleImageModal}>
            <i className="fas fa-camera"></i> {imageModalVisible ? 'Close Gallery' : 'View Gallery'}
          </button>

          {imageModalVisible && (
            <div className="image-modal-overlay" onClick={toggleImageModal}>
              <div className="image-modal-content">
                {imagesLoading && <div className="loader"></div>}
                <div className="image-container" id="imageContainer">
                  {apartmentDetails.images.map((image, index) => (
                    <img
                      key={index}
                      src={`/assets/${image}`}
                      alt={`Img ${index + 1}`}
                      onLoad={handleImageLoad}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="centered-div">
          <button className="toggle-button" onClick={handleCallCaretaker}>
            <i className="fas fa-phone phone-icon"></i> Contact Caretaker
          </button>
        </div>

        <div className="centered-div">
          <a href={`geo:${apartmentDetails.coordinates}?q=${apartmentDetails.coordinates}`}>
            <button className="toggle-button"> <i className="fas fa-map-marker-alt"></i> View Maps </button>
          </a>
        </div>
      </div>
    </>
  );
};

ApartmentDetails.propTypes = {
  plots: PropTypes.array.isRequired,
};

export default ApartmentDetails;