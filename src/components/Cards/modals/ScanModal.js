import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const ScanModal = ({ isOpen, onClose, setRecipientAddress, setIsSendModalOpen }) => {
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div
        className="relative p-4 z-10 shadow-lg flex flex-col items-center"
        style={{ maxWidth: "350px", width: "90%", maxHeight: "90vh", overflowY: "auto", background: "#F7FAFE", borderRadius: "24px" }}
      >
        <div className="flex items-center justify-center w-full">
          <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>

        <button
          className="absolute top-2 text-blueGray-500 hover:text-gray-700"
          onClick={onClose}
          style={{ right: "30px" }}
        >
          <i className="fa fa-times"></i>
        </button>

        <div className="p-4 w-full flex flex-col max-w-md rounded-lg justify-center items-center">
          <h4 className="text-lg font-semibold text-blueGray-700">Scan QR Code</h4>

          <div
            className="flex flex-col justify-center items-center rounded-lg relative"
            style={{ width: "100%", height: "280px", background: "rgba(118, 135, 150, 0.08)" }}
          >
            <QrReader
              delay={300}
              constraints={{ facingMode: "environment" }}
              onResult={(result, error) => {
                if (result?.text) {
                  setRecipientAddress(result.text);
                  onClose();
                  setIsSendModalOpen(true);
                }
                if (error) {
                  setErrorMessage("Failed to scan QR code. Try again.");
                }
              }}
              style={{ width: "100%", height: "100%" }}
            />

            {/* Error message */}
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
          </div>

          {/* Torchlight Button */}
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
            onClick={() => {
              const video = document.querySelector("video");
              const track = video.srcObject.getVideoTracks()[0];
              const imageCapture = new ImageCapture(track);
              imageCapture.getPhotoCapabilities().then(() => {
                if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
                  track.applyConstraints({
                    advanced: [{ torch: true }]
                  });
                } else {
                  alert("Torch is available only on mobile devices.");
                }
              });
            }}
          >
            Turn on Torch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanModal;
