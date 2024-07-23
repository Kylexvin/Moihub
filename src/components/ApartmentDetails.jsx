import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import './apartment.css';

const ApartmentDetails = ({ plots }) => {
  const { id } = useParams();
  const apartmentDetails = plots[id];
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImagesLoading(false);
    }, 2000); // Setting a timeout of 2 seconds

    // Cleanup function to clear the timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array ensures useEffect only runs once

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleImageModal = () => {
    setImageModalVisible(!imageModalVisible);
  };

  const handleCallCaretaker = () => {
    window.location.href = `tel:${apartmentDetails.contact}`;
  };

  const handleImageLoad = () => {
    // This function will be called when all images are loaded
    setImagesLoading(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Please do not send payment without proper consultation. If you have to book a room, consult the MoiHub admin first<br></br>0745276898.</p>
            <button onClick={closeModal} className="close-modal-button">Proceed</button>
          </div>
        </div>
      )}

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
            <p>Price: {apartmentDetails.price}/{apartmentDetails.per}</p>
          </div>
          <div className="card-apa">
            <i className="fas fa-map-marker-alt"></i>
            <p>Location: {apartmentDetails.location}</p>
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
          <button className="toggle-button">View Maps <i className="fas fa-map-marker-alt"></i></button>
          </a>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

ApartmentDetails.propTypes = {
  plots: PropTypes.array.isRequired,
};

export default ApartmentDetails;
