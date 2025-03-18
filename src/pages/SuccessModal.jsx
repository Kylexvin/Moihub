import React from 'react';

export const SuccessModal = ({ show, onClose, bookingData, bookingDetails }) => {
  if (!show) return null;

  // Extract booking information regardless of structure
  const bookingId = bookingData?.booking?.id || bookingData?.booking_id || bookingData?.id;
  const registration = bookingDetails?.registration || bookingData?.booking?.matatu?.registration;
  const routeName = bookingDetails?.route?.name || bookingData?.booking?.matatu?.route?.name;
  const seatNumbers = bookingDetails?.seats || 
                     (bookingData?.seat_number ? [bookingData.seat_number] : []) ||
                     (bookingData?.booking?.seat_number ? [bookingData.booking.seat_number] : []);

  const receiptNumber = bookingData?.receipt_number || bookingData?.transaction_details?.receipt_number;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h2 className="text-xl font-bold text-green-700">Booking Successful!</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><span className="font-medium">Booking ID:</span> {bookingId || 'N/A'}</p>
            <p><span className="font-medium">Registration:</span> {registration || 'N/A'}</p>
            <p><span className="font-medium">Route:</span> {routeName || 'N/A'}</p>
            <p><span className="font-medium">Seat(s):</span> {seatNumbers.length ? seatNumbers.join(', ') : 'N/A'}</p>
            {receiptNumber && (
              <p><span className="font-medium">M-PESA Receipt:</span> {receiptNumber}</p>
            )}
          </div>
          
          <div className="text-center space-y-4 mt-4">
            <p className="text-gray-600">Your ticket is now confirmed!</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={onClose} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-300"
              >
                View My Bookings
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md transition-colors duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
