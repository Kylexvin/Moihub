import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Filters from './Filters';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './styles.css';
import CustomerCare from './customercare';

const plotsPerPage = 6; // Number of plots per page

const Booking = ({ plots }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlots, setFilteredPlots] = useState(plots);
  const [animateCards, setAnimateCards] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(page);
    setAnimateCards(true);

    const notificationTimer = setTimeout(() => {
      toast("Na usisahau kuambia caretaker umetoka MoiHub!", {
        autoClose: 5000,
        position: "top-right",
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
        progressClassName: "custom-toast-progress",
        closeButton: true,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 60,
      });
    }, 5000);

    return () => clearTimeout(notificationTimer);
  }, [location.search]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const cards = document.querySelectorAll('.animated-card');

      cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = card.getBoundingClientRect().bottom;

        if (cardTop < windowHeight && cardBottom >= 0) {
          card.classList.add('show');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFiltering = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const locationFilterValue = document.getElementById('locationFilter').value.toLowerCase();
    const vacancyFilterValue = document.getElementById('vacancyFilter').value.toLowerCase();

    const filtered = plots.filter(plot => {
      const plotName = plot.name.toLowerCase();
      const plotPrice = parseInt(plot.price);
      const plotLocation = plot.location.toLowerCase();
      const plotVacancy = parseInt(plot.vacancy);

      return plotName.includes(searchInput) &&
        (priceRange === 0 || plotPrice <= priceRange) &&
        (locationFilterValue === 'all' || plotLocation.includes(locationFilterValue)) &&
        (vacancyFilterValue === 'all' || (vacancyFilterValue === 'vacant' && plotVacancy >= 1));
    });

    setFilteredPlots(filtered);
    handlePageChange(1);
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`?page=${newPage}`);
  };

  const indexOfLastPlot = currentPage * plotsPerPage;
  const indexOfFirstPlot = (currentPage - 1) * plotsPerPage;
  const currentPlots = filteredPlots.slice(indexOfFirstPlot, indexOfLastPlot);

  return (
    <>
      <svg id="unique-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(180)">
        <path fill="#27a844" fillOpacity="1" d="M0,0L24,32C48,64,96,128,144,149.3C192,171,240,149,288,138.7C336,128,384,128,432,144C480,160,528,192,576,213.3C624,235,672,245,720,229.3C768,213,816,171,864,144C912,117,960,107,1008,112C1056,117,1104,139,1152,144C1200,149,1248,139,1296,112C1344,85,1392,43,1416,21.3L1440,0L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z" />
      </svg>
      <ToastContainer />
      <div>
        <Filters handleFiltering={handleFiltering} />
        <div className="apartment-container" id="apartmentContainer">
          {currentPlots.map((plot, index) => (
            <div key={index} className={`apartment-card ${animateCards ? 'animated-card show' : ''}`}>
              <div className="appartment-name">{plot.name} {parseInt(plot.vacancy) >= 1 && <div className="green"></div>}
              </div>
              <div className="neomorphism">
                <div className="neomorphism" data-plottype={plot.plotType}>
                  {plot.plotType}
                </div>
                <div className="neomorphism" data-price={plot.price}>
                  <i className="fas fa-dollar-sign"></i> <br />{plot.price}/{plot.per}<br/>
                  <p></p>
                </div>
                <div className="neomorphism" data-location={plot.location}>
                  <i className="fas fa-map-marker-alt"></i><br></br>{plot.location}<br></br>
                  {plot.pd}
                </div>
                <Link to={`/apartment-details/${plots.indexOf(plot)}`} className="centered-btn">MORE DETAILS</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="filter-container">
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1} 
            aria-label="Previous"
          >
            <i className="fas fa-arrow-left"></i> Previous
          </button>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={indexOfLastPlot >= filteredPlots.length} 
            aria-label="Next"
          >
            Next <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      
      <div className="container">
        <div className="service-details" itemScope itemType="http://schema.org/Service">
          <h2 itemProp="name">Apartment Booking</h2>
          <div className="review" itemScope itemType="http://schema.org/Review">
            <span itemProp="author">Satisfied Client</span>
            <span itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
              <span itemProp="ratingValue">100+</span>
            </span>
            <span itemProp="description">Easy and quick booking process!</span>
          </div>
          <p itemProp="description">
            Book your ideal apartment in Moi University's vicinity through MoiHub's hassle-free e-service.
          </p>
          <p>
            Find various accommodation options and availabilities tailored to your needs.
          </p>
        </div>
      </div>
      <CustomerCare/>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" transform="rotate(0)">
        <path fill="#1a1a1a" fillOpacity="1" d="M0,32L80,74.7C160,117,320,203,480,229.3C640,256,800,224,960,229.3C1120,235,1280,277,1360,298.7L1440,320L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>
    </>
  );
};

export default Booking;