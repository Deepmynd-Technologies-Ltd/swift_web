import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";
import ContinueModal from "./ContinueModal"; // Make sure this path is correct

const BuySellModal = ({ isOpen, onClose, selectedWallet }) => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [sliderStyle, setSliderStyle] = useState({});
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const buyButtonRef = useRef(null);
  const sellButtonRef = useRef(null);

  // Provider URLs (replace with actual URLs)
  const providerUrls = {
    'Buy': {
      'Paybis': 'https://paybis.com/',
      'Transak': 'https://global.transak.com/',
      'Kotani pay': 'https://kotanipay.com'
    },
    'Sell': {
      'Paybis': 'https://paybis.com/sell-bitcoin/',
      'Transak': 'https://global.transak.com/',
      'Kotani pay': 'https://kotanipay.com'
    }
  };

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
          color: "white",
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
      description: 'Buy Bitcoin with Credit card or Debit Card',
      icon: '💳'
    },
    {
      name: 'Transak',
      description: 'Affordable Payout services',
      icon: '🪙'
    },
    {
      name: 'Kotani pay',
      description: 'An instant swap engine',
      icon: '💸'
    },
  ] : [
    {
      name: 'Paybis',
      description: 'Buy and sell cryptocurrency',
      icon: '💳'
    },
    {
      name: 'Transak',
      description: 'Global cryptocurrency exchange',
      icon: '🪙'
    },
    {
      name: 'Kotani pay',
      description: 'Buy, sell and margin trade cryptocurrencies',
      icon: '💸'
    },
  ];

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setShowContinueModal(true);
  };
  
  const handleContinue = () => {
    setShowContinueModal(false);
    window.open(providerUrls[activeTab][selectedProvider.name], '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="bg-blueGray-600 h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.95 }}>
        <div className="inset-0 z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
          <div
            className="relative bg-black rounded-xl shadow-lg w-96 overflow-hidden"
            style={{ width: "90%", maxWidth: "400px", maxHeight: "80vh", background: "#070707", borderRadius: "24px", padding: "20px" }}
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
                        activeTab === 'Buy' ? 'text-white font-medium' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('Buy')}
                    >
                      Buy
                    </a>
                    <a
                      ref={sellButtonRef}
                      className={`px-6 py-1 rounded-md text-sm relative z-10 ${
                        activeTab === 'Sell' ? 'text-white font-medium' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('Sell')}
                    >
                      Sell
                    </a>
                  </div>
                </div>
                
                {/* Close button */}
                <button
                  className="absolute top-2 text-white hover:text-gray-700"
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
                    onClick={() => handleProviderClick(option)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-color-4 rounded-lg flex items-center justify-center">
                        {option.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-sm text-white">{option.name}</h3>
                        <p className="text-gray-500 text-xs" style={{ width: "214px"}}>{option.description}</p>
                      </div>
                    </div>
                    <div className="text-white font-bold text-2xl" style={{ fontWeight: "400px"}}>→</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContinueModal
        isOpen={showContinueModal}
        onClose={() => setShowContinueModal(false)}
        actionType={activeTab}
        provider={selectedProvider}
        onContinue={handleContinue}
      />
    </>
  );
};

BuySellModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedWallet: PropTypes.object,
};

export default BuySellModal;
