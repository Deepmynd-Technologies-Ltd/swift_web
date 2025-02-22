import React, { useState, useEffect, useMemo, useCallback } from "react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { QrReader as QRCodeScanner } from "react-qr-reader";
import { X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { setAddress, setPrivateKey, fetchWalletBalance } from '../../features/wallet/walletSlice';
import { addTransaction } from "../../transactionSlice";


const CardStats = ({ isHidden, selectedWallet }) => {
  const dispatch = useDispatch();

  const walletBalance = useSelector((state) => state.wallet.balance);
  const walletAddress = useSelector((state) => state.wallet.address);

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
  const [activeTab, setActiveTab] = useState('Buy');

  const tokenNames = useMemo(() => ({
    BNB: "BNB BEP20",
    BTC: "Bitcoin",
    DOGE: "Doge coin",
    ETH: "Ethereum",
    SOL: "Solana",
    USDT: "USDT BEP20",
  }), []);

  const tokenName = useMemo(() => selectedWallet ? tokenNames[selectedWallet.abbr] : null, [selectedWallet, tokenNames]);

  useEffect(() => {
    if (tokenName) {
      const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));
      if (walletDetails && walletDetails.walletAddresses && Array.isArray(walletDetails.walletAddresses)) {
        const activeWallet = walletDetails.walletAddresses.find((wallet) => wallet.name === tokenName);
        if (activeWallet) {
          dispatch(setAddress(activeWallet.address));
          dispatch(setPrivateKey(activeWallet.private_key));
          dispatch(fetchWalletBalance(activeWallet.address));
        }
      } else {
        console.error("No wallet details found in localStorage");
      }
    }
  }, [tokenName, dispatch]);

  const handleSendToken = useCallback(() => {
    if (!recipientAddress || !amount) {
      alert("Please enter recipient address and amount.");
      return;
    }

    // Simulate a successful transaction
    const transaction = {
      type: "Send",
      description: `You sent ${amount} ${selectedWalletState?.abbr || selectedWallet?.abbr} to ${recipientAddress}`,
      date: new Date().toLocaleString(),
      source: walletAddress,
      destination: recipientAddress,
      amount: amount,
      typeImage: require("../../assets/img/withdraw_icon.png"),
    };

    // Dispatch the transaction to Redux
    dispatch(addTransaction(transaction));

    // Reset form and close modal
    setRecipientAddress("");
    setAmount("");
    setIsSendModalOpen(false);
  }, [recipientAddress, amount, selectedWalletState, selectedWallet, walletAddress, dispatch]);

  const handleReceiveTransaction = useCallback(() => {
    const transaction = {
      type: "Receive",
      description: `You received ${amount} ${selectedWalletState?.abbr || selectedWallet?.abbr} from ${recipientAddress}`,
      date: new Date().toLocaleString(),
      source: recipientAddress,
      destination: walletAddress,
      amount: amount,
      typeImage: require("../../assets/img/receive_icon.png"),
    };

    // Dispatch the transaction to Redux
    dispatch(addTransaction(transaction));

    // Reset form and close modal
    setRecipientAddress("");
    setAmount("");
    setIsReceiveModalOpen(false);
  }, [recipientAddress, amount, selectedWalletState, selectedWallet, walletAddress, dispatch]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert("Copied to clipboard"))
      .catch(() => alert("Failed to copy"));
  }, []);

    // Memoized modal components
  const SendModal = React.memo(({ isOpen, onClose, walletBalance, selectedWallet, selectedWalletState, recipientAddress, setRecipientAddress, amount, setAmount, handleSendToken, isDropdownOpen, setIsDropdownOpen, tokenNames }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
        <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[70vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", height: "400px", background: "#F7FAFE", borderRadius: "24px" }}>
        <div className="flex items-center justify-center">
          <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>
        <a className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-8" onClick={onClose} style={{ right: "30px" }}>
          <i className="fa fa-times"></i>
        </a>
        <h2 className="text-lg font-bold mt-8">Send Token</h2>
        <h4 className="text-sm text-blueGray-500">Enter recipient's details</h4>

        {/* Recipient Address Input */}
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
          <div className="bg-white w-full h-10 justify-between rounded-lg" style={{ position: "absolute", top: "1px", right: "1px", maxWidth: "90px" }}>
            <button
            className="absolute transform text-xs bg-white text-green px-3 py-1 rounded"
            style={{ right: "40px", top: "10px" }}
            onClick={() => navigator.clipboard.readText().then(text => setRecipientAddress(text))}
            >
            Paste
            </button>
            <img
            src={require("../../assets/img/scan_icon_2.png")}
            alt="Scan Icon"
            className="absolute transform cursor-pointer"
            style={{ right: "10px", top: "10px", width: "24px", height: "24px" }}
            onClick={() => setIsScanModalOpen(true)}
            />
          </div>
          </div>
        </div>

        {/* Amount Input with Dropdown */}
        <div className="w-full mt-4">
          <label className="block text-sm font-medium font-semibold text-blueGray-700">Amount</label>
          <div className="relative">
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
          />
          <div className="absolute w-full" style={{ maxWidth: "90px", bottom: "1px", left: "1px" }}>
            <button
            className="text-left justify-between w-full px-3 py-2 rounded-lg text-green sm:text-base cursor-pointer transition-colors duration-200"
            style={{ backgroundColor: selectedWalletState ? "#e0f7fa" : "white" }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
            {selectedWalletState ? selectedWalletState.abbr : (selectedWallet ? selectedWallet.abbr : "Select")}
            <span className={`absolute right-0 top-2 text-green mr-2 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
          </div>
          <button
            className="absolute right-0 text-xs bg-blue-500 text-green px-3 py-1 rounded"
            onClick={() => setAmount(walletBalance)}
            style={{ bottom: "10px" }}
          >
            Max
          </button>
          </div>

          {/* Dropdown Content */}
          <div
          className="absolute overflow-hidden duration-300 ease-in-out bg-white rounded-lg shadow-sm"
          style={{ maxHeight: isDropdownOpen ? '150px' : '0', opacity: isDropdownOpen ? 1 : 0, marginTop: '2px', width: "83%", transition: "max-height 0.3s ease, opacity 0.3s ease" }}
          >
          <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: '130px' }}>
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
              src={require(`../../assets/img/${key.toLowerCase()}_icon.png`)}
              alt="Token Icon"
              className="w-10 h-10 mr-2"
              style={{ width: "20px", height: "20px" }}
              />
            </div>
            ))}
          </div>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex gap-2 mt-16">
          <button
          className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={handleSendToken}
          >
          Send
          </button>
        </div>
        </div>
      </div>
      </div>
    );
  });

  const ReceiveModal = React.memo(({ isOpen, onClose, walletAddress, selectedWallet }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative p-4 z-10 shadow-lg" style={{ top: "100px", maxWidth: "350px", height: "550px", width: "100%", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="flex items-center justify-center">
              <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
            </div>
            <a className="absolute top-2 text-blueGray-500 hover:text-gray-700" onClick={onClose} style={{ right: "30px" }}>
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

              <div className="p-4 flex flex-col justify-center items-center rounded-lg" style={{ width: "300px", minWidth: "300px", height: "300px", minHeight: "320px", background: "rgba(122, 138, 152, 0.08)" }}>
                <QRCode
                  value={walletAddress}
                  size={250}
                  level="H"
                  bgColor="rgba(118, 135, 150, 0.08)"
                  style={{ borderRadius: "8px" }}
                />
                <h4 className="block text-sm font-medium text-blueGray-700 mt-2 text-center" style={{ width: "250px" }}>{walletAddress}</h4>
              </div>
              <div className="flex items-center justify-between" style={{ width: "70%" }}>
                <a className="relative text-blue-500 flex flex-col justify-center items-center" onClick={() => copyToClipboard(walletAddress)}>
                  <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                    <img src={require("../../assets/img/copy_image_1.png")} alt="Copy" className="relative" style={{ width: "30px", height: "30px" }} />
                  </span>
                  <h3 className="text-sm text-blue-500">Copy</h3>
                </a>
                <a className="relative text-blue-500 flex flex-col justify-center items-center ml-4" onClick={() => navigator.share({ title: 'Wallet Address', text: `Here is my wallet address: ${walletAddress}` })}>
                  <span className="h-12 w-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(122, 138, 152, 0.08)" }}>
                    <img src={require("../../assets/img/share_icon_1.png")} alt="Share" className="relative" style={{ width: "30px", height: "30px" }} />
                  </span>
                  <h3 className="text-sm text-blue-500">Share</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const ScanModal = React.memo(({ isOpen, onClose, setRecipientAddress, handleError, openSendModal }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative p-4 z-10 shadow-lg" style={{ top: "180px", maxWidth: "350px", height: "400px", width: "100%", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="flex items-center justify-center">
              <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
            </div>
            <a className="absolute top-2 text-blueGray-500 hover:text-gray-700" onClick={onClose} style={{ right: "30px" }}>
              <X size={20} />
            </a>
            <div className="p-4 gap-2 w-full flex flex-col max-w-md rounded-lg justify-center items-center">
              <h4 className="text-lg font-semibold text-blueGray-700">Scan QR Code</h4>
              <div className="flex flex-col justify-center items-center rounded-lg relative" style={{ width: "300px", minWidth: "300px", height: "280px", minHeight: "280px", background: "rgba(118, 135, 150, 0.08)" }}>
                <QRCodeScanner
                  onResult={(result) => {
                    if (result?.text) {
                      setRecipientAddress(result.text);
                      onClose();
                      openSendModal();
                    }
                  }}
                  onError={handleError}
                  constraints={{ facingMode: 'environment' }}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const BuySellModal = React.memo(({ isOpen, onClose, activeTab, setActiveTab, paymentOptions }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-6 py-1 rounded-md text-sm ${activeTab === 'Buy' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setActiveTab('Buy')}
                  >
                    Buy
                  </button>
                  <button
                    className={`px-6 py-1 rounded-md text-sm ${activeTab === 'Sell' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setActiveTab('Sell')}
                  >
                    Sell
                  </button>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[70vh]">
                {paymentOptions.map((option, index) => (
                  <div
                    key={option.name}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${index !== paymentOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                    onClick={() => console.log(`Selected payment option: ${option.name}`)}
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
                    <div className="text-gray-400">→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const SwapModal = React.memo(({ isOpen, onClose, fromAmount, setFromAmount, toAmount, setToAmount, fromToken, setFromToken, toToken, setToToken }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Swap Token</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
                onClick={() => alert("Swap functionality not implemented yet")}
              >
                Swap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const P2PModal = React.memo(({ isOpen, onClose, activeTab, setActiveTab }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "left", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">P2P</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="inline-flex bg-gray-100 rounded-lg p-1">
                  <button
                    className={`px-6 py-1 rounded-md text-sm ${activeTab === 'Buy' ? 'bg-white shadow-sm' : ''}`}
                    onClick={() => setActiveTab('Buy')}
                  >
                    Buy
                  </button>
                  <button
                    className={`px-6 py-1 rounded-md text-sm ${activeTab === 'Sell' ? 'bg-white shadow-sm' : ''}`}
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
                onClick={() => alert("Create Ad functionality not implemented yet")}
              >
                Create Ad
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const ConfirmationModal = React.memo(({ isOpen, onClose, amount, token, recipientAddress }) => {
    if (!isOpen) return null;

    return (
      <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center" style={{ position: "fixed", top: "-10%", left: 0, right: 0, bottom: "40%" }}>
          <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ top: "130px", minWidth: "400px", display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 40px 40px", width: "446px", background: "#F7FAFE", borderRadius: "24px" }}>
            <div className="p-4 text-center">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold w-full text-center">Send Token</h2>
              </div>

              <div className="my-6">
                <h3 className="text-xl font-semibold text-green-500 mb-4">Rejoice!</h3>
                <p className="text-gray-600 mb-2">
                  You have sent {amount} {token} to
                </p>
                <p className="text-sm text-gray-500 break-all font-mono bg-gray-50 p-2 rounded">
                  {recipientAddress}
                </p>
              </div>

              <button
                className="bg-green-500 w-full text-white px-4 py-2 rounded-lg mt-4"
                onClick={onClose}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const paymentOptions = useMemo(() => [
    { name: 'Transak', description: 'Buy TON with cards or bank transfers instantly', icon: '💳' },
    { name: 'Mercuryo', description: 'Instant one-click purchase up to 700 EUR with no KYC', icon: '💸' },
    { name: 'Neocrypto', description: 'Instantly buy with a credit card', icon: '💳' },
    { name: 'MoonPay', description: 'Instantly buy with a credit card', icon: '🌙' },
    { name: 'Changelly', description: 'An instant swap engine', icon: '🔄' },
    { name: 'Onramp', description: `Buy ${selectedWallet?.abbr || 'crypto'} with INR easily`, icon: '💱' },
    { name: 'AvanChange', description: 'Buy with RUB credit card', icon: '💳' }
  ], [selectedWallet]);

  return (
    <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
      <div className="flex-auto p-4">
        <div className="container flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
        <div className="relative flex flex-col bg-white rounded-my shadow-lg p-4 mb-4 xl:mb-0 w-full lg:w-auto max-h-[300px] justify-center  md:items-left" style={{ maxHeight: "120px", minWidth: "220px" }}>
            <div className="relative mt-4 text-center md:text-left">
              <p className="font-semibold text-3xl text-blueGray-700">
                {isHidden ? "••••••••" : `$${walletBalance}.00`}
              </p>
              <p className="text-sm mt-2 text-blueGray-400 whitespace-nowrap overflow-hidden text-ellipsis"></p>
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
              <button className="text-xs bg-primary-color-3 text-green ml-3 w-8 rounded">WS</button>
            </div>
          </div>

          <div className="relative bg-white rounded-my shadow-lg p-4 w-full lg:w-2/3" style={{ minHeight: "170px", minWidth: "320px" }}>
            
            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex-1 group flex justify-center items-end">
                <a onClick={() => setIsSendModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1 text-red-500">
                    <i className="fas fa-send text-red-500 text-2xl pt-1 mb-1 block text-center group-hover:text-red-500"></i>
                    <span className="block text-xs font-semibold text-red-500 pb-2">Send</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a onClick={() => setIsReceiveModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-receive text-2xl pt-1 mb-1 block text-center group-hover:text-green"></i>
                    <span className="block text-xs font-semibold pb-2 text-green">Receive</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a onClick={() => setIsScanModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
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
                <a onClick={() => setIsSwapModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-swap text-2xl pt-1 mb-1 block text-center group-hover:text-orange-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-orange-500">Swap</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a onClick={() => setIsBuySellModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center items-end">
                <a onClick={() => setIsP2PModalOpen(true)} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
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
        onClose={() => setIsSendModalOpen(false)}
        walletBalance={walletBalance}
        selectedWallet={selectedWallet}
        selectedWalletState={selectedWalletState}
        recipientAddress={recipientAddress}
        setRecipientAddress={setRecipientAddress}
        amount={amount}
        setAmount={setAmount}
        handleSendToken={handleSendToken}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        tokenNames={tokenNames}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        walletAddress={walletAddress}
        selectedWallet={selectedWallet}
        copyToClipboard={copyToClipboard}
      />

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        setRecipientAddress={setRecipientAddress}
        handleError={(error) => console.error(error)}
        openSendModal={() => setIsSendModalOpen(true)}
      />

      <BuySellModal
        isOpen={isBuySellModalOpen}
        onClose={() => setIsBuySellModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paymentOptions={paymentOptions}
      />

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        fromAmount={fromAmount}
        setFromAmount={setFromAmount}
        toAmount={toAmount}
        setToAmount={setToAmount}
        fromToken={fromToken}
        setFromToken={setFromToken}
        toToken={toToken}
        setToToken={setToToken}
      />

      <P2PModal
        isOpen={isP2PModalOpen}
        onClose={() => setIsP2PModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => {
          setIsConfirmationOpen(false);
          setRecipientAddress("");
          setAmount("");
        }}
        amount={amount}
        token={selectedWalletState?.abbr || selectedWallet?.abbr}
        recipientAddress={recipientAddress}
      />
    </div>
  );
};

export default React.memo(CardStats);
