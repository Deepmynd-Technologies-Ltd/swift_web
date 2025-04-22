import React from "react";
import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onClose, setIsSendModalOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-blueGray-600 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-40 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative flex flex-col p-4 gap-2 w-full max-w-md z-50 rounded-lg shadow-lg transition-all duration-300"
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            minWidth: "300px",
            width: "90%",
            background: "#070707",
            borderRadius: "24px",
            padding: "20px",
          }}
        >
          <div className="flex items-center justify-center">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-12"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>

          <h2 className="text-lg font-bold mt-8 text-left text-black">Send Token</h2>
          <img
            src={require("../../../assets/img/verify_icon_2.png")}
            alt="Rejoice Icon"
            className="relative item-center mx-auto"
            style={{ width: "150px", height: "150px" }}
          />
          <h3 className="text-lg text-center font-bold" style={{ lineHeight: "29px", color: "#9A7CF8" }}>Rejoice!</h3>
          <p className="text-sm text-center text-blueGray-500">You have sent 0.01 BTC to <br /><strong>0x473hfhyskjeyhden75hdgws73</strong></p>
          <button
            className="bg-green-500 w-full text-dark-mode-1 px-4 py-2 rounded-lg hover:bg-green-500 transition-colors duration-200 mt-4"
            onClick={() => {
              onClose();
              setIsSendModalOpen(true);
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setIsSendModalOpen: PropTypes.func.isRequired,
};

export default ConfirmationModal;
