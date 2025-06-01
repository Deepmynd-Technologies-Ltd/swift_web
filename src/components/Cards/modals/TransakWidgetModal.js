import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { X, CheckCircle, Clock, AlertCircle } from "lucide-react";

const TransakWidgetModal = ({ 
  isOpen, 
  onClose, 
  widgetUrl, 
  requestId, 
  actionType, 
  provider 
}) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionStatus, setTransactionStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setError("");
      setTransactionStatus(null);
      return;
    }

    // Listen for messages from Transak widget
    const handleMessage = (event) => {
      // Verify origin for security (adjust based on Transak documentation)
      if (!event.origin.includes('transak.com') && !event.origin.includes('global.transak.com')) {
        return;
      }

      const { eventName, status, data } = event.data;

      switch (eventName) {
        case 'TRANSAK_WIDGET_INITIALISED':
          console.log('Transak widget initialized');
          setIsLoading(false);
          break;
        case 'TRANSAK_WIDGET_CLOSE':
          console.log('Transak widget closed by user');
          onClose();
          break;
        case 'TRANSAK_ORDER_SUCCESSFUL':
          console.log('Transak order successful:', data);
          setTransactionStatus({
            status: 'success',
            message: 'Transaction completed successfully!',
            data: data
          });
          break;
        case 'TRANSAK_ORDER_FAILED':
          console.log('Transak order failed:', data);
          setTransactionStatus({
            status: 'failed',
            message: data?.message || 'Transaction failed',
            data: data
          });
          break;
        case 'TRANSAK_ORDER_CREATED':
          console.log('Transak order created:', data);
          setTransactionStatus({
            status: 'created',
            message: 'Order created successfully',
            data: data
          });
          break;
        case 'TRANSAK_ORDER_CANCELLED':
          console.log('Transak order cancelled:', data);
          setTransactionStatus({
            status: 'cancelled',
            message: 'Transaction was cancelled',
            data: data
          });
          break;
        default:
          console.log('Transak message:', eventName, status, data);
      }
    };

    if (widgetUrl) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, onClose, widgetUrl]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setError("Failed to load Transak widget. Please try again.");
  };

  // Get status display based on transaction status
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'created':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          icon: <Clock className="w-5 h-5" />,
          text: 'Order Created'
        };
      case 'success':
      case 'completed':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-5 h-5" />,
          text: 'Transaction Successful'
        };
      case 'failed':
      case 'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Transaction Failed'
        };
      case 'cancelled':
        return {
          color: 'text-orange-500',
          bgColor: 'bg-orange-100',
          icon: <AlertCircle className="w-5 h-5" />,
          text: 'Transaction Cancelled'
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
                {provider?.icon || '🪙'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{actionType} with {provider?.name || 'Transak'}</h3>
                <p className="text-sm text-gray-500">
                  Complete your transaction securely with Transak
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

          {/* Transaction Status Display */}
          {transactionStatus && (
            <div className="p-4 bg-yellow-50 border-b">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full ${getStatusDisplay(transactionStatus.status).bgColor} flex items-center justify-center`}>
                  <div className={getStatusDisplay(transactionStatus.status).color}>
                    {getStatusDisplay(transactionStatus.status).icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {getStatusDisplay(transactionStatus.status).text}
                  </h4>
                  <p className="text-sm text-gray-600">{transactionStatus.message}</p>
                  {transactionStatus.data?.orderId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Order ID: {transactionStatus.data.orderId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Transak widget...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we initialize your transaction</p>
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
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Widget</h4>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="space-x-3">
                  <button
                    onClick={() => {
                      setError("");
                      setIsLoading(true);
                      // Reload iframe
                      if (iframeRef.current) {
                        iframeRef.current.src = iframeRef.current.src;
                      }
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Iframe Container */}
          {widgetUrl && !error && (
            <div className="relative" style={{ height: transactionStatus ? "calc(90vh - 160px)" : "calc(90vh - 80px)" }}>
              <iframe
                ref={iframeRef}
                src={widgetUrl}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                className="w-full h-full border-0"
                title="Transak Transaction Widget"
                allow="payment; camera; microphone; geolocation; clipboard-read; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation allow-clipboard-read allow-clipboard-write"
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
                <span>Secure connection to Transak</span>
              </div>
              {requestId && (
                <div className="text-sm text-gray-500">
                  Request ID: <span className="font-mono text-xs">{requestId}</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              Transak is a trusted third-party service. SwiftAza does not store your payment information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TransakWidgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  widgetUrl: PropTypes.string,
  requestId: PropTypes.string,
  actionType: PropTypes.string,
  provider: PropTypes.object,
};

export default TransakWidgetModal;
