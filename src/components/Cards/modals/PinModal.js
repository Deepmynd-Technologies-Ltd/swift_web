import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Loader } from "lucide-react";

const PinModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinError, setPinError] = useState(null);

  const handlePinChange = (value, index) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 1) return;

    const newPin = [...pin];
    newPin[index] = numericValue;
    setPin(newPin);

    if (numericValue && index < 3) {
      document.getElementById(`pin-input-${index + 1}`).focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`pin-input-${index - 1}`).focus();
    }
  };

  const handleConfirm = () => {
    const pinCode = pin.join("");
    if (pinCode.length !== 4 || !/^\d+$/.test(pinCode)) {
      setPinError("PIN must be exactly 4 digits");
      return;
    }
    setPinError(null);
    onConfirm(pinCode);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className=" h-screen w-full z-10 flex justify-center items-center" 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <div
        className="relative p-8 z-10 shadow-lg flex flex-col items-center"
        style={{ maxWidth: "400px", minHeight: "90vh", width: "90%", background: "rgba(0, 0, 0, var(--tw-bg-opacity))", borderRadius: "24px" }}>
        
        {/* Handle bar */}
        <div className="flex items-center justify-center">
          <div className="bg-primary-color rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center w-full pb-4">
          <h2 className="text-xl font-bold text-white">Input Pin</h2>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-4"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>

        <h3 className="text-lg mt-16 font-bold text-center" style={{width: "300px"}}>Enter Your 4 digit PIN to Confirm</h3>
        
        {pinError && <p className="text-red-500 text-sm mb-4">{pinError}</p>}
        
        <div className="flex space-x-4 justify-between mt-16 p-8 w-full">
          {pin.map((value, index) => (
            <input
              key={index}
              id={`pin-input-${index}`}
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              value={value}
              maxLength="1"
              onChange={(e) => handlePinChange(e.target.value, index)}
              onKeyDown={(e) => handlePinKeyDown(e, index)}
              className="w-12 h-12 border border-gray-300 bg-black text-white text-center text-lg rounded-lg focus:ring focus:outline-none"
              disabled={isLoading}
              autoComplete="off"
            />
          ))}
        </div>
        
        <div className="flex justify-between" style={{width: "200px", gap: "25px"}}>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg border border-gray-300"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin mx-auto" size={18} /> : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

PinModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

export default PinModal;