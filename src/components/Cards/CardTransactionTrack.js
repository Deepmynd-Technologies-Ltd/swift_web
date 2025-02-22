import React, { useState, useEffect } from "react";
import axios from "axios";
import { X as CloseIcon } from 'lucide-react';
import LoadingInterface from "../../components/Cards/LoadingInterface";
import { useSelector } from "react-redux";


// Basic Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed top-0 inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-lg overflow-auto max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Price Chart</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const CardLineChart = ({ wallet, isMobile = false }) => {
  const [activePeriod, setActivePeriod] = useState("1H");
  const [svgPath, setSvgPath] = useState("");
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState(null);

  const periods = ["1H", "1D", "1W", "1M", "1Y", "2Y", "ALL"];

  const coinIdMap = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binancecoin",
    SOL: "solana",
    DOGE: "dogecoin",
    USDT: "tether",
  };

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

    return () => {
      mounted = false;
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
    const coinId = coinIdMap[wallet.abbr].toLowerCase();
    return marketData[coinId];
  };


  const currentCoinData = getCurrentCoinData();

  return (
    <div className={`relative flex flex-col min-w-0 break-words w-full ${!isMobile && 'mb-6'} shadow-lg rounded bg-white`}>
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="items-center">
          {!wallet ? (
            <div className="text-center text-gray-500 mt-4">
              Select a Wallet
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
      </div>
    </div>
  );
};


const CardTransactionTrack = () => {
  const transactions = useSelector((state) => state.transactions.transactions);

    return (
      <div className="block w-full overflow-x-auto">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-sm text-blueGray-700">Transactions</h3>
        </div>
        <div className="h-2 mx-4 my-2 border border-solid border-blueGray-100" />
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
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
          ))}
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
      <div className="hidden md:block">
        <CardLineChart wallet={wallet} />
      </div>

      <div className="md:hidden">
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
        >
          <CardLineChart wallet={wallet} isMobile={true} />
        </Modal>
      </div>

      <div className="hidden md:block">
        <CardTransactionTrack />
      </div>
    </>
  );
};

export default CombinedComponent;