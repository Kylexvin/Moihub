// Booking.js
import React, { useEffect, useState } from 'react';
import Filters from './Filters';
import { Link } from 'react-router-dom';
import './styles.css';

const plotsPerPage = 2; // Number of plots per page

const Booking = ({ plots }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlots, setFilteredPlots] = useState(plots);

  useEffect(() => {
    setFilteredPlots(plots);
  }, [plots]);

  const indexOfLastPlot = currentPage * plotsPerPage;
  const indexOfFirstPlot = indexOfLastPlot - plotsPerPage;
  const currentPlots = filteredPlots.slice(indexOfFirstPlot, indexOfLastPlot);

  const handleFiltering = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const priceRange = parseInt(document.getElementById('priceRange').value);
    const locationFilterValue = document.getElementById('locationFilter').value.toLowerCase();
    const vacancyFilterValue = document.getElementById('vacancyFilter').value.toLowerCase();

    const filtered = plots.filter(plot => {
      const plotName = plot.name.toLowerCase();
      const plotPrice = parseInt(plot.price);
      const plotLocation = plot.location.toLowerCase();
      const plotVacancy = plot.vacancy.toLowerCase();

      return plotName.includes(searchInput) &&
        (priceRange === 0 || plotPrice <= priceRange) &&
        (locationFilterValue === 'all' || plotLocation.includes(locationFilterValue)) &&
        (vacancyFilterValue === 'all' || (vacancyFilterValue === 'vacant' && plotVacancy === '1'));
    });

    setFilteredPlots(filtered);
  };

  return (
    <>
      <div>
        <Filters handleFiltering={handleFiltering} />
        <div className="apartment-container" id="apartmentContainer">
          {currentPlots.map((plot, index) => (
            <div key={index} className="apartment-card" data-name={plot.name} data-plottype={plot.plotType} data-price={plot.price} data-location={plot.location} data-vacancy={plot.vacancy}>
              <div className="appartment-name">{plot.name}</div>
              <div className="neomorphism">
                <div className="neomorphism" data-plottype={plot.plotType}>
                  Plot Type: {plot.plotType}
                </div>
                <div className="neomorphism" data-price={plot.price}>
                  <i className="fas fa-dollar-sign"></i> <br />{plot.price}/month
                </div>
                <div className="neomorphism" data-location={plot.location}>
                  <i className="fas fa-map-marker-alt"></i><br />{plot.location}
                </div>
                <Link to={`/apartment-details/${index}`} className="centered-btn">MORE DETAILS</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="filter-container">
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastPlot >= filteredPlots.length}>Next</button>
      </div>
      </div>
    </>
  );
};

export default Booking;
