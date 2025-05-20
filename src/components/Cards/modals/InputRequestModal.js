import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

// Supported currencies
const FIAT_CURRENCIES = ['NGN', 'EUR', 'USD', 'GBP'];
const CRYPTO_CURRENCIES = ['BNB', 'BTC', 'ETH', 'USDT', 'DOGE', 'SOL'];

// Provider limits (example values - adjust based on actual provider limits)
const PROVIDER_LIMITS = {
  Paybis: {
    buy: { min: 5000, max: 500000 }, // NGN
    sell: { min: 0.001, max: 10 } // BTC
  },
  Transak: {
    buy: { min: 1000, max: 1000000 }, // Local currency
    sell: { min: 0.01, max: 100 } // Crypto
  },
  'Moon pay': {
    buy: { min: 20, max: 50000 }, // EUR/USD/GBP
    sell: { min: 0.01, max: 50 } // Crypto
  }
};

// Fiat currencies supported for selling
const SELL_SUPPORTED_FIAT = ['USD', 'EUR', 'GBP'];

const InputRequestModal = ({ 
  isOpen, 
  onClose, 
  actionType, 
  provider, 
  onContinue, 
  selectedWallet,
  direction,
  walletAddresses // Pass wallet addresses for different cryptos
}) => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState(selectedWallet?.abbr || "BTC");
  const [supportedFiats, setSupportedFiats] = useState(FIAT_CURRENCIES);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setAmount("");
      setEmail("");
      setError("");
      
      // Set default currencies based on direction
      if (direction === 'Buy') {
        setFromCurrency("NGN");
        setToCurrency(selectedWallet?.abbr || "BTC");
      } else {
        setFromCurrency(selectedWallet?.abbr || "BTC");
        // For sell, default to first supported fiat
        setToCurrency(SELL_SUPPORTED_FIAT[0] || "USD");
      }

      // Set wallet address automatically for sell transactions
      if (direction === 'Sell' && selectedWallet?.abbr && walletAddresses) {
        setWalletAddress(walletAddresses[selectedWallet.abbr] || "");
      }
    }
  }, [isOpen, direction, selectedWallet, walletAddresses]);

  // Update supported fiats based on action type
  useEffect(() => {
    if (direction === 'Sell') {
      setSupportedFiats(SELL_SUPPORTED_FIAT);
    } else {
      setSupportedFiats(FIAT_CURRENCIES);
    }
  }, [direction]);

  const validateInputs = () => {
    // Check required fields
    if (!amount) {
      setError("Please enter an amount");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      setError("Please enter a valid amount");
      return false;
    }

    // Check provider limits
    const limits = PROVIDER_LIMITS[provider.name]?.[direction === 'Buy' ? 'buy' : 'sell'];
    if (limits) {
      if (amountNum < limits.min) {
        setError(`Minimum amount is ${limits.min} ${direction === 'Buy' ? fromCurrency : toCurrency}`);
        return false;
      }
      if (amountNum > limits.max) {
        setError(`Maximum amount is ${limits.max} ${direction === 'Buy' ? fromCurrency : toCurrency}`);
        return false;
      }
    }

    // Check email for Paybis
    if (provider.name === 'Paybis' && !email) {
      setError("Please enter your email");
      return false;
    }

    // Check wallet address for Transak/Moonpay
    if ((provider.name === 'Transak' || provider.name === 'Moon pay') && !walletAddress) {
      setError(`Please enter ${direction === 'Buy' ? 'recipient' : 'your'} wallet address`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // Prepare the request data
      let requestData = {
        from_currency_or_crypto: direction === 'Buy' ? fromCurrency.toLowerCase() : fromCurrency.toLowerCase(),
        to_currency_or_crypto: direction === 'Buy' ? toCurrency.toLowerCase() : toCurrency.toLowerCase(),
        amount: parseFloat(amount),
        direction: "from",
        locale: "en"
      };

      // Add provider-specific fields
      if (provider.name === 'Paybis') {
        requestData = {
          ...requestData,
          partner_user_id: "4bb689aa-fd24-46fb-b793-e44c26d24e7a",
          email: email
        };
      } else {
        requestData = {
          ...requestData,
          wallet_address: walletAddress,
          user_data: {}
        };
      }

      // Determine the API endpoint based on provider
      let endpoint = "";
      switch(provider.name) {
        case 'Paybis':
          endpoint = "https://swift-api-g7a3.onrender.com/api/wallet/paybis/transaction/";
          break;
        case 'Transak':
          endpoint = "https://swift-api-g7a3.onrender.com/api/wallet/transak/transaction/";
          break;
        case 'Moon pay':
          endpoint = "https://swift-api-g7a3.onrender.com/api/wallet/moonpay/transaction/";
          break;
        default:
          throw new Error("Unsupported provider");
      }

      // Make the API call
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to process transaction");
      }

      // Call the onContinue with the widget URL
      onContinue(data.data.widget_url);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("Transaction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="transparent h-screen w-full z-10" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0}}>
      <div className=" z-50 flex justify-center items-center" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
        <div
          className="relative bg-black rounded-xl shadow-lg w-96 overflow-hidden"
          style={{ width: "90%", maxWidth: "400px", maxHeight: "90vh", background: "#070707", borderRadius: "24px", padding: "20px" }}
        >
          {/* Handle bar */}
          <div className="flex items-center justify-center w-full mb-4">
            <div className="bg-primary-color-4 rounded" style={{ height: "4px", width: "100px" }}></div>
          </div>
          
          <h2 className="text-lg font-bold mt-4 text-left text-white">{actionType} {provider?.name}</h2>
          
          {/* Close button */}
          <button
            className="absolute top-4 text-white hover:text-gray-700"
            onClick={onClose}
            style={{ right: "30px", top: "40px" }}
          >
            <i className="fa fa-times"></i>
          </button>

          <div className="w-24 h-24 bg-primary-color-4 rounded-lg flex items-center justify-center mx-auto text-4xl" style={{maxWidth: "50px", minHeight: "50px"}}>
            {provider?.icon || '💳'}
          </div>
          
          <h3 className="text-2xl mt-4 font-bold text-center text-white">{provider?.name}</h3>

          <form onSubmit={handleSubmit} className="px-4 mt-4">
            {/* Currency selection */}
            <div className="flex mb-4 gap-2">
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-1">
                  {direction === 'Buy' ? 'From' : 'From (Crypto)'}
                </label>
                <select
                  value={direction === 'Buy' ? fromCurrency : fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-black text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {(direction === 'Buy' ? supportedFiats : CRYPTO_CURRENCIES).map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-1">
                  {direction === 'Buy' ? 'To (Crypto)' : 'To (Fiat)'}
                </label>
                <select
                  value={direction === 'Buy' ? toCurrency : toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full bg-black text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {(direction === 'Buy' ? CRYPTO_CURRENCIES : SELL_SUPPORTED_FIAT).map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount input */}
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-1">
                Amount ({direction === 'Buy' ? fromCurrency : fromCurrency})
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={`Enter amount in ${direction === 'Buy' ? fromCurrency : fromCurrency}`}
                required
              />
            </div>

            {provider.name === 'Paybis' && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            {(provider.name === 'Transak' || provider.name === 'Moon pay') && (
              <div className="mb-4">
                <label className="block text-white text-sm font-medium mb-1">
                  {direction === 'Buy' ? 'Recipient Wallet Address' : 'Your Wallet Address'}
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full bg-black text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Enter ${toCurrency} wallet address`}
                  required={direction === 'Buy'}
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <button
              type="submit"
              className="bg-green-500 w-full text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

InputRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
  provider: PropTypes.object,
  onContinue: PropTypes.func.isRequired,
  selectedWallet: PropTypes.object,
  direction: PropTypes.string.isRequired,
  walletAddresses: PropTypes.object,
};

export default InputRequestModal;