import React from "react";
import PropTypes from 'prop-types';
import { QRCodeCanvas as QRCode } from "qrcode.react";

const ReceiveModal = ({ isOpen, onClose, walletAddress, selectedWallet }) => {
  if (!isOpen) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch(() => alert("Failed to copy"));
  };

  return (
    <div className="bg-blueGray-600 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative p-4 z-10 shadow-lg no-scrollbar"
          style={{
            maxWidth: "350px",
            width: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            background: "#070707",
            borderRadius: "24px",
          }}
        >
          <div className="flex items-center justify-center">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>
          <h2 className="text-lg font-bold mt-4 text-white">Receive Token</h2>
          <div className="p-4 gap-2 w-full flex flex-col max-w-md rounded-lg justify-center items-center">
            <div className="flex items-center justify-center mt-2">
              <img
                src={selectedWallet ? require(`../../../assets/img/${selectedWallet.abbr.toLowerCase()}_icon.png`) : ""}
                alt="Token Icon"
                className="w-10 h-10 mr-2"
                style={{ width: "24px", height: "24px" }}
              />
              <h4 className="text-lg font-semibold text-white">{selectedWallet ? selectedWallet.abbr : ""}</h4>
            </div>

            <div
              className="p-4 flex flex-col justify-center items-center rounded-lg bg-primary-color-4"
              style={{ width: "100%", minHeight: "300px"}}
              // #7A8A9814
            >
              <QRCode
                value={walletAddress}
                size={250}
                level="H"
                bgColor="rgba(118, 135, 150, 0.08)"
                style={{ borderRadius: "8px" }}
              />
              <h4 className="block text-sm font-medium text-blueGray-700 mt-2 text-center" style={{ width: "100%" }}>{walletAddress}</h4>
            </div>
            <div className="flex items-center justify-between" style={{ width: "70%" }}>
              <button
                className="relative text-blue-500 flex flex-col justify-center items-center"
                onClick={() => copyToClipboard(walletAddress)}
              >
                <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                  <img
                    src={require("../../../assets/img/copy_image_1.png")}
                    alt="Copy"
                    className="relative"
                    style={{ width: "30px", height: "30px" }}
                  />
                </span>
                <h3 className="text-sm text-blue-500">Copy</h3>
              </button>

              <button
                className="relative text-blue-500 flex flex-col justify-center items-center ml-4"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Wallet Address',
                      text: `Here is my wallet address: ${walletAddress}`,
                    })
                      .then(() => console.log('Successfully shared'))
                      .catch((error) => console.log('Error sharing', error));
                  } else {
                    alert('Share functionality is not supported in this browser.');
                  }
                }}
              >
                <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                  <img
                    src={require("../../../assets/img/share_icon_1.png")}
                    alt="Share"
                    className="relative"
                    style={{ width: "30px", height: "30px" }}
                  />
                </span>
                <h3 className="text-sm text-blue-500">Share</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ReceiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  walletAddress: PropTypes.string.isRequired,
  selectedWallet: PropTypes.object,
};

export default ReceiveModal;
