import React, { useState } from "react";
import { X } from "lucide-react";

const SwapModal = ({ isOpen, onClose }) => {
  const [fromToken, setFromToken] = useState("Bitcoin");
  const [toToken, setToToken] = useState("Ethereum");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  
  // Token balances for display
  const tokenBalances = {
    Bitcoin: "24.235",
    Ethereum: "0.0"
  };
  
  // Token symbols
  const tokenSymbols = {
    Bitcoin: "BTC",
    Ethereum: "ETH"
  };

  if (!isOpen) return null;

  return (
    <div 
      className="bg-black h-screen w-full z-10 flex justify-center items-center" 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}
    >
      <div
        className="relative p-8 z-10 shadow-lg flex flex-col items-center"
        style={{ maxWidth: "400px", width: "90%", background: "#F7FAFE", borderRadius: "24px" }}
      >
        {/* Handle bar */}
        <div className="flex items-center justify-center">
          <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center w-full  pb-4">
          <h2 className="text-xl font-bold text-gray-800">Swap Token</h2>
          <button
            className="absolute top-2 text-blueGray-500 hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px" }}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        
        {/* From Token Section */}
        <div className="w-full bg-primary-color-4 p-8 rounded-lg mb-2">
          <div className="text-sm text-gray-500 mb-2">From</div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold">Bitcoin</span>
              <span className="text-gray-500 ml-2">({tokenBalances.Bitcoin})</span>
            </div>
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-lg">
              <span className="font-medium">{tokenSymbols.Bitcoin}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Input field with Max button */}
          <div className="flex">
          <input
            type="text"
            placeholder="Enter recipient’s address"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            className="absolute transform text-xs bg-primary-color-4 text-green px-3 py-1 rounded"
            style={{ right: "80px", marginTop: "10px" }}
            onClick={() => navigator.clipboard.readText().then(text => setFromAmount(text))}
          >
            Max
          </button>
          </div>
        </div>
        
        {/* Switch Button */}
        <div className="relative w-full flex justify-center" style={{ height: "1px", marginTop: "6px", marginBottom: "12px" }}>
          <a className="absolute bg-green-500 text-white text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center" style={{ top: "-20px" }}>
          ⥯
          </a>
        </div>
        
        {/* To Token Section */}
        <div className="w-full bg-primary-color-4 p-4 rounded-lg mb-4">
          <div className="text-sm text-gray-500 mb-2">To</div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-lg font-bold">Ethereum</span>
              <span className="text-gray-500 ml-2">({tokenBalances.Ethereum})</span>
            </div>
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-lg">
              <span className="font-medium">{tokenSymbols.Ethereum}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Input field */}
          <div>
            <input
              type="text"
              placeholder="Enter an amount here"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              className="w-full bg-black rounded-lg py-3 px-4 focus:outline-none"
            />
          </div>
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
              0.1% Exchange Fee
            </span>
          </div>

          {/* Swap Button */}
        <button
          className="bg-green-500 w-full text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
          onClick={() => {
            alert("Swap functionality not implemented yet");
          }}
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export default SwapModal;
