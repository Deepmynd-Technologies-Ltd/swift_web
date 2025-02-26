import React, { useState } from "react";
import { X } from "lucide-react";

const P2PModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Buy');

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="relative bg-white rounded-xl shadow-lg w-96 max-h-[90vh] overflow-hidden" style={{ width: "90%", maxWidth: "400px", background: "#F7FAFE", borderRadius: "24px", padding: "20px" }}>
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
              onClick={() => {
                alert("Create Ad functionality not implemented yet");
              }}
            >
              Create Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PModal;
