import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import SendModal from "./modals/SendModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import ReceiveModal from "./modals/ReceiveModal";
import ScanModal from "./modals/ScanModal";
import BuySellModal from "./modals/BuySellModal";
import SwapModal from "./modals/SwapModal";
import P2PModal from "./modals/P2PModal";
import Modal from "./modals/WalletsModal";
import Loading from "react-loading";
import localforage from "localforage";
import { fetchTransactions } from "../../transactionSlice";

const CardLineChart = ({ wallet, isMobile = false }) => {
  const [walletBalance, setWalletBalance] = useState(0);
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
  const [loadingBalances, setLoadingBalances] = useState(false);

  // Chart related states
  const [activePeriod, setActivePeriod] = useState("1D");
  const [svgPath, setSvgPath] = useState("");
  const [priceData, setPriceData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState(null);

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

  const tokenImages = {
    BNB: require("../../assets/img/bnb_icon.png"),
    BTC: require("../../assets/img/btc_icon.png"),
    DOGE: require("../../assets/img/xrp_icon_.png"),
    ETH: require("../../assets/img/eth_icon.png"),
    SOL: require("../../assets/img/sol_icon.png"),
    USDT: require("../../assets/img/usdt_icon.png"),
  };
  
  const periods = ["1H", "1D", "1W", "1M", "1Y", "2Y", "ALL"];

  // Modal control functions
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
    
    setIsSendModalOpen(false);
    setIsConfirmationOpen(true);
  };

  // Fetch wallet data from localforage (consistent with CardWalletOverview)
  const fetchWalletData = useCallback(async () => {
    if (!wallet?.abbr) return;
    
    setLoadingBalances(true);
    try {
      let walletData = await localforage.getItem("encryptedWallet");
      
      if (!walletData) {
        walletData = await localforage.getItem("walletDetails");
      }
      
      if (!walletData) {
        console.error("No wallet data found in localforage");
        return;
      }

      let walletItems = [];
      
      if (walletData.walletAddresses && Array.isArray(walletData.walletAddresses)) {
        if (walletData.walletAddresses[0] && Array.isArray(walletData.walletAddresses[0].data)) {
          walletItems = walletData.walletAddresses[0].data;
        } else {
          walletItems = walletData.walletAddresses;
        }
      } else if (Array.isArray(walletData)) {
        walletItems = walletData;
      }

      const walletItem = walletItems.find(item => 
        item.symbols?.toUpperCase() === wallet.abbr
      );

      if (walletItem) {
        setWalletAddress(walletItem.address);
        setWalletPrivateKey(walletItem.private_key || "");
        
        // Fetch balance for this wallet
        const response = await fetch(
          `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${wallet.abbr.toLowerCase()}&address=${walletItem.address}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWalletBalance(parseFloat(data.data) || 0);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoadingBalances(false);
    }
  }, [wallet]);


  useEffect(() => {
    if (wallet?.abbr) {
      fetchWalletData();
    }
  }, [wallet, fetchWalletData]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet?.abbr && walletAddress) {
      // Fetch transactions when wallet or address changes
      dispatch(fetchTransactions(wallet.abbr.toLowerCase(), walletAddress));
    }
  }, [wallet, walletAddress, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (wallet?.abbr && walletAddress) {
        dispatch(fetchTransactions(wallet.abbr.toLowerCase(), walletAddress));
      }
    }, 30000); // Every 30 seconds
  
    return () => clearInterval(interval);
  }, [wallet, walletAddress, dispatch]);
  

  // Chart data fetching
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

    const intervalId = setInterval(fetchData, 60000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, [wallet, activePeriod]);

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

  // Format number function consistent with CardWalletOverview
  const formatNumber = (value) => {
    if (value === undefined || value === null) return "0";
    
    const num = Number(value);
    
    if (isNaN(num)) return value.toString();
    
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    if (num % 1 !== 0) return num.toFixed(2);
    return num.toString();
  };

  const calculateUSDEquivalent = (balance, marketPrice) => {
    const numBalance = parseFloat(balance) || 0;
    const numPrice = parseFloat(marketPrice) || 0;
    return numBalance * numPrice;
  };
  

  const usdEquivalent = calculateUSDEquivalent(walletBalance, wallet?.marketPrice);

  return (
    <div className="mt-4 text-aeonik text-white">
      <p className="font-bold text-xl">Token</p>
      <div className={`relative mt-4 flex flex-col min-w-0 break-words w-full ${!isMobile && 'mb-6'} md:shadow-lg rounded bg-black`}>
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="items-center">
            {!wallet ? (
              <div className="text-center text-gray-500 mt-4 align-center justify-center">
                <p>Getting Wallets...</p>
                <br />
                <div className="flex justify-center items-center">
                  <Loading type="spin" color="#27C499" height={30} width={30} />
                </div>
              </div>
            ) : (
              <>
                <img 
                  src={tokenImages[wallet.abbr]} 
                  alt={wallet.abbr} 
                  className="w-12 h-12 mx-auto" 
                />
                <h2 className="text-3xl text-center font-bold mb-1">
                  {formatNumber(walletBalance)} {wallet.abbr}
                </h2>
                <p className="text-xs text-center mb-4 text-blueGray-500">
                  ${formatNumber(usdEquivalent.toFixed(2))}
                </p>
                <p className="text-base font-bold font-medium mt-8 hidden md:block">
                  Current {wallet?.title} Price
                </p>
                <p className="text-xs text-blueGray-500 hidden md:block">
                  ${wallet?.marketPrice ? formatNumber(wallet.marketPrice) : '0.00'} {" "}
                  <span className={`${parseFloat(wallet?.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"} ml-4`}>
                    {wallet?.marketPricePercentage ? formatNumber(wallet.marketPricePercentage) : '0.00'}%
                  </span>
                </p>
              </>
            )}
          </div>
          
          <div className="flex-auto">
            <div className="relative h-48 md:h-64 mt-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loading type="spin" color="#27C499" height={50} width={50} />
                </div>
              ) : (
                <svg
                  viewBox="0 0 350 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-[120px]"
                  preserveAspectRatio="none"
                >
                  <g clipPath="url(#clip0_932_4270)">
                    <path
                      d={svgPath}
                      stroke="#27C499"
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
                      <stop offset="1" stopColor="#070707" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="clip0_932_4270">
                      <rect width="350" height="120" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </div>
            <div className="flex flex-wrap w-full justify-between gap-2 mt-4 overflow-x-auto">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm border-none font-medium transition-colors flex-shrink-0 ${
                    activePeriod === period
                      ? "bg-green-500 text-black"
                      : "bg-primary-color text-gray-600 hover:bg-primary-color-4 clicked:border-none"
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
                <span className="block px-1 pt-1 pb-10000000000000, overshot 101">
                  <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                  <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
                </span>
              </a>
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
        selectedWallet={wallet}
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
        selectedWallet={wallet}
      />

      <ReceiveModal
        isOpen={isReceiveModalOpen}
        onClose={closeReceiveModal}
        walletAddress={walletAddress}
        selectedWallet={wallet}
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
        selectedWallet={wallet}
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
  const { transactions, loading, error } = useSelector((state) => ({
    transactions: state.transactions?.transactions || [],
    loading: state.transactions?.loading || false,
    error: state.transactions?.error || null
  }));

  // if (error) {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-48 text-red-500">
  //       <p>Error loading transactions: {error}</p>
  //     </div>
  //   );
  // }


  return (
    <div className="block w-full text-aeonik overflow-x-auto">
      <div className="relative w-full px-4 max-w-full flex-grow flex-1 hidden md:block">
        <h3 className="font-semibold text-sm text-white">Transactions</h3>
      </div>
      {/* <div className="h-2  hidden md:block mx-4 my-2 border border-solid border-blueGray-100" /> */}
      <div className="space-y-4">
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-black my-1 rounded-my p-2 shadow-md"
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
            <p className="text-white">You have not make any transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Combined card and transactions for mobile view
const MobileWalletView = ({ wallet }) => {
  return (
    <div className="flex flex-col gap-4 max-h-screen overflow-hidden">
      <CardLineChart wallet={wallet} isMobile={true} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <CardTransactionTrack />
      </div>
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
      <div className="hidden lg:block overflow-hidden">
        <CardLineChart wallet={wallet} />
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <CardTransactionTrack/>
        </div>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
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

