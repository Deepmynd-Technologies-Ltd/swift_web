import React, { useEffect, useState, useCallback } from "react";
import Loading from "react-loading";
import localforage from "localforage";

const tokenNames = {
  BNB: "BNB BEP20",
  BTC: "Bitcoin",
  DOGE: "Doge coin",
  ETH: "Ethereum",
  SOL: "Solana",
  USDT: "USDT BEP20",
};

const tokenImages = {
  BNB: require("../../assets/img/bnb_icon_.png"),
  BTC: require("../../assets/img/bitcoin_icon.png"),
  DOGE: require("../../assets/img/xrp_icon_.png"),
  ETH: require("../../assets/img/ethereum_icon.png"),
  SOL: require("../../assets/img/solana_icon.png"),
  USDT: require("../../assets/img/usdt_icon_.png"),
};

export default function CardWalletOverview({ onSelectWallet }) {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletBalances, setWalletBalances] = useState({});
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all wallet data and store in localforage
  const fetchAllWalletData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch market data
      const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      // Get wallet addresses from localforage
      const walletDetails = await localforage.getItem('walletDetails');
      const walletAddresses = walletDetails?.walletAddresses || [];

      // Helper function to fetch balance
      const fetchBalance = async (symbol, address) => {
        if (!address) return 0;
        try {
          const balanceResponse = await fetch(
            `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${symbol}&address=${address}`
          );
          const balanceData = await balanceResponse.json();
          return balanceData.success ? balanceData.data : 0;
        } catch (error) {
          console.error(`Error fetching balance for ${symbol}:`, error);
          return 0;
        }
      };

      // Define wallet configurations
      const walletConfigs = [
        {
          symbol: 'bnb',
          abbr: "BNB",
          title: "BNB BEP20",
          marketData: data.binancecoin,
          typeImage: require("../../assets/img/bnb_icon_.png"),
        },
        {
          symbol: 'btc',
          abbr: "BTC",
          title: "Bitcoin",
          marketData: data.bitcoin,
          typeImage: require("../../assets/img/bitcoin_icon.png"),
        },
        {
          symbol: 'doge',
          abbr: "DOGE",
          title: "Doge coin",
          marketData: data.dogecoin,
          typeImage: require("../../assets/img/xrp_icon_.png"),
        },
        {
          symbol: 'eth',
          abbr: "ETH",
          title: "Ethereum",
          marketData: data.ethereum,
          typeImage: require("../../assets/img/ethereum_icon.png"),
        },
        {
          symbol: 'sol',
          abbr: "SOL",
          title: "Solana",
          marketData: data.solana,
          typeImage: require("../../assets/img/solana_icon.png"),
        },
        {
          symbol: 'usdt',
          abbr: "USDT",
          title: "USDT BEP20",
          marketData: data.tether,
          typeImage: require("../../assets/img/usdt_icon_.png"),
        },
      ];

      // Fetch all balances in parallel and construct wallet data
      const walletPromises = walletConfigs.map(async (config) => {
        const walletAddress = walletAddresses.find(w => w.symbols === config.symbol);
        const balance = await fetchBalance(config.symbol, walletAddress?.address);
        
        return {
          abbr: config.abbr,
          title: config.title,
          symbol: config.symbol,
          address: walletAddress?.address || '',
          marketPrice: config.marketData.usd,
          marketPricePercentage: config.marketData.usd_24h_change,
          equivalenceValue: balance,
          equivalenceValueAmount: (config.marketData.usd * balance),
          typeImage: config.typeImage,
          rawMarketPrice: config.marketData.usd
        };
      });

      const formattedData = await Promise.all(walletPromises);
    
      // Save to localforage
      await localforage.setItem('walletData', formattedData);
      setWallets(formattedData);
      
      // Set default selected wallet if none is selected
      if (formattedData.length > 0) {
        // First try to find BNB wallet
        const defaultWallet = formattedData.find(wallet => wallet.symbol === 'bnb');
        
        // If BNB wallet exists and no wallet is selected, set it as default
        if (defaultWallet && !selectedWallet) {
          setSelectedWallet(defaultWallet);
        } 
        // If no wallet is selected at all (including no BNB), select the first wallet
        else if (!selectedWallet) {
          setSelectedWallet(formattedData[0]);
        }
      }
      
      return formattedData;
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [selectedWallet]);

  // Initialize wallet data
  useEffect(() => {
    const initializeWalletData = async () => {
      // First try to load from localforage
      const cachedData = await localforage.getItem('walletData');
      if (cachedData) {
        setWallets(cachedData);
        setLoading(false);
      }
      
      // Then fetch fresh data
      await fetchAllWalletData();
    };
    
    initializeWalletData();
  }, [fetchAllWalletData]);

  // Set up refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        fetchAllWalletData().finally(() => setIsRefreshing(false));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchAllWalletData, isRefreshing]);

  // Notify parent when selected wallet changes
  useEffect(() => {
    if (selectedWallet) {
      onSelectWallet(selectedWallet);
    }
  }, [selectedWallet, onSelectWallet]);

  // Fetch wallet balances from API
  const fetchWalletBalances = useCallback(async () => {
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

      const balances = {};
      await Promise.all(walletItems.map(async (walletItem) => {
        try {
          if (!walletItem?.symbols || !walletItem?.address) return;
          
          const response = await fetch(
            `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${walletItem.symbols.toLowerCase()}&address=${walletItem.address}`
          );
          
          if (!response.ok) throw new Error(`Failed to fetch balance for ${walletItem.symbols}`);
          
          const data = await response.json();
          if (data.success) {
            balances[walletItem.symbols.toUpperCase()] = {
              balance: parseFloat(data.data) || 0,
              address: walletItem.address
            };
          }
        } catch (err) {
          console.error(`Error fetching balance for wallet:`, walletItem.symbols, err);
          balances[walletItem.symbols.toUpperCase()] = {
            balance: 0,
            address: walletItem.address
          };
        }
      }));
      
      setWalletBalances(balances);
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
    } finally {
      setLoadingBalances(false);
    }
  }, []);

  // Fetch balances on component mount and refresh
  useEffect(() => {
    fetchWalletBalances();
  }, [fetchWalletBalances]);

  // Refresh balances when wallets are refreshed
  useEffect(() => {
    if (!isRefreshing && !loading) {
      fetchWalletBalances();
    }
  }, [isRefreshing, loading, fetchWalletBalances]);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
  };

  const calculateUSDEquivalent = (balance, marketPrice) => {
    const numBalance = parseFloat(balance) || 0;
    const numPrice = parseFloat(marketPrice) || 0;
    return numBalance * numPrice;
  };

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

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full md:w-2/3 mb-6 rounded mx-auto bg-gradient-to-r from-blue-500 to-green-500">
      <div className="block w-full overflow-x-auto">
        <div className="flex flex-col space-y-4">
          <div className="w-full flex flex-row justify-between items-center bg-gray-100 rounded-t-lg py-3 px-4">
            <div className="text-sm font-semibold text-blueGray-700 flex-1 hidden md:block">Token</div>
            <div className="text-sm font-semibold text-blueGray-700 flex-1 text-center hidden md:block">Market Price</div>
            <div className="text-sm font-semibold text-blueGray-700 flex-1 text-right hidden md:block">USD Equivalent</div>
          </div>

          {Object.keys(tokenNames).map((token) => {
            const wallet = wallets.find(w => w.abbr === token) || {};
            const walletBalanceData = walletBalances[token] || { balance: 0 };
            const actualBalance = walletBalanceData.balance;
            const usdEquivalent = calculateUSDEquivalent(actualBalance, wallet.marketPrice);
            const isSelected = selectedWallet?.abbr === token;
            const textColorClass = isSelected ? "text-black" : "";
            const textWhiteColouredClass = isSelected ? "text-black" : "text-white";

            return (
              <div key={token} className={`rounded-my overflow-hidden`}>
                <a
                  href={`/wallet/${token}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleWalletClick(wallet);
                  }}
                  style={{
                    display: "block",
                    margin: "0.375rem 0",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "color 0.2s",
                    gap: "32px",
                  }}
                  className={`wallet-row ${isSelected ? "active" : ""}`}
                >
                  <div className="flex md:flex-row justify-between items-center h-full">
                    <div className="w-full md:w-1/3 px-6 py-3">
                      <div className="flex items-center text-left">
                        <img
                          src={tokenImages[token]}
                          alt={token}
                          className="w-12 h-12 rounded mr-4"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <span className={`text-sm font-bold hidden md:block ${textWhiteColouredClass}`}>{token}</span>
                          <span className={`text-xs block font-semibold md:mt-0 ${textColorClass}`} style={{ maxWidth: "100px" }}>
                            {tokenNames[token]}
                          </span>
                          <div className="flex items-center md:hidden w-full">
                            <span className={`text-sm ${textColorClass}`}> ${formatNumber(wallet.marketPrice) || "0.00"}</span>
                            <span className={`text-sm ml-2 ${
                              isSelected ? "text-black" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"
                            }`}>
                              {formatNumber(wallet.marketPricePercentage) || "0.0"}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`w-full md:w-1/3 px-6 h-full flex items-center justify-center hidden md:flex ${textColorClass}`}>
                      <div>
                        <span className={`text-sm ${textColorClass}`}>${formatNumber(wallet.marketPrice) || "0.00"}</span>
                        <span className={`text-sm ml-2 ${
                          isSelected ? "text-black" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"
                        }`}>
                          {formatNumber(wallet.marketPricePercentage) || "0.0"}%
                        </span>
                      </div>
                    </div>
                    <div className={`w-full md:w-1/3 px-6 py-3 text-sm text-right ${textColorClass}`}>
                      <div>
                        <span className={`text-lg font-semibold ${textWhiteColouredClass}`}>
                          {formatNumber(actualBalance) || "0"}
                        </span>
                        <span className={`text-sm block ${textColorClass}`}>
                          ${formatNumber(usdEquivalent.toFixed(2)) || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}