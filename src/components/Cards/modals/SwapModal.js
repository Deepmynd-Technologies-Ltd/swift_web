import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { X, ChevronDown, Loader } from "lucide-react";
import localforage from "localforage";
import { decryptData } from "views/auth/utils/storage";
import PinModal from "./PinModal";

const SwapModal = ({ 
  isOpen, 
  onClose, 
  selectedWallet, 
  walletBalance,
  walletAddress,
  tokenNames
}) => {
  const [fromToken, setFromToken] = useState(selectedWallet?.abbr || "BTC");
  const [toToken, setToToken] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromAddress, setFromAddress] = useState(walletAddress || "");
  const [toAddress, setToAddress] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState(null);
  const [slippage, setSlippage] = useState(0.5);
  const [walletData, setWalletData] = useState(null);
  const [walletPrivateKey, setWalletPrivateKey] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [isReadyToSwap, setIsReadyToSwap] = useState(false);

  // Token data with dynamic balances
  const tokenData = {
    BTC: { name: "Bitcoin", balance: fromToken === "BTC" ? walletBalance : "0.0" },
    ETH: { name: "Ethereum", balance: fromToken === "ETH" ? walletBalance : "0.0" },
    BNB: { name: "BNB BEP20", balance: fromToken === "BNB" ? walletBalance : "0.0" },
    DOGE: { name: "Doge coin", balance: fromToken === "DOGE" ? walletBalance : "0.0" },
    SOL: { name: "Solana", balance: fromToken === "SOL" ? walletBalance : "0.0" },
    USDT: { name: "USDT BEP20", balance: fromToken === "USDT" ? walletBalance : "0.0" },
  };

  // Load wallet data on component mount
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        let data = await localforage.getItem("encryptedWallet");
        if (!data) {
          data = await localforage.getItem("walletDetails");
        }
        
        if (!data) {
          console.error("No wallet data found in localforage");
          return;
        }
        
        setWalletData(data);
      } catch (err) {
        console.error("Error loading wallet data:", err);
      }
    };
    
    loadWalletData();
  }, []);

  // Update fromToken when selectedWallet changes
  useEffect(() => {
    if (selectedWallet?.abbr) {
      setFromToken(selectedWallet.abbr);
    }
  }, [selectedWallet]);

  // Set the from and to addresses based on selected tokens
  useEffect(() => {
    if (!walletData || !fromToken || !toToken) return;

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
      return;
    }

    // Find the wallet that matches the fromToken symbol
    const fromWallet = walletItems.find(wallet => 
      wallet.symbols?.toUpperCase() === fromToken.toUpperCase()
    );

    if (fromWallet) {
      setFromAddress(fromWallet.address);
      setWalletPrivateKey(fromWallet.private_key);
    } else {
      setFromAddress(walletAddress || "");
    }

    // Set to address based on toToken
    const toWallet = walletItems.find(wallet => 
      wallet.symbols?.toUpperCase() === toToken.toUpperCase()
    );
    setToAddress(toWallet?.address || "");
  }, [fromToken, toToken, walletData, walletAddress]);

  const handleTokenSelect = (token, isFromToken) => {
    if (isFromToken) {
      setFromToken(token);
      setShowFromDropdown(false);
      setFromAmount("");
      setToAmount("");
      setQuoteData(null);
    } else {
      setToToken(token);
      setShowToDropdown(false);
      setToAmount("");
      setQuoteData(null);
    }
  };

  const handleSwitchTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setQuoteData(null);
  };

  const handleMaxAmount = () => {
    setFromAmount(tokenData[fromToken].balance);
  };

    // Fetch swap quote when fromAmount changes
    // useEffect(() => {
    //   if (fromAmount && parseFloat(fromAmount) > 0 && fromToken !== toToken) {
    //     const debounceTimer = setTimeout(() => {
    //       fetchSwapQuote();
    //     }, 1000);

    //     return () => clearTimeout(debounceTimer);
    //   } else {
    //     setToAmount("");
    //     setQuoteData(null);
    //   }
    // }, [fromAmount, fromToken, toToken]);

  const handleButtonClick = async () => {
    if (fromAmount && !quoteData) {
      try {
        await fetchSwapQuote();
        setIsReadyToSwap(true); // Only enable swap after successful quote
      } catch (error) {
        setError("Failed to get swap quote");
      } finally {
      }
    } else {
      // Second click - execute swap
      await executeSwap();
      setIsReadyToSwap(false);
    }
  };

  const fetchSwapQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const baseRequestData = {
        from_symbol: fromToken,
        to_symbol: toToken,
        amount: fromAmount,
        slippage: slippage,
      };
      
      if (fromAddress) baseRequestData.from_address = fromAddress;
      if (toAddress) baseRequestData.to_address = toAddress || fromAddress;
      
      if (walletData) {
        baseRequestData.from_token = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
        baseRequestData.to_token = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
      }

      const response = await fetch(
        `https://swift-api-g7a3.onrender.com/api/wallet/swap/quote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(baseRequestData),
        }
      );

      const data = await response.json();
      
      if (data.data) {
        setQuoteData(data.data);
        
        if (data.data.expected_output) {
          setToAmount(data.data.expected_output || "0");
        } else if (data.data.estimate && data.data.estimate.toAmount) {
          const toTokenDecimals = data.data.action?.toToken?.decimals || 18;
          const toAmountHuman = (parseFloat(data.data.estimate.toAmount) / 10**toTokenDecimals).toFixed(8);
          setToAmount(toAmountHuman);
        }
      } else {
        const errorMessage = data.message || "Failed to get swap quote";
        setError(errorMessage);
        console.error(errorMessage);
        setToAmount("");
      }
    } catch (err) {
      setError("Network error while fetching swap quote");
      console.error("Swap quote error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const performSwap = async (decryptedPrivateKey = null) => {
    if (!quoteData || !fromAmount || !toAmount) {
      setError("Missing required data for swap");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        from_symbol: fromToken,
        to_symbol: toToken,
        amount: fromAmount,
        slippage: slippage,
      };
      
      if (fromAddress) requestData.from_address = fromAddress;
      if (toAddress) requestData.to_address = toAddress || fromAddress;
      
      if (decryptedPrivateKey) {
        requestData.private_key = decryptedPrivateKey;
        requestData.gas_multiplier = 1.1;
      }
      
      if (quoteData.quote_id) {
        requestData.quote_id = quoteData.quote_id;
        requestData.provider = "lifi";
      }

      const endpoint = decryptedPrivateKey 
        ? "http://127.0.0.1:8000/api/wallet/swap/" 
        : "https://swift-api-g7a3.onrender.com/api/wallet/swap/";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Swap executed successfully!");
        onClose();
      } else {
        setError(data.message || "Swap execution failed");
      }
    } catch (err) {
      setError("Network error while executing swap");
      console.error("Swap execution error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinConfirmed = async (pinCode) => {
    try {
      setIsLoading(true);
      const decryptedPrivateKey = await decryptData(walletPrivateKey, pinCode);
      
      if (!decryptedPrivateKey) {
        setError("Invalid PIN or decryption failed");
        return;
      }

      setShowPinModal(false);
      await performSwap(decryptedPrivateKey);
    } catch (err) {
      console.error("PIN verification error:", err);
      setError("Failed to decrypt private key. Invalid PIN?");
    } finally {
      setIsLoading(false);
    }
  };
 
  // Update your executeSwap function
  const executeSwap = async () => {    
    if (!quoteData || !fromAmount || !toAmount) {
      setError("Please enter a valid amount");
      return;
    }
  
    if (walletPrivateKey) {
      setShowPinModal(true);
    } else {
      await performSwap();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-blueGray-600 h-screen w-full z-10 flex justify-center items-center" 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div
        className="relative p-8 z-10 shadow-lg flex flex-col items-center"
        style={{ maxWidth: "400px", width: "90%", background: "rgba(0, 0, 0, var(--tw-bg-opacity))", borderRadius: "24px" }}>
        
        {/* Handle bar */}
        <div className="flex items-center justify-center">
          <div className="bg-primary-color rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center w-full pb-4">
          <h2 className="text-xl font-bold text-white">Swap Token</h2>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700 mt-12"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        {/* From Token Section */}
        <div className="w-full bg-primary-color p-8 rounded-lg mb-2">
          <div className="text-sm text-gray-500 mb-2">From</div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white">
                {tokenData[fromToken]?.name || tokenNames[fromToken] || fromToken}
              </span>
              <span className="text-gray-500 ml-2">
                ({tokenData[fromToken]?.balance || "0.0"})
              </span>
            </div>
            <div className="relative">
              <button 
                className="flex items-center bg-gray-200 px-3 py-1 rounded-lg font-small text-white"
                onClick={() => setShowFromDropdown(!showFromDropdown)}
              >
                <span className="font-medium mr-1 text-white">{fromToken}</span>
                <ChevronDown size={16} />
              </button>
              {showFromDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-black text-white rounded-lg no-scrollbar shadow-lg z-10" style={{ maxHeight: "100px", overflow: "auto"}}>
                  {Object.keys(tokenData).map((token) => (
                    <div
                      key={token}
                      className="px-4 py-2 hover:bg-dark-mode-3 cursor-pointer flex justify-between"
                      onClick={() => handleTokenSelect(token, true)}
                    >
                      <span>{token}</span>
                      {fromToken === token && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Input field with Max button */}
          <div className="flex relative">
            <input
              type="text"
              placeholder="Enter an amount here"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="block w-full bg-black px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
            />
            <button
              className="absolute transform text-xs bg-primary-color text-green px-3 py-1 rounded"
              style={{ right: "10px", marginTop: "10px" }}
              onClick={handleMaxAmount}
              disabled={isLoading}
            >
              Max
            </button>
          </div>
        </div>
        
        {/* Switch Button */}
        <div className="relative w-full flex justify-center" style={{ height: "1px", marginTop: "6px", marginBottom: "12px" }}>
          <button 
            className="absolute bg-green-500 text-white text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center" 
            style={{ top: "-20px" }}
            onClick={fetchSwapQuote}
            disabled={isLoading}
          >
            ⥯
          </button>
        </div>
        
        {/* To Token Section */}
        <div className="w-full bg-primary-color p-8 rounded-lg mb-4">
          <div className="text-sm text-gray-500 mb-2">To</div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-white">
                {tokenData[toToken]?.name || tokenNames[toToken] || toToken}
              </span>
              <span className="text-gray-500 ml-2">
                ({tokenData[toToken]?.balance || "0.0"})
              </span>
            </div>
            <div className="relative">
              <button 
                className="flex items-center bg-gray-200 px-3 py-1 rounded-lg text-white"
                onClick={() => setShowToDropdown(!showToDropdown)}
                disabled={isLoading}
              >
                <span className="font-medium mr-1">{toToken}</span>
                <ChevronDown size={16} />
              </button>
              {showToDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-black text-white rounded-lg no-scrollbar shadow-lg z-10" style={{ maxHeight: "100px", overflow: "auto"}}>
                  {Object.keys(tokenData).filter(token => token !== fromToken).map((token) => (
                    <div
                      key={token}
                      className="px-4 py-2 hover:bg-dark-mode-3 cursor-pointer flex justify-between"
                      onClick={() => handleTokenSelect(token, false)}
                    >
                      <span>{token}</span>
                      {toToken === token && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Output field */}
          <input
            type="text"
            placeholder={isLoading ? "Calculating..." : "Amount to receive"}
            value={toAmount}
            readOnly
            className="w-full bg-black rounded-lg py-3 px-4 focus:outline-none"
          />
        </div>

        {/* Exchange Fee */}
        <div className="w-full text-left mb-4">
          <span className="inline-flex items-center text-sm text-blueGray-500">
            <img
              src={require("../../../assets/img/verify_icon_2.png")}
              alt="Available Icon"
              className="mr-2"
              style={{ width: "20px", height: "20px" }}
            />
            {slippage}% Exchange Fee
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full text-center mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Swap Button */}
        <button
          className="bg-green-500 text-white w-full text-dark-mode-1 px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
          onClick={handleButtonClick}
          disabled={isLoading || isFetchingQuote || !fromAmount || !toAmount || (isReadyToSwap && !quoteData)}
        >
          {isFetchingQuote ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Calculating Amount to receive...
            </>
          ) : isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Processing Swap...
            </>
          ) : !fromAmount ? (
            "Input amount to swap "
          ) : fromAmount && !quoteData ? (
            "Get Amount to be Recieve"
          ) : isReadyToSwap ? (
            "Confirm Swap"
          ) : (
            "Null"
          )}
        </button>
      </div>

      {/* Pin Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => {
          console.log("Closing PIN modal");
          setShowPinModal(false);
        }}
        onConfirm={handlePinConfirmed}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SwapModal;