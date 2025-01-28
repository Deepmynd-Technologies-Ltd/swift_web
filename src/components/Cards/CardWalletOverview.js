import React, { useState, useEffect } from "react";

export default function CardWalletOverview({ onSelectWallet }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Fetch real values from the backend API
  useEffect(() => {
    async function fetchWalletData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/wallet/");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Map API data to your expected structure
        const formattedData = [
          {
            abbr: "BNB",
            title: "BNB BEP20",
            marketPrice: `$ ${data.binancecoin.usd.toFixed(2)}`,
            marketPricePercentage: `${data.binancecoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "1.5",
            equivalenceValueAmount: `$ ${(data.binancecoin.usd * 1.5).toFixed(2)}`,
            typeImage: require("../../assets/img/bnb_icon.png"),
          },
          {
            abbr: "BTC",
            title: "Bitcoin",
            marketPrice: `$ ${data.bitcoin.usd.toFixed(2)}`,
            marketPricePercentage: `${data.bitcoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "0.1",
            equivalenceValueAmount: `$ ${(data.bitcoin.usd * 0.1).toFixed(2)}`,
            typeImage: require("../../assets/img/bitcoin_icon.png"),
          },
          {
            abbr: "DOGE",
            title: "Doge coin",
            marketPrice: `$ ${data.dogecoin.usd.toFixed(4)}`,
            marketPricePercentage: `${data.dogecoin.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "1000",
            equivalenceValueAmount: `$ ${(data.dogecoin.usd * 1000).toFixed(2)}`,
            typeImage: require("../../assets/img/xrp_icon.png"),
          },
          {
            abbr: "ETH",
            title: "Ethereum",
            marketPrice: `$ ${data.ethereum.usd.toFixed(2)}`,
            marketPricePercentage: `${data.ethereum.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "2.5",
            equivalenceValueAmount: `$ ${(data.ethereum.usd * 2.5).toFixed(2)}`,
            typeImage: require("../../assets/img/ethereum_icon.png"),
          },
          {
            abbr: "SOL",
            title: "Solana",
            marketPrice: `$ ${data.solana.usd.toFixed(2)}`,
            marketPricePercentage: `${data.solana.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "10",
            equivalenceValueAmount: `$ ${(data.solana.usd * 10).toFixed(2)}`,
            typeImage: require("../../assets/img/solana_icon.png"),
          },
          {
            abbr: "USDT",
            title: "USDT BEP20",
            marketPrice: `$ ${data.tether.usd.toFixed(2)}`,
            marketPricePercentage: `${data.tether.usd_24h_change.toFixed(2)}%`,
            equivalenceValue: "1000",
            equivalenceValueAmount: `$ ${(data.tether.usd * 1000).toFixed(2)}`,
            typeImage: require("../../assets/img/usdt_icon.png"),
          },
        ];

        setTransactions(formattedData);
        setSelectedWallet(formattedData[0]); // Set the first wallet as the default selected
      } catch (error) {
        console.error("Error fetching wallet data:", error);
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
                      <span className="text-xs text-green-500 ml-2">{transaction.marketPricePercentage}</span>
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