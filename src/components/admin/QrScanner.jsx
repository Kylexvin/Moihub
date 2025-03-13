import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr"; 

const QrScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [directUrl, setDirectUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

  // ✅ Start Camera for QR Scanning
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setScanResult("❌ Camera access denied or unavailable.");
    }
  };

  // ✅ Scan QR Code
  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsLoading(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ✅ Convert image to data and decode QR
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode && qrCode.data) {
      setScanResult(`✅ Scanned: ${qrCode.data}`);
      
      // Extract booking_id from URL or use the entire string
      let bookingId;
      try {
        // Check if it's a URL
        const url = new URL(qrCode.data);
        // Extract the booking_id parameter
        bookingId = url.searchParams.get("booking_id");
      } catch (e) {
        // If not a URL, use the entire string as the booking ID
        bookingId = qrCode.data;
      }
      
      await verifyBooking(bookingId);
    } else {
      setScanResult("⚠️ No QR code detected. Try again.");
      setIsLoading(false);
    }
  };

  // ✅ Handle direct URL input
  const handleDirectFetch = async (e) => {
    e.preventDefault();
    
    if (!directUrl) {
      setScanResult("⚠️ Please enter a booking URL or ID");
      return;
    }
    
    setIsLoading(true);
    
    let bookingId;
    try {
      // Check if it's a URL
      const url = new URL(directUrl);
      // Extract the booking_id parameter
      bookingId = url.searchParams.get("booking_id");
    } catch (e) {
      // If not a URL, use the entire string as the booking ID
      bookingId = directUrl;
    }
    
    await verifyBooking(bookingId);
  };

  // ✅ Verify Booking
  const verifyBooking = async (bookingId) => {
    setIsLoading(true);
    setScanResult(null);  // Clear previous results
    setBookingDetails(null);  // Clear previous booking details
    
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      setScanResult("⚠️ Authentication required. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://moihub.onrender.com/api/bookings/verify-booking?booking_id=${bookingId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookingDetails(data.booking);
        setScanResult("✅ Booking verified successfully");
      } else {
        setScanResult(data.message || "❌ Booking not found");
      }
    } catch (error) {
      setScanResult("❌ Error fetching booking details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📷 Booking Verification</h1>
      
      {/* 🔗 Direct URL Input Option */}
      <div className="w-full max-w-md mb-6">
        <form onSubmit={handleDirectFetch} className="flex space-x-2">
          <input 
            type="text" 
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Enter booking URL or ID" 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            Verify
          </button>
        </form>
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600">- OR -</p>
      </div>

      {/* 📷 Video Preview */}
      <div className="w-64 h-64 bg-black flex items-center justify-center mb-4 rounded-lg overflow-hidden relative">
        <video ref={videoRef} className="w-full h-full" autoPlay playsInline></video>
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* 🔍 Scan Button */}
      <button
        onClick={scanQRCode}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mb-4"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Scan QR Code"}
      </button>

      {/* 🔹 Scan Result */}
      {scanResult && <p className={`mt-4 ${scanResult.startsWith("✅") ? "text-green-500" : "text-red-500"} font-medium`}>{scanResult}</p>}

      {/* ✅ Booking Details */}
      {bookingDetails && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2 border-b pb-2">✅ Booking Details</h2>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-blue-50 p-3 rounded-md">
              <h3 className="font-medium text-blue-700">Passenger Information</h3>
              <p className="text-sm"><strong>Name:</strong> {bookingDetails.passenger?.name}</p>
              <p className="text-sm"><strong>Phone:</strong> {bookingDetails.passenger?.phone}</p>
              <p className="text-sm"><strong>Email:</strong> {bookingDetails.passenger?.email}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-md">
              <h3 className="font-medium text-green-700">Journey Details</h3>
              <p className="text-sm"><strong>Travel Date:</strong> {new Date(bookingDetails.travelDate).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Matatu:</strong> {bookingDetails.journey?.matatu}</p>
              <p className="text-sm"><strong>Route:</strong> {bookingDetails.journey?.route?.from} ➝ {bookingDetails.journey?.route?.to}</p>
              <p className="text-sm"><strong>Departure:</strong> {bookingDetails.journey?.departureTime}</p>
              <p className="text-sm"><strong>Seat Number:</strong> {bookingDetails.seatNumber}</p>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-md">
              <h3 className="font-medium text-purple-700">Payment Information</h3>
              <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${bookingDetails.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>{bookingDetails.status}</span></p>
              <p className="text-sm"><strong>Fare:</strong> KES {bookingDetails.fare}</p>
              <p className="text-sm"><strong>Amount Paid:</strong> KES {bookingDetails.payment?.amount}</p>
              <p className="text-sm"><strong>Payment Method:</strong> {bookingDetails.payment?.method}</p>
              <p className="text-sm"><strong>Reference:</strong> {bookingDetails.payment?.reference}</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">Booking ID: {bookingDetails.id}</p>
        </div>
      )}

      {/* 📷 Hidden Canvas for QR Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default QrScanner;