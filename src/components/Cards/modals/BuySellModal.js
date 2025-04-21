import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";

const BuySellModal = ({ isOpen, onClose, selectedWallet }) => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [sliderStyle, setSliderStyle] = useState({});
  const buyButtonRef = useRef(null);
  const sellButtonRef = useRef(null);

  // Update slider position when activeTab changes
  useEffect(() => {
    if (!isOpen) return;
    
    const updateSliderPosition = () => {
      const activeButton = activeTab === 'Buy' ? buyButtonRef.current : sellButtonRef.current;
      
      if (activeButton) {
        setSliderStyle({
          width: `${activeButton.offsetWidth}px`,
          height: `${activeButton.offsetHeight}px`,
          top: `${activeButton.offsetTop}px`,
          transform: `translateX(${activeButton.offsetLeft}px)`,
          transition: 'transform 0.3s ease',
          borderRadius: '4px',
        });
      }
    };

    // Small delay to ensure DOM is updated
    setTimeout(updateSliderPosition, 10);
    
    // Also update on window resize
    window.addEventListener('resize', updateSliderPosition);
    return () => window.removeEventListener('resize', updateSliderPosition);
  }, [activeTab, isOpen]);

  const paymentOptions = activeTab === 'Buy' ? [
    {
      name: 'Paybis',
      description: 'Buy Bicoin with Credit card or Debit Card',
      icon: '💳'
    },
    {
      name: 'MoonPay',
      description: 'Affordable Payout services',
      icon: '🌙'
    },
    {
      name: 'Kotani pay',
      description: 'An instant swap engine',
      icon: '💸'
    },
  ] : [
    {
      name: 'Coinbase',
      description: 'Buy and sell cryptocurrency',
      icon: '🪙'
    },
    {
      name: 'Binance',
      description: 'Global cryptocurrency exchange',
      icon: '🔒'
    },
    {
      name: 'Kraken',
      description: 'Buy, sell and margin trade cryptocurrencies',
      icon: '🦑'
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="bg-black h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
      <div className="inset-0 z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative bg-black rounded-xl shadow-lg w-96 overflow-hidden"
          style={{ width: "90%", maxWidth: "400px", maxHeight: "80vh", background: "#F7FAFE", borderRadius: "24px", padding: "20px" }}
        >
          {/* Handle bar */}
          <div className="flex items-center justify-center w-full mb-4">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              {/* Tabs with sliding effect */}
              <div className="inline-flex bg-primary-color-4 rounded-lg p-1 relative">
                {/* Background slider that moves */}
                <div 
                  className="absolute bg-black rounded-md shadow-sm z-0" 
                  style={sliderStyle}
                ></div>
                
                <div className="p-2 h-4">
                  {/* Buttons */}
                  <a
                    ref={buyButtonRef}
                    className={`px-6 py-1 rounded-md text-sm relative z-10 ${
                      activeTab === 'Buy' ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('Buy')}
                  >
                    Buy
                  </a>
                  <a
                    ref={sellButtonRef}
                    className={`px-6 py-1 rounded-md text-sm relative z-10 ${
                      activeTab === 'Sell' ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('Sell')}
                  >
                    Sell
                  </a>
                </div>
              </div>
              
              {/* Close button */}
              <button
                className="absolute top-2 text-blueGray-500 hover:text-gray-700"
                onClick={onClose}
                style={{ right: "30px" }}
              >
                <i className="fa fa-times"></i>
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
                    <div className="w-10 h-10 bg-primary-color-4 rounded-lg flex items-center justify-center">
                      {option.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-sm">{option.name}</h3>
                      <p className="text-gray-500 text-xs" style={{ width: "214px"}}>{option.description}</p>
                    </div>
                  </div>
                  <div className="text-gray-400 font-bold text-2xl" style={{ fontWeight: "400px"}}>→</div>
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