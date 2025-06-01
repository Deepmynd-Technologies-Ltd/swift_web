import React, { useState } from "react";
import PropTypes from 'prop-types';
import { decryptData } from "views/auth/utils/storage";
import PinModal from "./PinModal";

export default function SendModal({
  isOpen,
  onClose,
  recipientAddress,
  setRecipientAddress,
  amount,
  setAmount,
  walletBalance,
  selectedWalletState,
  selectedWallet,
  isDropdownOpen,
  setIsDropdownOpen,
  tokenNames,
  setSelectedWalletState,
  setIsScanModalOpen,
  walletAddress,
  walletPrivateKey,
  fetchWalletBalance,
  setIsConfirmationOpen,
}) {
  const [showPinModal, setShowPinModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const sendTransactionToBackend = async (decryptedPrivateKey) => {
    try {
      const cryptoSymbol = selectedWalletState 
        ? selectedWalletState.abbr.toLowerCase() 
        : selectedWallet.abbr.toLowerCase();
      
      const transactionData = {
        private_key: decryptedPrivateKey,
        from_address: walletAddress,
        to_address: recipientAddress,
        amount: parseFloat(amount),
        crypto_symbol: cryptoSymbol,
      };

      const response = await fetch(
        `https://swift-api-g7a3.onrender.com/api/wallet/send_transaction/?symbol=${cryptoSymbol}`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setIsConfirmationOpen(true);
        onClose();
        
        // Refresh balance after successful transaction
        await fetchWalletBalance(walletAddress, cryptoSymbol);
      } else {
        alert(`Failed to send transaction: ${result.message.split('\n')[0]}`);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const handlePinConfirmed = async (pinCode) => {
    try {
      setIsLoading(true);
      const decryptedPrivateKey = await decryptData(walletPrivateKey, pinCode);
      
      if (!decryptedPrivateKey) {
        setError("Invalid PIN or decryption failed");
        return;
      }

      setShowPinModal(false);
      await sendTransactionToBackend(decryptedPrivateKey);
    } catch (err) {
      console.error("PIN verification error:", err);
      setError("Failed to decrypt private key. Invalid PIN?");
    } finally {
      setIsLoading(false);
    }
  };

  const validateInputs = () => {
    if (!recipientAddress) {
      setError("Please enter recipient address");
      return false;
    }

    if (!amount) {
      setError("Please enter an amount");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setError("Please enter a valid amount");
      return false;
    }

    if (!walletPrivateKey) {
      setError("Private key not available. Please try again.");
      return false;
    }

    return true;
  };

  const handleSendClick = () => {
    setError("");
    if (!validateInputs()) return;
    setShowPinModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-blueGray-600 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-40 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div
            className={`relative flex flex-col gap-2 w-full max-w-md z-50 rounded-lg shadow-lg transition-all duration-300 h-[400px]`}
            style={{
              width: "90%",
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
              padding: " 15px 35px",
              background: "#070707",
              borderRadius: "24px",
              maxHeight: "90vh",
            }}
          >
          <div className="flex items-center justify-center">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>
          
          <h2 className="text-lg font-bold text-white">Send Token</h2>
          <h4 className="text-sm text-blueGray-500">Enter recipient's details</h4>

          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>

          {/* Recipient Address Input */}
          <div className="w-full">
            <label className="block text-sm font-medium font-semibold text-white mt-4">
              Recipient Address
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter recipient's address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-primary-color block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <div className="w-full h-12 justify-between rounded-lg" style={{ position: "absolute", top: "0", right: "0", maxWidth: "90px", maxHeight: "42px" }}>
                <button
                  className="absolute transform text-xs bg-black text-green px-3 py-1 rounded"
                  style={{ right: "40px", marginTop: "10px" }}
                  onClick={() => navigator.clipboard.readText().then(text => setRecipientAddress(text))}
                >
                  Paste
                </button>
                <img
                  src={require("../../../assets/img/scan_icon_2.png")}
                  alt="Scan Icon"
                  className="absolute transform cursor-pointer"
                  style={{ right: "10px", top: "10px", width: "24px", height: "24px", background: "transparent", color: "green" }}
                  onClick={() => setIsScanModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Amount Input with Dropdown */}
          <div className="w-full mt-4">
            <label className="block text-sm font-medium font-semibold text-white">
              Amount
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-primary-color mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
              />

              {/* Token Selector */}
              <div className="absolute w-full" style={{ maxWidth: "90px", bottom: "0", left: "1px" }}>
                <button
                  className="text-left justify-between w-full px-2 py-1 rounded-lg text-green sm:text-base cursor-pointer transition-colors duration-200"
                  style={{
                    backgroundColor: selectedWalletState ? "rgba(30, 41, 59, var(--tw-bg-opacity))" : "#000906",
                    height: "40px",
                    marginBottom: "1px",
                    border: "none",
                  }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedWalletState ? selectedWalletState.abbr : (selectedWallet ? selectedWallet.abbr : "Select")}
                  <span className={`absolute right-0 top-2 text-green mr-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
              </div>
              <button
                className="absolute transform text-xs bg-black text-green px-3 py-1 rounded"
                style={{ right: "10px", marginTop: "-30px" }}
                onClick={() => setAmount(walletBalance)}
              >
                Max
              </button>
            </div>

            {/* Dropdown Content */}
            <div
              className="absolute overflow-hidden duration-300 ease-in-out bg-black shadow-sm"
              style={{
                maxHeight: isDropdownOpen ? '105px' : '0',
                opacity: isDropdownOpen ? 1 : 0,
                marginTop: '2px',
                width: "85%",
                transition: "max-height 0.3s ease, opacity 0.3s ease",
              }}
            >
              <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '130px', marginTop: "-10px" }}>
                {Object.keys(tokenNames).map((key) => (
                  <div
                    key={key}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                    onClick={() => {
                      setSelectedWalletState({ abbr: key });
                      setIsDropdownOpen(false);
                    }}
                  >
                    {key}
                    <img
                      src={require(`../../../assets/img/${key.toLowerCase()}_icon.png`)}
                      alt="Token Icon"
                      className="w-10 h-10 mr-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Balance Information */}
            <div className="flex items-center mt-2 justify-between">
              <span className="flex items-center text-sm text-blueGray-500">
                <img
                  src={require("../../../assets/img/verify_icon_2.png")}
                  alt="Available Icon"
                  className="mr-2"
                  style={{ width: "20px", height: "20px" }}
                />
                Available: {walletBalance} {selectedWalletState ? selectedWalletState.abbr : (selectedWallet ? selectedWallet.abbr : "Token")}
              </span>
              <span className="flex items-center text-sm text-blueGray-500">
                <img
                  src={require("../../../assets/img/verify_icon_2.png")}
                  alt="Available Icon"
                  className="mr-2"
                  style={{ width: "20px", height: "20px" }}
                />
                ${(walletBalance * 1287.3).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error message display */}
          {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            {/* Send Button */}
            <div className="flex gap-2 mt-4">
              <button
                className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                onClick={handleSendClick}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setIsLoading(false);
        }}
        onConfirm={handlePinConfirmed}
        isLoading={isLoading}
        transactionDetails={{
          amount: amount,
          currency: selectedWalletState?.abbr || selectedWallet?.abbr || "Token",
          recipient: recipientAddress.substring(0, 6) + "..." + recipientAddress.substring(recipientAddress.length - 4)
        }}
      />
    </>
  );
};

SendModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  recipientAddress: PropTypes.string.isRequired,
  setRecipientAddress: PropTypes.func.isRequired,
  amount: PropTypes.string.isRequired,
  setAmount: PropTypes.func.isRequired,
  walletBalance: PropTypes.number.isRequired,
  selectedWalletState: PropTypes.object,
  selectedWallet: PropTypes.object,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
  tokenNames: PropTypes.object.isRequired,
  setSelectedWalletState: PropTypes.func.isRequired,
  setIsScanModalOpen: PropTypes.func.isRequired,
  walletAddress: PropTypes.string.isRequired,
  walletPrivateKey: PropTypes.string.isRequired,
  fetchWalletBalance: PropTypes.func.isRequired,
  setIsConfirmationOpen: PropTypes.func.isRequired,
};