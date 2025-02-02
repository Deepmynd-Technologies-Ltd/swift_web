import React, { useState, useEffect } from "react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { QrReader as QRCodeScanner } from "react-qr-reader";
import { X } from "lucide-react";

export default function CardStats({ isHidden, selectedWallet }) {
  const [hidden] = useState(isHidden);
  const [walletBalance, setWalletBalance] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isBuySellModalOpen, setIsBuySellModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [isP2PModalOpen, setIsP2PModalOpen] = useState(false); // State for P2P modal
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("BTC");
  const [toToken, setToToken] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

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

  const closeSwapModal = () => {
    setIsSwapModalOpen(false);
  };

  const closeP2PModal = () => {
    setIsP2PModalOpen(false);
  };

  const handleScan = (data) => {
    if (data) {
      setRecipientAddress(data);
      setIsScanModalOpen(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
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

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch(() => alert("Failed to copy"));
  };

  const [activeTab, setActiveTab] = useState('Buy');

  const paymentOptions = [
    {
      name: 'Transak',
      description: 'Buy TON with cards or bank transfers instantly',
      icon: '💳'
    },
    {
      name: 'Mercuryo',
      description: 'Instant one-click purchase up to 700 EUR with no KYC',
      icon: '💸'
    },
    {
      name: 'Neocrypto',
      description: 'Instantly buy with a credit card',
      icon: '💳'
    },
    {
      name: 'MoonPay',
      description: 'Instantly buy with a credit card',
      icon: '🌙'
    },
    {
      name: 'Changelly',
      description: 'An instant swap engine',
      icon: '🔄'
    },
    {
      name: 'Onramp',
      description: `Buy ${selectedWallet?.abbr || 'crypto'} with INR easily`,
      icon: '💱'
    },
    {
      name: 'AvanChange',
      description: 'Buy with RUB credit card',
      icon: '💳'
    }
  ];


return (
  <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
    <div className="flex-auto p-4">
      <div className="container flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
        <div className="relative flex flex-col bg-white rounded-my shadow-lg p-4 mb-4 xl:mb-0 w-full lg:w-auto max-h-[300px]" style={{ maxHeight: "120px", minWidth: "220px" }}>
          <div className="relative mt-4">
            <p className="font-semibold text-3xl text-blueGray-700">
              {hidden ? "••••••••": `$${walletBalance}.00` }
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

      {/* Send Modal */}
      {isSendModalOpen && (
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-40 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative flex flex-col p-4 gap-2 w-full max-w-md z-50 rounded-lg z-10 shadow-lg" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px",  width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <div className="flex items-center justify-center">
                <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
              </div>
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
                  <img src={require("../../assets/img/scan_icon_2.png")} alt="Scan Icon" className="absolute transform bg-primary-color-4" style={{ right: "10px", top: "10px", width: "24px", height: "24px" }} />
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
                  <p className=" text-sm text-blueGray-500">Available: {walletBalance} {selectedWallet?.abbr}</p>
                  <p className=" text-sm text-blueGray-500">${(walletBalance * 1287.3).toFixed(2)}</p>
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
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative p-4 z-10 shadow-lg" style={{ top: "100px", maxWidth: "350px", height: "550px", width: "100%", background: "#F7FAFE", borderRadius: "24px" }}>
              <div className="flex items-center justify-center">
                <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
              </div>
              <a
                className="absolute top-2 text-blueGray-500 hover:text-gray-700"
                onClick={closeReceiveModal}
                style={{ right: "30px" }}
              >
                <i className="fa fa-times"></i>
              </a>
              <h2 className="text-lg font-bold">Receive Token</h2>
              <div className="p-4 gap-2 w-full flex flex-col max-w-md rounded-lg justify-center items-center">
                <div className="flex items-center justify-center mt-2">
                  <img
                    src={selectedWallet ? require(`../../assets/img/${selectedWallet.abbr.toLowerCase()}_icon.png`) : ""}
                    alt="Token Icon"
                    className="w-10 h-10 mr-2"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <h4 className="text-lg font-semibold text-blueGray-700">{selectedWallet ? selectedWallet.abbr : ""}</h4>
                </div>

                <div className="p-4 flex flex-col justify-center items-center rounded-lg " style={{ width: "300px", minWidth: "300px", height: "300px", minHeight: "320px", background: "rgba(122, 138, 152, 0.08)" }}>
                  {/* The QR Code */}
                  <QRCode
                    value={walletAddress} // The wallet address is used to generate the QR code
                    size={250} // Size of the QR code
                    level="H" // Error correction level (L, M, Q, H)
                    bgColor="rgba(118, 135, 150, 0.08)" // Background color of the QR code
                    style={{ borderRadius: "8px" }}
                  />
                  <h4 className="block text-sm font-medium text-blueGray-700 mt-2 text-center" style={{ width: "250px" }}>{walletAddress}</h4>
                </div>
                <div className="flex items-center justify-between" style={{ width: "70%" }}>
                  <a
                    className="relative text-blue-500 flex flex-col justify-center items-center"
                    onClick={() => copyToClipboard(walletAddress)}
                  >
                    <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                      <img
                        src={require("../../assets/img/copy_image_1.png")}
                        alt="Copy"
                        className="relative"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </span>
                    <h3 className="text-sm text-blue-500">Copy</h3>
                  </a>

                  <a
                    className="relative text-blue-500 flex flex-col justify-center items-center ml-4"
                    onClick={() => alert("Share functionality not implemented yet")}
                  >
                    <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                      <img
                        src={require("../../assets/img/share_icon_1.png")}
                        alt="Copy"
                        className="relative"
                        style={{ width: "30px", height: "30px" }}
                      />
                    </span>
                    <h3 className="text-sm text-blue-500">Share</h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Modal */}
      {isScanModalOpen && (
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
                  <div className="relative p-4 z-10 shadow-lg" style={{ top: "180px", maxWidth: "350px", height: "400px", width: "100%", background: "#F7FAFE", borderRadius: "24px" }}>
                    <div className="flex items-center justify-center">
                    <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
                    </div>
                    <a
                    className="absolute top-2 text-blueGray-500 hover:text-gray-700"
                    onClick={() => setIsScanModalOpen(false)}
                    style={{ right: "30px" }}
                    >
                    <i className="fa fa-times"></i>
                    </a>
                    <div className="p-4 gap-2 w-full flex flex-col max-w-md rounded-lg justify-center items-center">
                    <h4 className="text-lg font-semibold text-blueGray-700">Scan QR Code</h4>
                    <div className="flex flex-col justify-center items-center rounded-lg" style={{ width: "300px", minWidth: "300px", height: "280px", minHeight: "280px", background: "rgba(118, 135, 150, 0.08)" }}>

                  <QRCodeScanner
                    onScan={handleScan}
                    onError={handleError}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isBuySellModalOpen && (
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px",  width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="inline-flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-6 py-1 rounded-md text-sm ${
                        activeTab === 'Buy' ? 'bg-white shadow-sm' : ''
                      }`}
                      onClick={() => setActiveTab('Buy')}
                    >
                      Buy
                    </button>
                    <button
                      className={`px-6 py-1 rounded-md text-sm ${
                        activeTab === 'Sell' ? 'bg-white shadow-sm' : ''
                      }`}
                      onClick={() => setActiveTab('Sell')}
                    >
                      Sell
                    </button>
                  </div>
                  <button 
                    onClick={() => setIsBuySellModalOpen(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="overflow-y-auto max-h-[70vh]">
                  {paymentOptions.map((option, index) => (
                    <div
                      key={option.name}
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${
                        index !== paymentOptions.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      onClick={() => {
                        // Handle payment option click
                        console.log(`Selected payment option: ${option.name}`);
                        // Add your payment processing logic here
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{option.name}</h3>
                          <p className="text-gray-500 text-xs">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-gray-400">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
      )}


      {isSwapModalOpen && (
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Swap Token</h2>
                  <button 
                    onClick={closeSwapModal} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-blueGray-700 mb-2">From</label>
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter amount"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className="ml-2 p-1 border border-gray-300 rounded-lg"
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="BNB">BNB</option>
                      <option value="SOL">SOL</option>
                      <option value="DOGE">DOGE</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-blueGray-700 mb-2">To</label>
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <input
                      type="text"
                      placeholder="Enter amount"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="w-full focus:outline-none"
                    />
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className="ml-2 p-1 border border-gray-300 rounded-lg"
                    >
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                      <option value="BNB">BNB</option>
                      <option value="SOL">SOL</option>
                      <option value="DOGE">DOGE</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                <div className="text-sm text-blueGray-500 mb-4">
                  0.1% Exchange Fee
                </div>

                <button
                  className="bg-green-500 w-full text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    // Handle swap logic here
                    alert("Swap functionality not implemented yet");
                  }}
                >
                  Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* P2P Modal */}
      {isP2PModalOpen && (
        <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 1.0 }}>
          <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">P2P</h2>
                  <button 
                    onClick={closeP2PModal} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="inline-flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-6 py-1 rounded-md text-sm ${
                        activeTab === 'Buy' ? 'bg-white shadow-sm' : ''
                      }`}
                      onClick={() => setActiveTab('Buy')}
                    >
                      Buy
                    </button>
                    <button
                      className={`px-6 py-1 rounded-md text-sm ${
                        activeTab === 'Sell' ? 'bg-white shadow-sm' : ''
                      }`}
                      onClick={() => setActiveTab('Sell')}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-blueGray-700 mb-2">My Ads</h3>
                  <div className="p-3 border border-gray-300 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>1,000 USDT</span>
                      <span>1,665 NGN</span>
                    </div>
                    <div className="text-sm text-blueGray-500">30,000 - 25,000,000 NGN</div>
                    <div className="text-sm text-blueGray-500">Price per 1 USDT: 1,665 NGN</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-blueGray-700 mb-2">My Orders</h3>
                  <div className="p-3 border border-gray-300 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>1,000 USDT</span>
                      <span>1,665,000 NGN</span>
                    </div>
                    <div className="text-sm text-blueGray-500">1,665 NGN per 1 USDT</div>
                  </div>
                </div>

                <button
                  className="bg-green-500 w-full text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    // Handle create ad logic here
                    alert("Create Ad functionality not implemented yet");
                  }}
                >
                  Create Ad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
