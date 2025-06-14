import React, { useState, useEffect, useCallback, useRef } from "react";
import SendModal from "./modals/SendModal";
import ConfirmationModal from "./modals/ConfirmationModal";
import ReceiveModal from "./modals/ReceiveModal";
import ScanModal from "./modals/ScanModal";
import BuySellModal from "./modals/BuySellModal";
import SwapModal from "./modals/SwapModal";
import P2PModal from "./modals/P2PModal";
import localforage from "localforage";

export default function CardStats({ isHidden, selectedWallet }) {
  const [hidden] = useState(isHidden);
  const [walletBalance, setWalletBalance] = useState("");
  const [portfolioBalance, setPortfolioBalance] = useState(0);
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
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef(null);

  const tokenNames = {
    BNB: "BNB BEP20",
    BTC: "Bitcoin",
    DOGE: "Doge coin",
    ETH: "Ethereum",
    SOL: "Solana",
    USDT: "USDT BEP20",
  };

  const tokenName = selectedWallet ? tokenNames[selectedWallet.abbr] : null;

  const fetchWalletBalances = useCallback(async (wallets) => {
    setIsRefreshing(true);
    try {
      if (!wallets) {
        console.error('No wallets provided');
        return {};
      }
      
      const balances = {};
      const walletsArray = Array.isArray(wallets) ? wallets : [wallets];
      let totalBalance = 0;
      
      let prices = {};
      try {
        const priceResponse = await fetch(
          'https://swift-api-g7a3.onrender.com/api/wallet/'
        );
        
        if (!priceResponse.ok) {
          throw new Error('Failed to fetch coin prices');
        }
        
        const priceData = await priceResponse.json();
        
        prices = {
          bnb: priceData.binancecoin?.usd || 0,
          btc: priceData.bitcoin?.usd || 0,
          doge: priceData.dogecoin?.usd || 0,
          eth: priceData.ethereum?.usd || 0,
          sol: priceData.solana?.usd || 0,
          usdt: priceData.tether?.usd || 1,
        };
      } catch (priceError) {
        console.error("Error fetching prices:", priceError);
        prices = {
          bnb: 0,
          btc: 0,
          doge: 0,
          eth: 0,
          sol: 0,
          usdt: 1,
        };
      }
      
      await Promise.all(walletsArray.map(async (wallet) => {
        try {
          if (!wallet?.symbols || !wallet?.address) {
            console.warn('Invalid wallet format:', wallet);
            return;
          }
          
          const symbolLower = wallet.symbols.toLowerCase();
          const response = await fetch(
            `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${symbolLower}&address=${wallet.address}`
          );
          
          if (!response.ok) {
            throw new Error(`Failed to fetch balance for ${wallet.symbols}`);
          }
          
          const data = await response.json();
          if (data.success) {
            const balance = parseFloat(data.data) || 0;
            balances[wallet.address] = data.data;
            
            const usdValue = balance * (prices[symbolLower] || 0);
            totalBalance += usdValue;
            
            if (wallet.address === walletAddress || (selectedWallet && wallet.symbols === selectedWallet.abbr)) {
              setWalletBalance(data.data);
            }
          }
        } catch (err) {
          console.error(`Error fetching balance for wallet:`, wallet, err);
        }
      }));
      
      setPortfolioBalance(prev => {
        return totalBalance > 0 ? totalBalance.toFixed(2) : prev;
      });
      
      return balances;
    } catch (error) {
      console.error("Error fetching balances:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [walletAddress, selectedWallet]);

  useEffect(() => {
    const setupRefreshInterval = () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      refreshIntervalRef.current = setInterval(async () => {
        try {
          const walletData = await localforage.getItem("encryptedWallet") || 
                           await localforage.getItem("walletDetails");
          
          if (walletData) {
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
            
            if (walletItems.length > 0) {
              await fetchWalletBalances(walletItems);
            }
          }
        } catch (error) {
          console.error("Error during refresh:", error);
        }
      }, 30000);
    };

    setupRefreshInterval();
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchWalletBalances]);

  useEffect(() => {
    async function checkStorage() {
      const pinData = await localforage.getItem('walletPin');
      const walletData = await localforage.getItem('encryptedWallet');
      console.log('Stored PIN:', pinData ? 'Available' : 'Not available');
      console.log('Stored Wallet:', walletData ? 'Available' : 'Not available');
    }
    checkStorage();
  }, []);

  useEffect(() => {
    async function fetchWalletDetails() {
      if (!tokenName) return;
      
      setLoadingWallet(true);
      setErrorMessage("");
      
      try {
        let walletData = await localforage.getItem("encryptedWallet");
        
        if (!walletData) {
          walletData = await localforage.getItem("walletDetails");
        }
        
        if (!walletData) {
          console.error("No wallet data found in localforage");
          setErrorMessage("No wallet data found");
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
        } else {
          console.error("Invalid wallet data format");
          setErrorMessage("Invalid wallet data format");
          return;
        }
        
        const activeWallet = walletItems.find(wallet => {
          const walletSymbol = wallet.symbols?.toUpperCase();
          const selectedSymbol = selectedWallet?.abbr?.toUpperCase();
          const walletNameMatch = wallet.name === tokenName;
          if (selectedSymbol === 'DOGE') {
            return walletSymbol === 'DOGE';
          } else {
            const symbolMatch = walletSymbol === selectedSymbol;
            return walletNameMatch || symbolMatch;
          }
        });
        
        if (activeWallet) {
          setWalletAddress(activeWallet.address);
          setWalletPrivateKey(activeWallet.private_key);
          
          const symbol = activeWallet.symbols || selectedWallet?.abbr?.toLowerCase();
          await fetchWalletBalance(activeWallet.address, symbol);
        } else {
          setErrorMessage(`Could not find wallet for ${tokenName}`);
        }
        
        await fetchWalletBalances(walletItems);
      } catch (error) {
        setErrorMessage("Error loading wallet data");
      } finally {
        setLoadingWallet(false);
      }
    }
    
    fetchWalletDetails();
  }, [tokenName, selectedWallet, fetchWalletBalances]);

  const fetchWalletBalance = async (address, symbol) => {
    if (!address || !symbol) {
      console.error("Address or symbol missing for balance fetch");
      return;
    }
    
    try {
      const response = await fetch(
        `https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=${symbol.toLowerCase()}&address=${address}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch balance`);
      }
      
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
    setRecipientAddress("");
    setAmount("");
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

  if (errorMessage) {
    return (
      <div className="relative text-aeonik flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
        <div className="flex-auto p-4 w-full text-center">
          <p className="text-red-500">{errorMessage}</p>
          <button 
            className="mt-4 bg-green-500 text-white font-semibold p-2 rounded-my"
            onClick={() => setErrorMessage("")}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-aeonik flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px] items-center justify-center">
      <div className="flex-auto p-4 w-full">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
          
          <div
            className="bg-black rounded-my shadow-lg p-4 w-full lg:w-auto flex flex-col items-center mx-auto relative"
            style={{ maxHeight: "120px", maxWidth: "220px", minWidth: "220px" }}
          >
            <div className="mt-2 text-center lg:text-left w-full">
              <p className="font-semibold text-2xl lg:text-3xl text-white">
                {hidden ? "••••••••" : `$${portfolioBalance || 0}`}
              </p>
              <div className="flex justify-center lg:justify-start items-center mt-2 text-sm text-blueGray-400 whitespace-nowrap">
                {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Wallet address"}
                <button className="text-xs bg-blueGray-700 text-green ml-3 w-8 rounded">WS</button>
              </div>
            </div>
          </div>

          <div className="bg-black rounded-my shadow-lg p-4 w-full lg:w-2/3 min-h-[150px] mx-auto md:mx-0">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 flex w-full justify-between items-center" style={{ padding: "2px 7%"}}>
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

      {isSendModalOpen && (
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
          walletAddress={walletAddress}
          walletPrivateKey={walletPrivateKey}
          fetchWalletBalance={fetchWalletBalance}
          setIsConfirmationOpen={setIsConfirmationOpen}
        />
      )}

      {isConfirmationOpen && (
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={closeConfirmationModal}
          setIsSendModalOpen={setIsSendModalOpen}
        />
      )}

      {isReceiveModalOpen && (
        <ReceiveModal
          isOpen={isReceiveModalOpen}
          onClose={closeReceiveModal}
          walletAddress={walletAddress}
          selectedWallet={selectedWallet}
        />
      )}

      {isScanModalOpen && (
        <ScanModal
          isOpen={isScanModalOpen}
          onClose={() => setIsScanModalOpen(false)}
          setRecipientAddress={setRecipientAddress}
          setIsSendModalOpen={setIsSendModalOpen}
        />
      )}

      {isBuySellModalOpen && (
        <BuySellModal
          isOpen={isBuySellModalOpen}
          onClose={() => setIsBuySellModalOpen(false)}
          selectedWallet={selectedWallet}
        />
      )}

      {isSwapModalOpen && (
        <SwapModal
          isOpen={isSwapModalOpen}
          onClose={closeSwapModal}
          selectedWallet={selectedWallet}
          walletBalance={walletBalance}
          walletAddress={walletAddress}
          tokenNames={tokenNames}
        />
      )}

      {isP2PModalOpen && (
        <P2PModal
          isOpen={isP2PModalOpen}
          onClose={closeP2PModal}
        />
      )}
    </div>
  ); 
}