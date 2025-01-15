import React from 'react';

const Ticket = ({ bookingDetails }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold">Ticket Generated Successfully</h2>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Travel Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">{bookingDetails.matatu.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium">{bookingDetails.matatu.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-medium">{bookingDetails.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-medium">KSH {bookingDetails.price}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ticket;