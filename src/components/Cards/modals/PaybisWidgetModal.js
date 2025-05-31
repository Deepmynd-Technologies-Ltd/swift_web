import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { X } from "lucide-react";

const PaybisWidgetModal = ({ isOpen, onClose, widgetUrl, requestId, actionType, provider }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError("");
      return;
    }

    // Listen for messages from the Paybis widget
    const handleMessage = (event) => {
      // Verify origin for security (adjust based on Paybis documentation)
      if (!event.origin.includes('paybis.com')) {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'PAYBIS_WIDGET_LOADED':
          setIsLoading(false);
          break;
        case 'PAYBIS_TRANSACTION_SUCCESS':
          console.log('Transaction successful:', data);
          // Handle successful transaction
          // You might want to update your app state, show success message, etc.
          break;
        case 'PAYBIS_TRANSACTION_FAILED':
          console.log('Transaction failed:', data);
          setError(data.message || 'Transaction failed');
          break;
        case 'PAYBIS_WIDGET_CLOSED':
          console.log('Widget closed by user');
          onClose();
          break;
        case 'PAYBIS_WIDGET_ERROR':
          console.error('Widget error:', data);
          setError(data.message || 'Widget error occurred');
          break;
        default:
          console.log('Unknown message type:', type, data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, onClose]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load Paybis widget. Please try again.");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="bg-black bg-opacity-50 h-screen w-full z-50" 
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="z-50 flex justify-center items-center" 
        style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div
          className="relative bg-white rounded-xl shadow-lg overflow-hidden"
          style={{ 
            width: "95%", 
            maxWidth: "800px", 
            height: "90vh", 
            maxHeight: "800px",
            borderRadius: "16px"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                {provider?.icon || '💳'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{actionType} with {provider?.name}</h3>
                <p className="text-sm text-gray-500">Complete your transaction securely</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Paybis widget...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Error</h4>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Iframe Container */}
          {widgetUrl && !error && (
            <div className="relative" style={{ height: "calc(90vh - 80px)" }}>
              <iframe
                ref={iframeRef}
                src={widgetUrl}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="w-full h-full border-0"
                title="Paybis Transaction Widget"
                allow="payment; camera; microphone; geolocation"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                style={{ 
                  display: isLoading ? 'none' : 'block',
                  minHeight: '500px'
                }}
              />
            </div>
          )}

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure connection to Paybis</span>
              </div>
              {requestId && (
                <div className="text-sm text-gray-500">
                  Request ID: <span className="font-mono">{requestId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PaybisWidgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  widgetUrl: PropTypes.string,
  requestId: PropTypes.string,
  actionType: PropTypes.string,
  provider: PropTypes.object,
};

export default PaybisWidgetModal;