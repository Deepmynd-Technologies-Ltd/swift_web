import React, { useState } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";

const BuySellModal = ({ isOpen, onClose, selectedWallet }) => {
  const [activeTab, setActiveTab] = useState('Buy');

  const paymentOptions = [
    {
      name: 'Transak',
      description: 'Buy TON with cards or bank transfers instantly',
      icon: '💳'
    },
    {
      name: 'Mercuryo',
      description: 'Instant one-click purchase up to 700 EUR with no KYC',
      icon: '💸'
    },
    {
      name: 'Neocrypto',
      description: 'Instantly buy with a credit card',
      icon: '💳'
    },
    {
      name: 'MoonPay',
      description: 'Instantly buy with a credit card',
      icon: '🌙'
    },
    {
      name: 'Changelly',
      description: 'An instant swap engine',
      icon: '🔄'
    },
    {
      name: 'Onramp',
      description: `Buy ${selectedWallet?.abbr || 'crypto'} with INR easily`,
      icon: '💱'
    },
    {
      name: 'AvanChange',
      description: 'Buy with RUB credit card',
      icon: '💳'
    }
  ];

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
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[70vh]">
              {paymentOptions.map((option, index) => (
                <div
                  key={option.name}
                  className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer ${index !== paymentOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                  onClick={() => {
                    console.log(`Selected payment option: ${option.name}`);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{option.name}</h3>
                      <p className="text-gray-500 text-xs">{option.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BuySellModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedWallet: PropTypes.object,
};

export default BuySellModal;
