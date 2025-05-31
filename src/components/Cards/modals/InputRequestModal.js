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
  direction
}) => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromCurrency, setFromCurrency] = useState("NGN");
  const [toCurrency, setToCurrency] = useState(selectedWallet?.abbr || "BTC");
  const [supportedFiats, setSupportedFiats] = useState(FIAT_CURRENCIES);
  const [walletData, setWalletData] = useState(null);

  // Load wallet data from localStorage/sessionStorage simulation
  useEffect(() => {
    const loadWalletData = async () => {
      try {
        // Since we can't use localStorage in artifacts, simulate wallet data
        // In your actual implementation, replace this with your localforage logic
        const simulatedWalletData = {
          walletAddresses: [{
            data: [
              { symbols: 'BTC', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
              { symbols: 'ETH', address: '0x742d35Cc6631C0532925a3b8D4000532b9eDc0B' },
              { symbols: 'BNB', address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2' },
              { symbols: 'USDT', address: '0x742d35Cc6631C0532925a3b8D4000532b9eDc0B' },
              { symbols: 'DOGE', address: 'D7Y55q7aHKxYjTGqEBY3x7J7ySNdBQJJP3' },
              { symbols: 'SOL', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' }
            ]
          }]
        };
        
        setWalletData(simulatedWalletData);
      } catch (err) {
        console.error("Error loading wallet data:", err);
      }
    };
    
    if (isOpen) {
      loadWalletData();
    }
  }, [isOpen]);

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setEmail("");
      setError("");
      
      // Set default currencies based on direction
      const defaultCrypto = selectedWallet?.abbr || "BTC";
      if (direction === 'Buy') {
        setFromCurrency("NGN");
        setToCurrency(defaultCrypto);
      } else {
        setFromCurrency(defaultCrypto);
        setToCurrency(SELL_SUPPORTED_FIAT[0] || "USD");
      }
    }
  }, [isOpen, direction, selectedWallet]);

  // Update wallet address when currencies or wallet data changes
  useEffect(() => {
    if (!isOpen || !walletData) return;

    const cryptoCurrency = direction === 'Buy' ? toCurrency : fromCurrency;
    updateWalletAddress(cryptoCurrency);
  }, [toCurrency, fromCurrency, direction, isOpen, walletData]);

  // Update supported fiats based on action type
  useEffect(() => {
    if (direction === 'Sell') {
      setSupportedFiats(SELL_SUPPORTED_FIAT);
    } else {
      setSupportedFiats(FIAT_CURRENCIES);
    }
  }, [direction]);

  // Helper function to update wallet address based on crypto currency
  const updateWalletAddress = (cryptoCurrency) => {
    if (!walletData || !cryptoCurrency) {
      setWalletAddress("");
      return;
    }

    let walletItems = [];
    
    // Handle different wallet data structures
    if (walletData.walletAddresses && Array.isArray(walletData.walletAddresses)) {
      if (walletData.walletAddresses[0] && Array.isArray(walletData.walletAddresses[0].data)) {
        walletItems = walletData.walletAddresses[0].data;
      } else {
        walletItems = walletData.walletAddresses;
      }
    } else if (Array.isArray(walletData)) {
      walletItems = walletData;
    } else {
      console.error("Invalid wallet data format");
      return;
    }

    // Find the wallet that matches the crypto currency symbol
    const targetWallet = walletItems.find(wallet => 
      wallet.symbols?.toUpperCase() === cryptoCurrency.toUpperCase()
    );

    setWalletAddress(targetWallet?.address || "");
  };

  const validateInputs = () => {
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

      // For Paybis, pass both widget_url and request_id
      if (provider.name === 'Paybis') {
        onContinue({
          widget_url: data.data.widget_url,
          request_id: data.data.request_id || data.data.id
        });
      } else {
        // For other providers, just pass the widget URL
        onContinue({
          widget_url: data.data.widget_url
        });
      }
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
                  readOnly
                  className="w-full bg-blueGray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`${direction === 'Buy' ? toCurrency : fromCurrency} wallet address`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {direction === 'Buy' 
                    ? "This address will automatically update when you change the crypto currency" 
                    : "This is your wallet address for the selected cryptocurrency"}
                </p>
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
  selectedWallet: PropTypes.shape({
    abbr: PropTypes.string.isRequired,
  }),
  direction: PropTypes.string.isRequired,
};

export default InputRequestModal;