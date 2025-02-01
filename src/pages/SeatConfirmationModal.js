import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SeatConfirmationModal = ({ show, handleClose, seat, matatuId, handleContinueBooking }) => {
  const navigate = useNavigate();

  const handleBooking = async () => {
    try {
      const lockedSeat = await handleContinueBooking();
      navigate(`/booking-confirmation/${matatuId}/${seat._id}`);
    } catch (error) {
      console.error('Error continuing booking:', error);
      alert('Failed to continue booking. Please try again.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg z-50">
        <h2 className="text-2xl font-bold mb-4">Confirm Seat Selection</h2>
        <p>Seat Number: {seat.seatNumber}</p>
        <p>Matatu: {matatuId}</p>
        <p>Departure Time: {seat.matatu_details.departure_time}</p>
        <p>Route: {seat.matatu_details.route.origin} - {seat.matatu_details.route.destination}</p>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleBooking}
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatConfirmationModal;