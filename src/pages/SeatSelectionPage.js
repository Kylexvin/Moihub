import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

const SeatSelectionPage = () => {
  const { matatuId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Select Your Seat</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Nairobi - Mombasa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Departure: 10:00 AM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">KSH 500</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-6 border-b">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-red-500"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                <span>Held</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-500"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(seatNumber => (
                <button
                  key={seatNumber}
                  className="relative p-6 rounded-lg text-white font-medium transform transition-all duration-200 bg-blue-500 hover:bg-blue-600"
                >
                  <span className="text-lg">{seatNumber}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;