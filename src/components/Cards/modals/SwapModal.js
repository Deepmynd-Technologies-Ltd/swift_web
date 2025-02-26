import React, { useState } from "react";
import { X } from "lucide-react";

const SwapModal = ({ isOpen, onClose }) => {
  const [fromToken, setFromToken] = useState("BTC");
  const [toToken, setToToken] = useState("ETH");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden"
          style={{ width: "90%", maxWidth: "400px", background: "#F7FAFE", borderRadius: "24px", padding: "20px" }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Swap Token</h2>
              <button
                onClick={onClose}
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
                alert("Swap functionality not implemented yet");
              }}
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapModal;
