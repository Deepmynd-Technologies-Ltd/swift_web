// CardStats.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function CardStats({ isHidden, selectedWallet }) {
  const [hidden] = useState(isHidden);
  const [walletBalance, setWalletBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  const tokenNames = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "BNB BEP20",
    SOL: "Solana",
    DOGE: "Doge coin",
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
          fetchWalletBalance(activeWallet.address);
        }
      } else {
        console.error("No wallet details found in localStorage");
      }
    }
  }, [tokenName]);

  const fetchWalletBalance = async (address) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wallet/get_balance/?symbol=btc&address=${address}`);
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

  const handleSendClick = () => {
    setIsSendModalOpen(true);
  };

  const handleReceiveClick = () => {
    setIsReceiveModalOpen(true);
  };

  const closeSendModal = () => {
    setIsSendModalOpen(false);
  };

  const closeReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };

  const handleSendToken = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/wallet/send_token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAddress: walletAddress,
          toAddress: recipientAddress,
          amount: amount,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Token sent successfully!");
        closeSendModal();
      } else {
        console.error("Error sending token:", data.message);
      }
    } catch (error) {
      console.error("Error sending token:", error);
    }
  };

  if (!selectedWallet) {
    return <div>No wallet selected</div>;
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
      <div className="flex-auto p-4">
        <div className="container flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
          <div className="relative flex flex-col bg-white rounded-my shadow-lg p-4 mb-4 xl:mb-0 w-full lg:w-auto max-h-[300px]" style={{ maxHeight: "120px", minWidth: "220px" }}>
            <div className="relative mt-4">
              <p className="font-semibold text-3xl text-blueGray-700">
                {hidden ? `$${walletBalance}.00` : "••••••••"}
              </p>
              <p className="text-sm mt-2 text-blueGray-400 whitespace-nowrap overflow-hidden text-ellipsis"></p>
                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                <button className="text-xs bg-primary-color-3 text-green ml-3 w-8 rounded">WS</button>
            </div>
          </div>

          <div className="relative bg-white rounded-my shadow-lg p-4 w-full lg:w-2/3" style={{ minHeight: "170px", minWidth: "320px" }}>
            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={handleSendClick} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1 text-red-500">
                    <i className="fas fa-send text-red-500 text-2xl pt-1 mb-1 block text-center group-hover:text-red-500"></i>
                    <span className="block text-xs font-semibold text-red-500 pb-2">Send</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" onClick={handleReceiveClick} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-receive text-2xl pt-1 mb-1 block text-center group-hover:text-green"></i>
                    <span className="block text-xs font-semibold pb-2 text-green">Receive</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
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
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-swap text-2xl pt-1 mb-1 block text-center group-hover:text-orange-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-orange-500">Swap</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
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

      {/* Send Modal */}
      {isSendModalOpen && (
        <div className="bg-black opacity-80 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative flex flex-col p-4 gap-2 w-full max-w-md rounded-lg z-10 shadow-lg" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px",  width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <a
                className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-8"
                onClick={closeSendModal}
                style={{ right: "30px" }}
              >
                <i className="fa fa-times"></i>
              </a>
              <h2 className="text-lg font-bold mt-8">Send Token</h2>
              <h4 className="text-sm text-blueGray-500">Enter recipient’s details</h4>
              <div className="w-full">
                <label className="block text-sm font-medium font-semibold text-blueGray-700 mt-4">Recipient Address</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter recipient’s address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <a className="absolute transform text-xs bg-blue-500 text-green px-3 py-1 rounded" style={{ right: "40px", top: "10px" }}>
                    Paste
                  </a>
                  <img src={require("../../assets/img/scan_icon.png")} alt="Scan Icon" className="absolute transform" style={{ right: "10px", top: "10px", width: "24px", height: "24px" }} />
                </div>
              </div>
              <div className="w-full mt-4">
                <label className="block text-sm font-medium font-semibold text-blueGray-700">Amount</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button className="absolute transform text-xs bg-blue-500 text-green px-3 py-1 rounded" style={{ right: "10px", top: "10px" }}>
                      Max
                  </button>
                </div>
                <div className="flex items-center mt-2 justify-between">
                  <p className=" text-sm text-blueGray-500">Available: 0.1 BTC</p>
                  <p className=" text-sm text-blueGray-500">$128.73</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="bg-green-500 w-full text-white px-4 py-2 rounded-lg"
                  onClick={handleSendToken}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {isReceiveModalOpen && (
        <div className="bg-black opacity-80 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative flex flex-col p-4 gap-2 w-full max-w-md rounded-lg z-10 shadow-lg" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px",  width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <a
                className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-8"
                onClick={closeReceiveModal}
                style={{ right: "30px" }}
              >
                <i className="fa fa-times"></i>
              </a>
              <h2 className="text-lg font-bold mt-8">Receive Token</h2>
              <h4 className="text-sm text-blueGray-500">Your wallet address to receive tokens</h4>
              <div className="w-full mt-4">
                <label className="block text-sm font-medium font-semibold text-blueGray-700">Wallet Address</label>
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={walletAddress}
                    readOnly
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button
                    className="absolute transform text-xs bg-blue-500 text-white px-3 py-1 rounded"
                    style={{ right: "40px", top: "10px" }}
                    onClick={() => navigator.clipboard.writeText(walletAddress)}
                  >
                    Copy
                  </button>
                  <img
                    src={require("../../assets/img/scan_icon.png")}
                    alt="QR Code"
                    className="absolute transform"
                    style={{ right: "10px", top: "10px", width: "24px", height: "24px" }}
                  />
                </div>
              </div>
              <div className="w-full mt-4 text-center">
                <img
                  src={require("../../assets/img/scan_icon.png")}
                  alt="QR Code Large"
                  className="mx-auto"
                  style={{ width: "150px", height: "150px" }}
                />
                <p className="text-sm text-blueGray-500 mt-4">
                  Scan the QR code above to receive tokens directly to your wallet.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CardStats.defaultProps = {
  isHidden: true,
  statDescription: "Since last month",
  assets: [
    {
      title: "0.1 BTC",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
    {
      title: "2.5 ETH",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
    {
      title: "0.1 BTC",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
  ],
};

CardStats.propTypes = {
  isHidden: PropTypes.bool,
  statDescription: PropTypes.string,
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ),
};
