import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import RouteSelection from '../components/RouteSelection';
import VehicleSelection from '../components/VehicleSelection';
import SeatSelection from '../components/SeatSelection';
import Payment from '../components/Payment';
import Ticket from '../components/Ticket';
import MyBookings from '../components/MyBookings';

const Home = () => {
    const [step, setStep] = useState(1);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedMatatu, setSelectedMatatu] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [userHeldSeats, setUserHeldSeats] = useState([]);
    const [temporaryBookings, setTemporaryBookings] = useState([]);
    const [lockedSeats, setLockedSeats] = useState({});
    const [bookedSeats, setBookedSeats] = useState([]);
    const [seatCheckLoading, setSeatCheckLoading] = useState(false);
  
    const getBookedSeats = async (matatuId) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await fetch(
          `http://localhost:5000/api/bookings/booked-seats/${matatuId}/${today}`
        );
        const data = await response.json();
        setBookedSeats(data.bookedSeats || []);
      } catch (err) {
        console.error('Error fetching booked seats:', err);
        setBookedSeats([]);
      }
    };
  
    const checkUserTemporaryBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      try {
        console.log('Checking temporary bookings for matatu:', selectedMatatu._id);
        const response = await fetch(`http://localhost:5000/api/bookings/temporary/${selectedMatatu._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Temporary bookings response:', data);
        
        if (data.temporaryBookings) {
          setTemporaryBookings(data.temporaryBookings);
          // If user has any temporary bookings, set their held seats
          const userSeats = data.temporaryBookings
            .filter(booking => booking.status === 'pending')
            .map(booking => booking.seatNumber);
          console.log('User held seats:', userSeats);
          setUserHeldSeats(userSeats);
  
          // Update locked seats
          const lockedSeats = data.temporaryBookings
            .filter(booking => booking.status === 'pending')
            .reduce((acc, booking) => {
              acc[booking.seatNumber] = booking.bookingExpiry;
              return acc;
            }, {});
          setLockedSeats(lockedSeats);
        }
      } catch (err) {
        console.error('Error fetching temporary bookings:', err);
      }
    };
  
    const handleRouteSelect = (route) => {
      setSelectedRoute(route);
      setStep(2); // Move to the next step (Vehicle Selection)
    };
  
    const handleMatatuSelect = (matatu) => {
      setSelectedMatatu(matatu);
      setStep(3); // Move to the next step (Seat Selection)
    };
  
    const handleBooking = async (seatNumber) => {
      try {
        setSeatCheckLoading(true);
        
        // First check availability
        const isAvailable = await checkSeatAvailability(selectedMatatu._id, seatNumber);
        
        if (!isAvailable) {
          alert('Sorry, this seat is no longer available.');
          await getBookedSeats(selectedMatatu._id); // Refresh booked seats
          setSeatCheckLoading(false);
          return;
        }
  
        // Get the user token
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to continue with booking');
          // Redirect to login page here
          window.location.href = '/login';
          setSeatCheckLoading(false);
          return;
        }
  
        // Confirm booking
        const confirmBooking = window.confirm('Do you want to proceed with booking this seat?');
        if (!confirmBooking) {
          setSeatCheckLoading(false);
          return;
        }
  
        // Proceed with booking
        const response = await fetch('http://localhost:5000/api/bookings/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            matatuId: selectedMatatu._id,
            routeId: selectedRoute._id,
            seatNumber,
            travelDate: new Date().toISOString().split('T')[0],
            price: selectedMatatu.currentPrice || selectedRoute.basePrice
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Booking failed');
        }
  
        const data = await response.json();
        
        // Update booking details with more information
        setBookingDetails({
          ...data.booking,
          matatu: {
            ...selectedMatatu,
            route: selectedRoute
          },
          expiresIn: 900, // 15 minutes in seconds
          price: selectedMatatu.currentPrice || selectedRoute.basePrice
        });
  
        // Update local state to reflect the new booking
        setBookedSeats([...bookedSeats, seatNumber]);
        setSelectedSeat(null);
        
        // Store temporary booking in local storage
        const tempBookings = localStorage.getItem('temporaryBookings') ? JSON.parse(localStorage.getItem('temporaryBookings')) : [];
        tempBookings.push({ matatuId: selectedMatatu._id, seatNumber, status: 'pending', bookingExpiry: data.booking.bookingExpiry });
        localStorage.setItem('temporaryBookings', JSON.stringify(tempBookings));
        
      } catch (err) {
        console.error('Error creating booking:', err);
        alert(err.message || 'Failed to create booking. Please try again.');
      } finally {
        setSeatCheckLoading(false);
      }
    };
  
    return (
      <Routes>
        <Route path="/" element={
          <RouteSelection
            setStep={setStep}
            setSelectedRoute={setSelectedRoute}
            handleRouteSelect={handleRouteSelect}
          />
        } />
        <Route path="/vehicle-selection" element={
          <VehicleSelection
            selectedRoute={selectedRoute}
            setSelectedMatatu={setSelectedMatatu}
            handleMatatuSelect={handleMatatuSelect}
          />
        } />
        <Route path="/seat-selection" element={
          <SeatSelection
            selectedMatatu={selectedMatatu}
            selectedRoute={selectedRoute}
            selectedSeat={selectedSeat}
            setSelectedSeat={setSelectedSeat}
            setBookingDetails={setBookingDetails}
            setStep={setStep}
            setPaymentStatus={setPaymentStatus}
            setUserHeldSeats={setUserHeldSeats}
            setTemporaryBookings={setTemporaryBookings}
            setLockedSeats={setLockedSeats}
            setSeatCheckLoading={setSeatCheckLoading}
            getBookedSeats={getBookedSeats}
            checkUserTemporaryBookings={checkUserTemporaryBookings}
            handleBooking={handleBooking}
          />
        } />
        <Route path="/payment" element={<Payment bookingDetails={bookingDetails} setPaymentStatus={setPaymentStatus} setStep={setStep} />} />
        <Route path="/ticket" element={<Ticket bookingDetails={bookingDetails} />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        {/* Other routes */}
      </Routes>
    );
  };
  
  export default Home;