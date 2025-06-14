import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";
import ContinueModal from "./ContinueModal";
import InputRequestModal from "./InputRequestModal";
import PaybisWidgetModal from "./PaybisWidgetModal";
import TransakWidgetModal from "./TransakWidgetModal";

const BuySellModal = ({ isOpen, onClose, selectedWallet }) => {
  const [activeTab, setActiveTab] = useState('Buy');
  const [sliderStyle, setSliderStyle] = useState({});
  const [showContinueModal, setShowContinueModal] = useState({ show: false, message: null });
  const [showInputModal, setShowInputModal] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [showTransakWidgetModal, setShowTransakWidgetModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [sellTransactionData, setSellTransactionData] = useState(null);
  const [widgetUrl, setWidgetUrl] = useState("");
  const [requestId, setRequestId] = useState("");
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
    // {
    //   name: 'Moon pay',
    //   description: 'An instant swap engine',
    //   icon: '💸'
    // },
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
    // {
    //   name: 'Moon pay',
    //   description: 'Buy, sell and margin trade cryptocurrencies',
    //   icon: '💸'
    // },
  ];

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setShowInputModal(true);
  };

  const handleInputSubmit = (data) => {
    if (data.widget_url) {
      setWidgetUrl(data.widget_url);
    }
    if (data.request_id) {
      setRequestId(data.request_id);
    }
    if (data.sellTransactionData) {
      // Store sell transaction data for Paybis sell transactions
      setSellTransactionData(data.sellTransactionData);
    }
    if (data.message) {
      setRequestId(data.request_id);
      // Store the message to show in ContinueModal
      setShowContinueModal({ show: true, message: data.message });
    } else {
      setShowInputModal(false);
      setShowContinueModal({ show: true, message: null });
    }
  };
  
  // Update the handleWidgetClose functions:
  const handlePaybisWidgetClose = () => {
    setShowWidgetModal(false);
    // Reset all states when widget is closed
    setWidgetUrl("");
    setRequestId("");
    setSelectedProvider(null);
    setSellTransactionData(null); // Reset sell transaction data
  };

  const handleTransakWidgetClose = () => {
    setShowTransakWidgetModal(false);
    // Reset all states when widget is closed
    setWidgetUrl("");
    setRequestId("");
    setSelectedProvider(null);
  };
  
  // Update the handleMainModalClose function:
  const handleMainModalClose = () => {
    // Reset all states when main modal is closed
    setShowContinueModal(false);
    setShowInputModal(false);
    setShowWidgetModal(false);
    setShowTransakWidgetModal(false);
    setWidgetUrl("");
    setRequestId("");
    setSelectedProvider(null);
    setSellTransactionData(null); // Reset sell transaction data
    onClose();
  };
  

  const handleContinue = () => {
    setShowContinueModal({ show: false, message: null });
    
    if (selectedProvider?.name === 'Paybis') {
      // For Paybis, show the Paybis widget modal
      setShowWidgetModal(true);
    } else if (selectedProvider?.name === 'Transak') {
      // For Transak, show the Transak widget modal
      setShowTransakWidgetModal(true);
    } else {
      // For other providers (like Moon pay), open external link
      if (widgetUrl) {
        window.open(widgetUrl, '_blank');
      }
    }
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
                    <button
                      ref={buyButtonRef}
                      className={`px-6 py-1 rounded-md text-sm relative z-10 ${
                        activeTab === 'Buy' ? 'text-white font-medium' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('Buy')}
                    >
                      Buy
                    </button>

                    <button
                      ref={sellButtonRef}
                      className={`px-6 py-1 rounded-md text-sm relative z-10 ${
                        activeTab === 'Sell' ? 'text-white font-medium' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('Sell')}
                    >
                      Sell
                    </button>
                  </div>
                </div>

                {/* Close button */}
                <button
                  className="absolute top-2 text-white hover:text-gray-700"
                  onClick={handleMainModalClose}
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

      <InputRequestModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        actionType={activeTab}
        provider={selectedProvider}
        onContinue={handleInputSubmit}
        selectedWallet={selectedWallet}
        direction={activeTab}
      />

      <ContinueModal
        isOpen={showContinueModal.show}
        onClose={() => setShowContinueModal({ show: false, message: null })}
        actionType={activeTab}
        provider={selectedProvider}
        selectedWallet={selectedWallet}
        onContinue={handleContinue}
        message={showContinueModal.message}
      />

      <PaybisWidgetModal
        isOpen={showWidgetModal}
        onClose={handlePaybisWidgetClose}
        widgetUrl={widgetUrl}
        requestId={requestId}
        actionType={activeTab}
        provider={selectedProvider}
        sellTransactionData={sellTransactionData}
      />

      <TransakWidgetModal
        isOpen={showTransakWidgetModal}
        onClose={handleTransakWidgetClose}
        widgetUrl={widgetUrl}
        requestId={requestId}
        actionType={activeTab}
        provider={selectedProvider}
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