import React, { useState, useEffect } from "react";
import QrReader from "react-qr-scanner";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import bgImage from "../assets/scan.png";
import success_icon from "../assets/success_icon.png";
import fail_icon from "../assets/fail_icon.png"; // Add a fail icon
import { FaSignOutAlt } from "react-icons/fa";

const ValidateUser = () => {
  const [qrResult, setQrResult] = useState("");
  const [lastScanned, setLastScanned] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scanFailed, setScanFailed] = useState(false); // Track scan failure
  const [timeoutId, setTimeoutId] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      const storedUserName = localStorage.getItem("userName");
      setUserName(storedUserName || "admin");
    }
  }, [navigate]);

  const handleScan = (data) => {
    if (data && data.text) {
      if (data.text === lastScanned) {
        alert("Sukses! QR code sudah dipindai.");
        return;
      }

      setQrResult(data.text);
      setLastScanned(data.text);

      axios
        .post(`http://localhost:5001/api/users/validate-qr/${data.text}`)
        .then((response) => {
          if (response.data.success) {
            setIsCameraOn(false);
            setShowSuccess(true);
            setScanFailed(false); // Reset scan failure
          } else {
            setScanFailed(true); // Mark scan as failed
            alert("QR Code tidak valid!");
          }
        })
        .catch((err) => {
          setScanFailed(true); // Mark scan as failed on error
          alert("QR Code tidak terdata !");
          console.error(err);
        });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(() => {
        setShowSuccess(false);
        resetState();
      }, 3500);
      setTimeoutId(id);
    }
  };

  const handleError = (error) => {
    console.error("Error occurred while scanning QR Code:", error);
    alert("An error occurred with the QR scanner. Please try again.");
  };

  const resetState = () => {
    setQrResult("");
    setLastScanned("");
    setIsCameraOn(true);
  };

  const resetQrScan = () => {
    window.location.reload();
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "contain",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-auto">
          <div className="absolute top-5 right-4 flex items-center space-x-2">
            <div className="relative">
              <div className="flex items-center justify-center text-white rounded-full w-15 h-1">
                <span className="text-lg font-semibold">{userName}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>

          {/* Move the List Users button to the top with smaller text */}
          <div className="absolute top-5 left-5">
            <Link to="/user/users">
              <button className=" text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                List Users
              </button>
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative border-4 border-blue-500 rounded-lg shadow-lg overflow-hidden grid place-items-center">
              {isCameraOn && (
                <QrReader
                  delay={300}
                  style={{
                    width: "60%",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    zIndex: 1,
                  }}
                  onScan={handleScan}
                  onError={handleError}
                />
              )}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-blue-500 rounded-lg p-4 z-10"></div>
            </div>
          </div>

          <div className="mt-6">
            {qrResult && !scanFailed && (
              <div className="flex flex-col items-center justify-center mt-10">
                <img
                  src={success_icon}
                  alt="Success"
                  className="w-32 h-32 mb-4"
                />
                <p className="text-sm text-white">QR Code Success!</p>
              </div>
            )}
            {scanFailed && (
              <div className="flex flex-col items-center justify-center mt-10">
                <img
                  src={fail_icon} // Display failure icon
                  alt="Failure"
                  className="w-32 h-32 mb-4"
                />
                <p className="text-sm text-white">QR Code Failed!</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4 mb-6 mt-4">
            <button
              onClick={toggleCamera}
              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
            >
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button
              onClick={resetQrScan}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Reset QR Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidateUser;
