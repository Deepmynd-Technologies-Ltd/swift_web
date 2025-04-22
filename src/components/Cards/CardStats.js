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
    <div className="relative text-aeonik flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
      <div className="flex-auto p-4 w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
          
          {/* Wallet Balance Box */}
          <div
            className="bg-black rounded-my shadow-lg p-4 w-full lg:w-auto flex flex-col items-center mx-auto"
            style={{ maxHeight: "120px", maxWidth: "220px", minWidth: "220px" }}
          >
                  <div className="mt-2 text-center lg:text-left w-full">
                    <p className="font-semibold text-2xl lg:text-3xl text-white">
                      {hidden ? "••••••••" : `$${walletBalance || 0}.00`}
                    </p>
                    <div className="flex justify-center lg:justify-start items-center mt-2 text-sm text-blueGray-400 whitespace-nowrap">
                      {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Wallet address"}
                      <button className="text-xs bg-blueGray-700 text-green ml-3 w-8 rounded">WS</button>
                    </div>
                  </div>
                </div>
                <div className="bg-black rounded-my shadow-lg p-4 w-full lg:w-2/3 min-h-[150px] mx-auto md:mx-0">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 flex w-full justify-between items-center" style={{ padding: "2px 7%"}}>
                  {/* Top Actions */}
              {[
                { label: "Send", icon: "fa-send", color: "text-red-500", onClick: () => setIsSendModalOpen(true) },
                { label: "Receive", icon: "fa-receive", color: "text-green", onClick: () => setIsReceiveModalOpen(true) },
                { label: "Scan", icon: "fa-scan", color: "text-purple-500", onClick: () => setIsScanModalOpen(true) },
              ].map(({ label, icon, color, onClick }, index) => (
                <div key={index} className="flex justify-center items-end group">
                  <a onClick={onClick} className="flex flex-col items-center w-full text-gray-400 hover:text-indigo-500 cursor-pointer">
                    <i className={`fas ${icon} text-2xl mb-1 ${color}`}></i>
                    <span className={`text-xs font-semibold ${color}`}>{label}</span>
                    <span className="w-5 h-1 bg-transparent group-hover:bg-indigo-500 rounded-full mt-1"></span>
                  </a>
                </div>
              ))}
            </div>
  
            {/* Bottom Actions */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 mt-4 flex w-full justify-between items-center" style={{ padding: "2px 7%"}}>
              {[
                { label: "Swap", icon: "fa-swap", color: "text-orange-500", onClick: () => setIsSwapModalOpen(true) },
                { label: "Buy & Sell", icon: "fa-bAs", color: "text-lightBlue-500", onClick: () => setIsBuySellModalOpen(true) },
                { label: "P2P", icon: "fa-p2p", color: "text-more-teal-500", onClick: () => setIsP2PModalOpen(true) },
              ].map(({ label, icon, color, onClick }, index) => (
                <div key={index} className="flex justify-center items-end group">
                  <a onClick={onClick} className="flex flex-col items-center w-full text-gray-400 hover:text-indigo-500 cursor-pointer">
                    <i className={`fas ${icon} text-2xl mb-1 ${color}`}></i>
                    <span className={`text-xs font-semibold ${color}`}>{label}</span>
                    <span className="w-5 h-1 bg-transparent group-hover:bg-indigo-500 rounded-full mt-1"></span>
                  </a>
                </div>
              ))}
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
