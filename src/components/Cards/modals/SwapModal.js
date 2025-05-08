import React, { useState, useEffect } from "react";
import { X, ChevronDown, Loader } from "lucide-react";

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
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState(null);
  const [slippage, setSlippage] = useState(0.5); // Default slippage

  // Token data with dynamic balances
  const tokenData = {
    BTC: { name: "Bitcoin", balance: fromToken === "BTC" ? walletBalance : "0.0" },
    ETH: { name: "Ethereum", balance: fromToken === "ETH" ? walletBalance : "0.0" },
    BNB: { name: "BNB BEP20", balance: fromToken === "BNB" ? walletBalance : "0.0" },
    DOGE: { name: "Doge coin", balance: fromToken === "DOGE" ? walletBalance : "0.0" },
    SOL: { name: "Solana", balance: fromToken === "SOL" ? walletBalance : "0.0" },
    USDT: { name: "USDT BEP20", balance: fromToken === "USDT" ? walletBalance : "0.0" },
  };

  // Update fromToken when selectedWallet changes
  useEffect(() => {
    if (selectedWallet?.abbr) {
      setFromToken(selectedWallet.abbr);
    }
  }, [selectedWallet]);

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
  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0 && fromToken !== toToken) {
      const debounceTimer = setTimeout(() => {
        fetchSwapQuote();
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      setToAmount("");
      setQuoteData(null);
    }
  }, [fromAmount, fromToken, toToken]);

  const fetchSwapQuote = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://swift-api-g7a3.onrender.com/api/wallet/swap/quote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from_symbol: fromToken,
            to_symbol: toToken,
            amount: parseFloat(fromAmount),
            from_address: walletAddress,
            to_address: walletAddress,
            slippage: slippage,
            provider: "paybis"
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setQuoteData(data.data);
        setToAmount(data.data.expected_output || "0");
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

  const executeSwap = async () => {
    if (!quoteData || !fromAmount || !toAmount) {
      setError("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://swift-api-g7a3.onrender.com/api/wallet/swap/execute/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quote_id: quoteData.quote_id,
            from_symbol: fromToken,
            to_symbol: toToken,
            amount: parseFloat(fromAmount),
            from_address: walletAddress,
            to_address: walletAddress,
            slippage: slippage,
            provider: "paybis"
          }),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert("Swap executed successfully!");
        onClose();
        // You might want to refresh balances here
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
            onClick={handleSwitchTokens}
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

        {/* Swap Details */}
        {quoteData && (
          <div className="w-full text-left mb-4 text-sm text-blueGray-300">
            <div className="flex justify-between mb-1">
              <span>Exchange Rate:</span>
              <span>1 {fromToken} = {quoteData.exchange_rate} {toToken}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Minimum Received:</span>
              <span>{quoteData.minimum_output} {toToken}</span>
            </div>
            <div className="flex justify-between">
              <span>Price Impact:</span>
              <span>{quoteData.price_impact}%</span>
            </div>
          </div>
        )}

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
          onClick={executeSwap}
          disabled={isLoading || !quoteData || !fromAmount || !toAmount}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Processing...
            </>
          ) : (
            "Swap"
          )}
        </button>
      </div>
    </div>
  );
};

export default SwapModal;