import React, { useState, useEffect } from "react";
import SendModal from "./modals/SendModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import ReceiveModal from "./modals/ReceiveModal";
import ScanModal from "./modals/ScanModal";
import BuySellModal from "./modals/BuySellModal";
import SwapModal from "./modals/SwapModal";
import P2PModal from "./modals/P2PModal";

export default function CardStats({ isHidden, selectedWallet }) {
  const [hidden] = useState(isHidden);
  const [walletBalance, setWalletBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isP2PModalOpen, setIsP2PModalOpen] = useState(false);
  const [selectedWalletState, setSelectedWalletState] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("BTC");
  const [toToken, setToToken] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tokenNames = {
    BNB: "BNB BEP20",
    BTC: "Bitcoin",
    DOGE: "Doge coin",
    ETH: "Ethereum",
    SOL: "Solana",
    USDT: "USDT BEP20",
  };

  const tokenName = selectedWallet ? tokenNames[selectedWallet.abbr] : null;

  useEffect(() => {
    if (tokenName) {
      const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));
      if (walletDetails && walletDetails.walletAddresses && Array.isArray(walletDetails.walletAddresses)) {
        const activeWallet = walletDetails.walletAddresses.find((wallet) => wallet.name === tokenName);
        if (activeWallet) {
          setWalletAddress(activeWallet.address);
          setWalletPrivateKey(activeWallet.private_key);
          fetchWalletBalance(activeWallet.balance);
        }
      } else {
        console.error("No wallet details found in localStorage");
      }
    }
  }, [tokenName]);

  const fetchWalletBalance = async (address) => {
    try {
      const response = await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=btc&address=${address}`);
      const data = await response.json();
      if (data.success) {
        setWalletBalance(data.data);
      } else {
        console.error("Error fetching wallet balance:", data.message);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const closeSendModal = () => {
    setIsSendModalOpen(false);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  const closeReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };

  const closeSwapModal = () => {
    setIsSwapModalOpen(false);
  };

  const closeP2PModal = () => {
    setIsP2PModalOpen(false);
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSendToken = () => {
    if (!recipientAddress || !amount) {
      alert("Please enter recipient address and amount.");
      return;
    }
    sendTransactionToBackend();
  };

  const sendTransactionToBackend = async () => {
    const transactionData = {
      private_key: walletPrivateKey,
      from_address: walletAddress,
      to_address: recipientAddress,
      amount: parseFloat(amount),
      crypto_symbol: selectedWalletState ? selectedWalletState.abbr.toLowerCase() : selectedWallet.abbr.toLowerCase(),
    };

    try {
      const response = await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/send_transaction/?symbol=${selectedWalletState ? selectedWalletState.abbr.toLowerCase() : selectedWallet.abbr.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setIsConfirmationOpen(true);
      } else {
        alert(`Failed to send transaction: ${result.message.split('\n')[0]}`);
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("An error occurred while sending the transaction.");
    }
  };

  useEffect(() => {
    if (!walletAddress) {
      const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));
      if (walletDetails && walletDetails.walletAddresses && Array.isArray(walletDetails.walletAddresses)) {
        const ethWallet = walletDetails.walletAddresses.find((wallet) => wallet.name === "Ethereum");
        if (ethWallet) {
          setWalletAddress(ethWallet.address);
          setWalletPrivateKey(ethWallet.private_key);
          fetchWalletBalance(ethWallet.balance);
        }
      }
    }
  }, [walletAddress]);

  return (
    <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
      <div className="flex-auto p-4">
        <div className="container flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
          <div className="relative flex flex-col bg-white rounded-my shadow-lg p-4 mb-4 xl:mb-0 w-full lg:w-auto max-h-[300px] justify-center  md:items-left" style={{ maxHeight: "120px", minWidth: "220px" }}>
            <div className="relative mt-4 text-center md:text-left">
              <p className="font-semibold text-3xl text-blueGray-700">
                {hidden ? "••••••••" : `$${walletBalance || 0}.00`}
              </p>
              <p className="text-sm mt-2 text-blueGray-400 whitespace-nowrap overflow-hidden text-ellipsis"></p>
              {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Wallet address"}
              <button className="text-xs bg-primary-color-3 text-green ml-3 w-8 rounded">WS</button>
            </div>
          </div>

          <div className="relative bg-white rounded-my shadow-lg p-4 w-full lg:w-2/3" style={{ minHeight: "170px", minWidth: "320px" }}>
            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={() => setIsSendModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1 text-red-500">
                    <i className="fas fa-send text-red-500 text-2xl pt-1 mb-1 block text-center group-hover:text-red-500"></i>
                    <span className="block text-xs font-semibold text-red-500 pb-2">Send</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={() => setIsReceiveModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-receive text-2xl pt-1 mb-1 block text-center group-hover:text-green"></i>
                    <span className="block text-xs font-semibold pb-2 text-green">Receive</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={() => setIsScanModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-scan text-2xl pt-1 mb-1 block text-center group-hover:text-purple-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-purple-500">Scan</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
            </div>

            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              <div className="flex-1 group flex justify-center items-end">
                <a
                  href="#"
                  onClick={() => setIsSwapModalOpen(true)}
                  className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500"
                >
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-swap text-2xl pt-1 mb-1 block text-center group-hover:text-orange-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-orange-500">Swap</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={() => setIsBuySellModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={() => setIsP2PModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-p2p text-2xl pt-1 mb-1 block text-center group-hover:text-more-teal-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-more-teal-500">P2P</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendModal
        isOpen={isSendModalOpen}
        onClose={closeSendModal}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        amount={amount}
        setAmount={setAmount}
        walletBalance={walletBalance}
        selectedWalletState={selectedWalletState}
        selectedWallet={selectedWallet}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        tokenNames={tokenNames}
        setSelectedWalletState={setSelectedWalletState}
        setIsScanModalOpen={setIsScanModalOpen}
        handleSendToken={handleSendToken}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        setIsSendModalOpen={setIsSendModalOpen}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={closeReceiveModal}
        walletAddress={walletAddress}
        selectedWallet={selectedWallet}
      />

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        setRecipientAddress={setRecipientAddress}
        setIsSendModalOpen={setIsSendModalOpen}
      />

      <BuySellModal
        isOpen={isBuySellModalOpen}
        onClose={() => setIsBuySellModalOpen(false)}
        selectedWallet={selectedWallet}
      />

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
      />

      <P2PModal
        isOpen={isP2PModalOpen}
        onClose={() => setIsP2PModalOpen(false)}
      />
    </div>
  );
}
