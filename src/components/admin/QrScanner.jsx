import { useState, useRef, useEffect } from "react";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      setScanResult("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-semibold mb-4">QR Code Scanner</h2>
      <video ref={videoRef} autoPlay className="w-full max-w-sm border rounded-lg shadow-md" />
      
      {scanResult && (
        <div className="mt-6 p-4 border rounded-lg shadow-md w-full max-w-sm bg-gray-100">
          <p className="text-lg font-semibold">Scan Result:</p>
          <p className="text-gray-700 break-all">{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
