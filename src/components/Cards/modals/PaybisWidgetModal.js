import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { X, CheckCircle, Clock, AlertCircle, Copy } from "lucide-react";

const PaybisWidgetModal = ({ 
  isOpen, 
  onClose, 
  widgetUrl, 
  requestId, 
  actionType, 
  provider,
  sellTransactionData = null 
}) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError("");
      return;
    }

    // For sell transactions, always show custom interface - no iframe needed
    if (actionType === 'Sell') {
      setIsLoading(false);
      return;
    }

    // Only listen for messages from Paybis widget for buy transactions
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

    // Only add message listener for buy transactions
    if (actionType === 'Buy' && widgetUrl) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, onClose, actionType, widgetUrl]);

  // Handle iframe load (only for buy transactions)
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error (only for buy transactions)
  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load Paybis widget. Please try again.");
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'created':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          icon: <Clock className="w-5 h-5" />,
          text: 'Transaction Initialized'
        };
      case 'completed':
      case 'success':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-5 h-5" />,
          text: 'Transaction Completed'
        };
      case 'failed':
      case 'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Transaction Failed'
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: <Clock className="w-5 h-5" />,
          text: 'Processing'
        };
    }
  };

  if (!isOpen) return null;

  // Render custom sell transaction interface
  const renderSellInterface = () => {
    // Use sellTransactionData if available, otherwise use basic data
    const transactionData = sellTransactionData || {
      requestId: requestId,
      status: 'created'
    };
    
    const statusDisplay = getStatusDisplay(transactionData?.status);

    return (
      <div className="p-6 space-y-6">
        {/* Status Section */}
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${statusDisplay.bgColor} flex items-center justify-center mx-auto mb-4`}>
            <div className={statusDisplay.color}>
              {statusDisplay.icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {statusDisplay.text}
          </h3>
          <p className="text-gray-600">
            Your sell transaction has been successfully initialized with Paybis
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">Transaction Details</h4>
          
          {transactionData?.requestId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Request ID:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-900">
                  {transactionData.requestId.length > 16 
                    ? `${transactionData.requestId.slice(0, 8)}...${transactionData.requestId.slice(-8)}`
                    : transactionData.requestId
                  }
                </span>
                <button
                  onClick={() => copyToClipboard(transactionData.requestId)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Copy full ID"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {transactionData?.quoteId && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Quote ID:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono text-gray-900">
                  {transactionData.quoteId.length > 16 
                    ? `${transactionData.quoteId.slice(0, 8)}...${transactionData.quoteId.slice(-8)}`
                    : transactionData.quoteId
                  }
                </span>
                <button
                  onClick={() => copyToClipboard(transactionData.quoteId)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Copy full ID"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {transactionData?.email && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm text-gray-900">{transactionData.email}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`text-sm font-medium ${statusDisplay.color}`}>
              {transactionData?.status || 'Processing'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Provider:</span>
            <span className="text-sm text-gray-900">{provider?.name || 'Paybis'}</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your email for further instructions from Paybis</li>
            <li>• You may need to complete KYC verification if required</li>
            <li>• Transaction processing may take a few minutes to complete</li>
            <li>• Keep your Request ID for future reference</li>
            <li>• Contact support if you need assistance</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.open('https://paybis.com/support', '_blank')}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Contact Support
          </button>
        </div>

        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            Copied to clipboard!
          </div>
        )}
      </div>
    );
  };

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
            height: actionType === 'Sell' ? "auto" : "90vh", 
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
                <h3 className="font-semibold text-gray-900">{actionType} with {provider?.name || 'Paybis'}</h3>
                <p className="text-sm text-gray-500">
                  {actionType === 'Sell' 
                    ? 'Transaction has been initialized' 
                    : 'Complete your transaction securely'
                  }
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          {actionType === 'Sell' ? (
            // Custom sell interface - no iframe
            renderSellInterface()
          ) : (
            <>
              {/* Loading State for Buy transactions */}
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Paybis widget...</p>
                  </div>
                </div>
              )}

              {/* Error State for Buy transactions */}
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

              {/* Iframe Container (only for buy transactions) */}
              {widgetUrl && !error && actionType === 'Buy' && (
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

              {/* Footer for Buy transactions */}
              {actionType === 'Buy' && (
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
              )}
            </>
          )}
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
  sellTransactionData: PropTypes.object,
};

export default PaybisWidgetModal;