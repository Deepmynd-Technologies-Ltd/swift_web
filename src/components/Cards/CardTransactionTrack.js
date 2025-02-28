import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SendModal from "./modals/SendModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import ReceiveModal from "./modals/ReceiveModal";
import ScanModal from "./modals/ScanModal";
import BuySellModal from "./modals/BuySellModal";
import SwapModal from "./modals/SwapModal";
import P2PModal from "./modals/P2PModal";
import Modal from "./modals/WalletsModal";

const CardLineChart = ({ wallet, isMobile = false }) => {
  const [walletBalance, setWalletBalance] = useState(0); // Initialize to 0
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

  // Add state for chart data
  const [activePeriod, setActivePeriod] = useState("1D");
  const [svgPath, setSvgPath] = useState("");
  const [priceData, setPriceData] = useState(0); // Initialize to 0
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState(null); // Initialize to null

  // Get transactions from Redux store
  const transactions = useSelector((state) => state.transactions?.transactions || []);

  const tokenNames = {
    BNB: "BNB BEP20",
    BTC: "Bitcoin",
    DOGE: "Doge coin",
    ETH: "Ethereum",
    SOL: "Solana",
    USDT: "USDT BEP20",
  };

  const tokenName = wallet ? tokenNames[wallet.abbr] : null;
  
  const coinIdMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    SOL: "solana",
    DOGE: "dogecoin",
    USDT: "tether",
  };
  
  const periods = ["1H", "1D", "1W", "1M", "1Y", "2Y", "ALL"];

  // Implementation of missing functions
  const closeSendModal = () => {
    setIsSendModalOpen(false);
    setRecipientAddress("");
    setAmount("");
    setErrorMessage("");
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  const closeReceiveModal = () => {
    setIsReceiveModalOpen(false);
  };

  const closeScanModal = () => {
    setIsScanModalOpen(false);
  };

  const closeBuySellModal = () => {
    setIsBuySellModalOpen(false);
  };

  const closeSwapModal = () => {
    setIsSwapModalOpen(false);
  };

  const closeP2PModal = () => {
    setIsP2PModalOpen(false);
  };

  const handleSendToken = () => {
    // Validate inputs
    if (!recipientAddress) {
      setErrorMessage("Please enter a recipient address");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    
    if (parseFloat(amount) > parseFloat(walletBalance)) {
      setErrorMessage("Insufficient funds");
      return;
    }
    
    // Close send modal and open confirmation modal
    setIsSendModalOpen(false);
    setIsConfirmationOpen(true);
  };

  // Missing selectedWallet function/variable
  const selectedWallet = wallet;

  useEffect(() => {
    if (tokenName) {
      const walletDetails = JSON.parse(localStorage.getItem("walletDetails"));
      if (walletDetails && walletDetails.walletAddresses && Array.isArray(walletDetails.walletAddresses)) {
        const activeWallet = walletDetails.walletAddresses.find((wallet) => wallet.name === tokenName);
        if (activeWallet) {
          setWalletAddress(activeWallet.address);
          setWalletPrivateKey(activeWallet.private_key);
          fetchWalletBalance(activeWallet.address); // Fixed: passed address instead of balance
        }
      } else {
        console.error("No wallet details found in localStorage");
      }
    }
  }, [tokenName]);
  
  // Add effect for chart data
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (!wallet) return;
      
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchPriceData(wallet.abbr, activePeriod),
          fetchMarketData()
        ]);
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch data. Please try again later.');
          console.error('Error fetching data:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 60000); // Fetch data every 60 seconds

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [wallet, activePeriod]);

  const fetchWalletBalance = async (address) => {
    try {
      const response = await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${wallet?.abbr.toLowerCase() || 'btc'}&address=${address}`);
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
  
  // Functions for chart data
  const fetchMarketData = async () => {
    try {
      const response = await axios.get('https://swift-api-g7a3.onrender.com/api/wallet/');
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const fetchPriceData = async (abbr, period) => {
    setLoading(true);
    try {
      const coinId = coinIdMap[abbr];
      if (!coinId) {
        console.error("Unsupported wallet abbreviation:", abbr);
        return;
      }

      const days = getDaysFromPeriod(period);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
          },
        }
      );

      const prices = response.data.prices;
      const path = generateSmoothSVGPath(prices);
      setSvgPath(path);
      setPriceData(prices[prices.length - 1][1]);
    } catch (error) {
      console.error("Error fetching data from CoinGecko API:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysFromPeriod = (period) => {
    switch (period) {
      case "1H": return 1 / 24;
      case "1D": return 1;
      case "1W": return 7;
      case "1M": return 30;
      case "1Y": return 365;
      case "2Y": return 730;
      case "ALL": return "max";
      default: return 1;
    }
  };

  const generateSmoothSVGPath = (prices) => {
    if (!prices || prices.length === 0) return "M0 50 L350 50";

    const maxPrice = Math.max(...prices.map((price) => price[1]));
    const minPrice = Math.min(...prices.map((price) => price[1]));
    const priceRange = maxPrice - minPrice;
    const width = 350;
    const height = 100;

    const points = prices.map((price, index) => ({
      x: (index / (prices.length - 1)) * width,
      y: height - ((price[1] - minPrice) / priceRange) * height
    }));

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      const controlPoint1 = {
        x: (prevPoint.x + currentPoint.x) / 2,
        y: prevPoint.y,
      };
      const controlPoint2 = {
        x: (prevPoint.x + currentPoint.x) / 2,
        y: currentPoint.y,
      };
      path += ` C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${currentPoint.x},${currentPoint.y}`;
    }

    return path;
  };

  const getCurrentCoinData = () => {
    if (!wallet || !marketData) return null;
    const coinId = coinIdMap[wallet.abbr]?.toLowerCase();
    return coinId ? marketData[coinId] : null;
  };

  const currentCoinData = getCurrentCoinData();

  return (
    <div className={`relative flex flex-col min-w-0 break-words w-full ${!isMobile && 'mb-6'} md:shadow-lg rounded bg-white`}>
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="items-center">
          {!wallet ? (
            <div className="text-center text-gray-500 mt-4">
              Getting Wallets...
            </div>
          ) : (
            <>
              {marketData && currentCoinData && (
                <>
                  <h2 className="text-3xl text-center font-bold mb-1">
                    {currentCoinData.usd.toFixed(2)} {wallet.abbr}
                  </h2>
                  <p className="text-xs text-center mb-4 text-blueGray-500">
                    {wallet.equivalenceValueAmount}
                  </p>
                  <p className="text-base font-bold font-medium mt-8">
                    Current {wallet?.title} Price
                  </p>
                  <p className="text-xs text-blueGray-500">
                    {wallet?.equivalenceValue} {wallet?.abbr}{" "}
                    <span className={`${currentCoinData.usd_24h_change > 0 ? "text-green-500" : "text-red-500"} ml-4`}>
                      {currentCoinData.usd_24h_change.toFixed(2)}%
                    </span>
                  </p>
                </>
              )}
            </>
          )}
        </div>
        
        <div className="flex-auto">
          <div className="relative h-48 md:h-64 mt-4">
            <svg
              width="100%"
              maxWidth="350"
              height="120"
              viewBox="0 0 350 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <g clipPath="url(#clip0_932_4270)">
                <path
                  d={svgPath}
                  stroke="#006A4E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d={`${svgPath} L350 120 L0 120 Z`}
                  fill="url(#paint0_linear_932_4270)"
                  fillOpacity="0.4"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_932_4270"
                  x1="175"
                  y1="50"
                  x2="175"
                  y2="250"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00FFBC" stopOpacity="0.30" />
                  <stop offset="1" stopColor="#F7FAFE" stopOpacity="0" />
                </linearGradient>
                <clipPath id="clip0_932_4270">
                  <rect width="350" height="120" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex flex-wrap justify-start md:justify-between gap-2 mt-4 overflow-x-auto">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors flex-shrink-0 ${
                  activePeriod === period
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex mt-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6 block lg:hidden">
          <div className="flex-1 group flex justify-center items-end">
            <a href="#" onClick={(e) => {e.preventDefault(); setIsSendModalOpen(true);}} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span className="block px-1 pt-1 pb-1 text-red-500">
                <i className="fas fa-send text-red-500 text-2xl pt-1 mb-1 block text-center group-hover:text-red-500"></i>
                <span className="block text-xs font-semibold text-red-500 pb-2">Send</span>
                <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
            </a>
          </div>
          <div className="flex-1 group flex justify-center items-end">
            <a href="#" onClick={(e) => {e.preventDefault(); setIsReceiveModalOpen(true);}} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span className="block px-1 pt-1 pb-1">
                <i className="fas fa-receive text-2xl pt-1 mb-1 block text-center group-hover:text-green"></i>
                <span className="block text-xs font-semibold pb-2 text-green">Receive</span>
                <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
              </span>
            </a>
          </div>
          <div className="flex-1 group flex justify-center items-end">
            <a href="#" onClick={(e) => {e.preventDefault(); setIsBuySellModalOpen(true);}} className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
              <span className="block px-1 pt-1 pb-1">
                <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
              </span>
            </a>
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
        errorMessage={errorMessage}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        setIsSendModalOpen={setIsSendModalOpen}
        recipientAddress={recipientAddress}
        amount={amount}
        selectedWallet={selectedWallet}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={closeReceiveModal}
        walletAddress={walletAddress}
        selectedWallet={selectedWallet}
      />

      <ScanModal
        isOpen={isScanModalOpen}
        onClose={closeScanModal}
        setRecipientAddress={setRecipientAddress}
        setIsSendModalOpen={setIsSendModalOpen}
      />

      <BuySellModal
        isOpen={isBuySellModalOpen}
        onClose={closeBuySellModal}
        selectedWallet={selectedWallet}
      />

      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={closeSwapModal}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        setFromToken={setFromToken}
        setToToken={setToToken}
        setFromAmount={setFromAmount}
        setToAmount={setToAmount}
      />

      <P2PModal
        isOpen={isP2PModalOpen}
        onClose={closeP2PModal}
      />
    </div>
  );
};

const CardTransactionTrack = () => {
  const transactions = useSelector((state) => state.transactions?.transactions || []);

  return (
    <div className="block w-full overflow-x-auto">
      <div className="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 className="font-semibold text-sm text-blueGray-700">Transactions</h3>
      </div>
      <div className="h-2 mx-4 my-2 border border-solid border-blueGray-100" />
      <div className="space-y-4">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white my-1 rounded-my p-2 shadow-md"
              style={{ height: "70px", width: "100%", marginTop: "5px" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={transaction.typeImage}
                    alt={transaction.type}
                    className="w-8 h-8 rounded-full mr-4"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <span className="text-sm font-semibold text-blueGray-700">{transaction.type}</span>
                    <span className="block text-xs text-blueGray-500">
                      {transaction.description}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blueGray-700">
                    ₦{transaction.amount}
                  </div>
                  <div className="text-xs text-blueGray-500">{transaction.date}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center h-48">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-18 w-8 mt-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 2H15L21 8V22H3V2H9Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 2V8H15V2"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 13H17M7 17H13"
              />
            </svg>
            <p>You have not made any transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Combined card and transactions for mobile view
const MobileWalletView = ({ wallet }) => {
  return (
    <div className="flex flex-col gap-4">
      <CardLineChart wallet={wallet} isMobile={true} />
      <CardTransactionTrack />
    </div>
  );
};

const CombinedComponent = ({ wallet }) => {
  const [isModalOpen, setIsModalOpen] = useState(!!wallet); // Open modal if wallet is provided

  useEffect(() => {
    setIsModalOpen(!!wallet); // Open modal when wallet changes
  }, [wallet]);

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block">
        <CardLineChart wallet={wallet} />
        <CardTransactionTrack />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
          <MobileWalletView wallet={wallet} />
        </Modal>
      </div>
    </>
  );
};

export default CombinedComponent;
