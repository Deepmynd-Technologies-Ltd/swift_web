import React from "react";
import PropTypes from 'prop-types';

const ContinueModal = ({ isOpen, onClose, actionType, provider, onContinue, selectedWallet, message }) => {
  if (!isOpen) return null;

  const getProviderMessage = () => {
    if (message) {
      return message; // Custom message from the transaction response
    }

    switch (provider?.name) {
      case 'Paybis':
        return 'You will be redirected to the Paybis widget to complete your transaction';
      case 'Transak':
        return 'You will be redirected to the Transak widget to complete your transaction';
      case 'Moon pay':
        return 'You are opening an external app not operated by SwiftAza';
      default:
        return 'You will be redirected to complete your transaction';
    }
  };

  const getButtonText = () => {
    switch (provider?.name) {
      case 'Paybis':
        return 'Open Paybis Widget';
      case 'Transak':
        return 'Open Transak Widget';
      case 'Moon pay':
        return `Continue to ${provider?.name}`;
      default:
        return 'Continue';
    }
  };

  return (
    <div className="transparent h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}>
      <div className=" z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative bg-black rounded-xl shadow-lg w-96 overflow-hidden"
          style={{ width: "90%", maxWidth: "400px", maxHeight: "80vh", background: "#070707", borderRadius: "24px", padding: "20px" }}
        >
          {/* Handle bar */}
          <div className="flex items-center justify-center w-full mb-4">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>
          <h2 className="text-lg font-bold mt-4 text-left text-white">{actionType}</h2>
          {/* Close button */}
          <button
            className="absolute top-4 text-white hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px", top: "40px" }}
          >
            <i className="fa fa-times"></i>
          </button>
           
          <div className="w-24 h-24 bg-primary-color-4 rounded-lg flex items-center justify-center mx-auto text-4xl" style={{maxWidth: "50px", minHeight: "50px"}}>
            {provider?.icon || '💳'}
          </div>
          <h3 className="text-2xl mt-4 font-bold text-center text-white">{provider?.name}</h3>
                     
          {/* Description */}
          <p className="text-gray-900 text-center px-6 mt-1 mb-6">
            {actionType} {provider?.name === 'Paybis' || provider?.name === 'Transak' ? 'crypto' : selectedWallet?.abbr} with cards or bank transfers<br />instantly
          </p>
                     
          {/* Warning/Information Message */}
          <p className="text-white text-lg text-center px-2 mb-8">
            {getProviderMessage()}
          </p>

          <button
            className="bg-green-500 w-full text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 mt-4"
            onClick={onContinue}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

ContinueModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  provider: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
  selectedWallet: PropTypes.object,
  message: PropTypes.string,
};

export default ContinueModal;