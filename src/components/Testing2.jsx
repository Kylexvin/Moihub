<div>
<div className="flex justify-between items-center mb-6">
  <button
    onClick={() => setStep(2)}
    className="text-blue-600 hover:text-blue-700"
  >
    ← Back to Vehicles
  </button>
  <h2 className="text-2xl font-bold">Select Your Seat</h2>
</div>

<div className="bg-white rounded-lg shadow p-6">
  {/* Matatu details */}
  <div className="mb-6">
    <h3 className="text-xl font-semibold">{selectedMatatu.registrationNumber}</h3>
    <p className="text-gray-600">Departure: {selectedMatatu.departureTime}</p>
    <p className="text-gray-600">Price: Ksh {selectedMatatu.currentPrice || selectedRoute.basePrice}</p>
  </div>

  {loading ? (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  ) : (
    <>
      {/* Seat layout */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: selectedMatatu.totalSeats || 14 }, (_, index) => {
          const seatNumber = index + 1;
          const isBooked = bookedSeats.includes(seatNumber);
          const isSelected = selectedSeat === seatNumber;

          return (
            <button
              key={seatNumber}
              onClick={() => !isBooked && setSelectedSeat(seatNumber)}
              disabled={isBooked || loading}
              className={`p-4 rounded-lg text-center transition-colors duration-200 ${
                isBooked
                  ? 'bg-red-500 text-white cursor-not-allowed'
                  : isSelected
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {`Seat ${seatNumber}`}
            </button>
          );
        })}
      </div>

      {/* Booking CTA */}
      {selectedSeat && (
        <div className="mt-6 text-center">
          <button
            onClick={() => handleBooking(selectedSeat)}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Processing...' : `Book Seat ${selectedSeat}`}
          </button>
        </div>
      )}
    </>
  )}
</div>
</div>
);
};