import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr"; // ✅ Import the QR decoder

const QrScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
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
      verifyBooking(qrCode.data);
    } else {
      setScanResult("⚠️ No QR code detected. Try again.");
    }
  };

  // ✅ Verify Booking
  const verifyBooking = async (bookingId) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token) {
      setScanResult("⚠️ Authentication required. Please log in.");
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
      } else {
        setScanResult(data.message || "❌ Booking not found");
      }
    } catch (error) {
      setScanResult("❌ Error fetching booking details");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">📷 QR Scanner</h1>

      {/* 📷 Video Preview */}
      <div className="w-64 h-64 bg-black flex items-center justify-center mb-4">
        <video ref={videoRef} className="w-full h-full" autoPlay playsInline></video>
      </div>

      {/* 🔍 Scan Button */}
      <button
        onClick={scanQRCode}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Scan QR Code
      </button>

      {/* 🔹 Scan Result */}
      {scanResult && <p className="mt-4 text-red-500">{scanResult}</p>}

      {/* ✅ Booking Details */}
      {bookingDetails && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">✅ Booking Details</h2>
          <p><strong>ID:</strong> {bookingDetails._id}</p>
          <p><strong>Status:</strong> {bookingDetails.status}</p>
          <p><strong>Travel Date:</strong> {bookingDetails.travelDate}</p>
          <p><strong>Passenger:</strong> {bookingDetails.passenger?.name}</p>
          <p><strong>Phone:</strong> {bookingDetails.passenger?.phone}</p>
          <p><strong>Email:</strong> {bookingDetails.passenger?.email}</p>
          <p><strong>Matatu:</strong> {bookingDetails.journey?.matatu}</p>
          <p><strong>Route:</strong> {bookingDetails.journey?.route?.from} ➝ {bookingDetails.journey?.route?.to}</p>
          <p><strong>Departure:</strong> {bookingDetails.journey?.departureTime}</p>
          <p><strong>Fare:</strong> KES {bookingDetails.fare}</p>
          <p><strong>Payment:</strong> {bookingDetails.payment?.amount} ({bookingDetails.payment?.method})</p>
        </div>
      )}

      {/* 📷 Hidden Canvas for QR Processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default QrScanner;
