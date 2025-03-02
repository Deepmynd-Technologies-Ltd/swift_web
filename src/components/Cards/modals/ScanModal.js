import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import QrReader from "react-qr-scanner";

const ScanModal = ({ isOpen, onClose, setRecipientAddress, setIsSendModalOpen }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [stream, setStream] = useState(null);
  const qrReaderRef = useRef(null);

  // Check if the device is mobile or tablet
  useEffect(() => {
    const checkIfMobile = () => {
      // This regex checks for common mobile and tablet user agents
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent);
    };
    setIsMobile(checkIfMobile());
  }, []);

  // Reset error and initialize camera when modal opens
  useEffect(() => {
    let currentStream = null;
    
    if (isOpen) {
      setErrorMessage("");
      
      // Select camera based on device type
      // Use environment (back) camera for mobile/tablet, user (front) camera for desktop
      const facingMode = isMobile ? "environment" : "user";
      console.log(`Using camera facing mode: ${facingMode} for ${isMobile ? "mobile/tablet" : "desktop"}`);
      
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
        .then((mediaStream) => {
          setHasPermission(true);
          setStream(mediaStream);
          currentStream = mediaStream;
        })
        .catch((err) => {
          console.error("Camera error:", err);
          setHasPermission(false);
          setErrorMessage("Camera permission denied. Please allow camera access.");
        });
    }
    
    // Cleanup function to stop tracks when component unmounts or modal closes
    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setTorchOn(false);
    };
  }, [isOpen, isMobile]);

  // Toggle flashlight/torch (only available on mobile with back camera)
  const toggleTorch = async () => {
    try {
      if (!stream) {
        setErrorMessage("Camera not initialized yet.");
        return;
      }

      const track = stream.getVideoTracks()[0];
      if (!track) {
        setErrorMessage("Camera track not found.");
        return;
      }

      // Check if torch is supported
      if (track.getCapabilities && track.getCapabilities().torch) {
        const newTorchState = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: newTorchState }]
        });
        setTorchOn(newTorchState);
      } else {
        setErrorMessage("Torch is not supported on this device.");
      }
    } catch (error) {
      console.error("Error toggling torch:", error);
      setErrorMessage(isMobile ? 
        "Failed to toggle torch. Your device may not support this feature." : 
        "Torch is only available on mobile devices with compatible hardware.");
    }
  };

  // Handle QR code scan result
  const handleScan = (result) => {
    if (result && result.text) {
      console.log("QR Code scanned:", result.text);
      setRecipientAddress(result.text);
      onClose();
      setIsSendModalOpen(true);
    }
  };

  const handleError = (error) => {
    if (error && !errorMessage) {
      console.error("QR Scan Error:", error);
      setErrorMessage("Failed to scan QR code. Please ensure good lighting and that the QR code is visible.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10 flex justify-center items-center" 
         style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div
        className="relative p-4 z-10 shadow-lg flex flex-col items-center"
        style={{ maxWidth: "350px", width: "90%", maxHeight: "90vh", overflowY: "auto", background: "#F7FAFE", borderRadius: "24px" }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center w-full mb-4">
          <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>

        {/* Close button */}
        <button
          className="absolute top-2 text-blueGray-500 hover:text-gray-700"
          onClick={onClose}
          style={{ right: "30px" }}
        >
          <i className="fa fa-times"></i>
        </button>

        <div className="p-4 w-full flex flex-col max-w-md rounded-lg justify-center ">
          <h4 className="text-left text-lg font-semibold text-blueGray-700 mb-4">
            Scan QR Code 
            {/* {isMobile ? " (Using back camera)" : " (Using front camera)"} */}
          </h4>

          {!hasPermission ? (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg" 
                 style={{ width: "100%", height: "280px" }}>
              <p className="text-center text-gray-600">Camera permission is required to scan QR codes.</p>
              <button 
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  const facingMode = isMobile ? "environment" : "user";
                  navigator.mediaDevices.getUserMedia({ 
                    video: { 
                      facingMode: facingMode,
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    } 
                  })
                    .then((mediaStream) => {
                      setHasPermission(true);
                      setStream(mediaStream);
                    })
                    .catch(() => setErrorMessage("Camera permission denied"));
                }}
              >
                Allow Camera Access
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col justify-center items-center rounded-lg relative overflow-hidden"
              style={{ width: "100%", height: "280px", background: "rgba(118, 135, 150, 0.08)" }}
            >
              <QrReader
                ref={qrReaderRef}
                delay={300}
                onError={handleError}
                onScan={handleScan}
                facingMode={isMobile ? "environment" : "user"}
                constraints={{
                  video: {
                    facingMode: isMobile ? "environment" : "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                  }
                }}
                style={{ 
                  width: '100%',
                  height: '100%',
                }}
                ViewFinder={() => (
                  <div 
                    style={{ 
                      border: '2px solid #62a1eb', 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      width: '200px', 
                      height: '200px', 
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '12px',
                      boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                )}
              />
            </div>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
          )}

          {hasPermission && isMobile && (
            <div className="flex justify-center mt-4">
              <button
                className="h-12 w-12 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-colors duration-200 flex items-center justify-center"
                onClick={toggleTorch}
                title={torchOn ? "Turn off torch" : "Turn on torch"}
                aria-label={torchOn ? "Turn off torch" : "Turn on torch"}
              >
                <img 
                  src="https://icons.veryicon.com/png/o/object/material-design-icons-1/flashlight-16.png" 
                  alt={torchOn ? "Turn off torch" : "Turn on torch"} 
                  className="h-8 w-8"
                  style={{ filter: "invert(1)" }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ScanModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setRecipientAddress: PropTypes.func.isRequired,
  setIsSendModalOpen: PropTypes.func.isRequired,
};

export default ScanModal;