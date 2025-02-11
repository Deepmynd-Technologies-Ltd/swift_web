import React, { useState, useEffect } from "react";
import { CircleLoader } from "react-spinners";

export default function CardWalletOverview({ onSelectWallet }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch real values from the backend API
  useEffect(() => {
    async function fetchWalletData() {
      try {
        const response = await fetch("https://swift-api-g7a3.onrender.com/api/wallet/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Map API data to your expected structure
        const walletDetails = JSON.parse(localStorage.getItem('walletDetails'));
        const walletAddresses = walletDetails.walletAddresses;

        const bnbWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'bnb').address;
        const btcWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'btc').address;
        const dogeWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'doge').address;
        const ethWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'eth').address;
        const solWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'sol').address;
        const usdtWalletAddress = walletAddresses.find(wallet => wallet.symbols === 'usdt').address;

        const formattedData = await Promise.all([
          {
            abbr: "BNB",
            title: "BNB BEP20",
            marketPrice: `$ ${data.binancecoin.usd.toFixed(2)}`,
            marketPricePercentage: `${data.binancecoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=bnb&address=${bnbWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.binancecoin.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=bnb&address=${bnbWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/bnb_icon_.png"),
            default: true,
          },
          {
            abbr: "BTC",
            title: "Bitcoin",
            marketPrice: `$ ${data.bitcoin.usd.toFixed(2)}`,
            marketPricePercentage: `${data.bitcoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=btc&address=${btcWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.bitcoin.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=btc&address=${btcWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/bitcoin_icon.png"),
          },
          {
            abbr: "DOGE",
            title: "Doge coin",
            marketPrice: `$ ${data.dogecoin.usd.toFixed(4)}`,
            marketPricePercentage: `${data.dogecoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=doge&address=${dogeWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.dogecoin.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=doge&address=${dogeWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/xrp_icon_.png"),
          },
          {
            abbr: "ETH",
            title: "Ethereum",
            marketPrice: `$ ${data.ethereum.usd.toFixed(2)}`,
            marketPricePercentage: `${data.ethereum.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=eth&address=${ethWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.ethereum.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=eth&address=${ethWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/ethereum_icon.png"),
          },
          {
            abbr: "SOL",
            title: "Solana",
            marketPrice: `$ ${data.solana.usd.toFixed(2)}`,
            marketPricePercentage: `${data.solana.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=sol&address=${solWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.solana.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=sol&address=${solWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/solana_icon.png"),
          },
          {
            abbr: "USDT",
            title: "USDT BEP20",
            marketPrice: `$ ${data.tether.usd.toFixed(2)}`,
            marketPricePercentage: `${data.tether.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=usdt&address=${usdtWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data),
            equivalenceValueAmount: `$ ${(data.tether.usd * await fetch(`https://swift-api-g7a3.onrender.com/api/wallet/get_balance/?symbol=usdt&address=${usdtWalletAddress}`).then(res => res.json()).then(balanceData => balanceData.data)).toFixed(2)}`,
            typeImage: require("../../assets/img/usdt_icon_.png"),
          },
        ]);

        setTransactions(formattedData);
        setSelectedWallet(formattedData[0]); // Set the first wallet as the default selected
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWalletData();
  }, []);

  // Update parent component when the selected wallet changes
  useEffect(() => {
    if (selectedWallet) {
      onSelectWallet(selectedWallet);
    }
  }, [selectedWallet, onSelectWallet]);

  const handleWalletClick = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 h-screen w-full top-0 left-0 opacity-75 z-100">
          <div className="flex flex-col items-center">
            <CircleLoader color="#1D4ED8" size={48} />
            <p className="mt-4 text-white">Loading...</p>
          </div>
        </div>
      )}
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="block w-full overflow-x-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
              <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
              <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700">Market Price</div>
              <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
            </div>
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className={`rounded-my overflow-hidden ${
                  selectedWallet?.abbr === transaction.abbr ? "bg-blue-50" : ""
                }`}
                style={{ height: "80px", width: "100%" }}
              >
                <a
                  href={`/wallet/${transaction.abbr}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleWalletClick(transaction);
                  }}
                  style={{
                    display: "block",
                    margin: "0.375rem 0",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "color 0.2s",
                  }}
                  className={`wallet-row ${selectedWallet?.abbr === transaction.abbr ? "active" : ""}`}
                >
                  <div className="flex justify-between">
                    <div className="w-1/3 px-6 py-3">
                      <div className="flex items-center text-left">
                        <img
                          src={transaction.typeImage}
                          alt={transaction.abbr}
                          className="w-8 h-8 rounded mr-4"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <span className="text-sm font-bold">{transaction.abbr}</span>
                          <span className="text-xs block font-semibold" style={{ maxWidth: "100px" }}>
                            {transaction.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-center">
                      {transaction.marketPrice}
                      <span className={`text-xs ml-2 ${parseFloat(transaction.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                        {transaction.marketPricePercentage}
                      </span>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-right">
                      <div>
                        <span className="text-sm font-semibold">{transaction.equivalenceValue}</span>
                        <span className="text-xs block">{transaction.equivalenceValueAmount}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
