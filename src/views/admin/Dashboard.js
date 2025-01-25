import React, { useState, useEffect } from "react";
import CardStats from "components/Cards/CardStats";
import CardWalletOverview from "components/Cards/CardWalletOverview";
import CombinedComponent from "components/Cards/CardTransactionTrack";

// Example dynamic data for transactions
const transactions = [
  {
    abbr: "BNB",
    title: "Binance coin",
    marketPrice: "$ 400.50",
    marketPricePercentage: "1.23%",
    equivalenceValue: "1.5",
    equivalenceValueAmount: "$ 600.75",
    typeImage: require("../../assets/img/bnb_icon.png"), 
    // isActive: true
  },
  {
    abbr: "BTC",
    title: "Bitcoin",
    marketPrice: "$ 50,000.26",
    marketPricePercentage: "0.701%",
    equivalenceValue: "0.1",
    equivalenceValueAmount: "$ 4,345.02",
    typeImage: require("../../assets/img/bitcoin_icon.png"),
  },
  {
    abbr: "DOGE",
    title: "Doge coin",
    marketPrice: "$ 0.25",
    marketPricePercentage: "2.45%",
    equivalenceValue: "1000",
    equivalenceValueAmount: "$ 250.00",
    typeImage: require("../../assets/img/xrp_icon.png"),
  },
  {
    abbr: "ETH",
    title: "Ethereum",
    marketPrice: "$ 3,500.00",
    marketPricePercentage: "0.98%",
    equivalenceValue: "2.5",
    equivalenceValueAmount: "$ 7,000.00",
    typeImage: require("../../assets/img/ethereum_icon.png"),
  },
  {
    abbr: "SOL",
    title: "Solana",
    marketPrice: "$ 150.00",
    marketPricePercentage: "1.56%",
    equivalenceValue: "10",
    equivalenceValueAmount: "$ 1,500.00",
    typeImage: require("../../assets/img/solana_icon.png"),
  },
  {
    abbr: "USDT",
    title: "USDT BEP20",
    marketPrice: "$ 1.00",
    marketPricePercentage: "0.01%",
    equivalenceValue: "1000",
    equivalenceValueAmount: "$ 1,000.00",
    typeImage: require("../../assets/img/usdt_icon.png"),
  }
];


const Dashboard = () => {
  const activeWallet = transactions.find(wallet => wallet.isActive) || transactions[0];
  const [selectedWallet, setSelectedWallet] = useState(activeWallet);

  const handleSelectWallet = (activeWallet) => {
    setSelectedWallet(activeWallet);
  };

  return (
    <>
      <div className="flex">
        <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4" style={{ flex: "0 0 60%" }}>
          <CardStats />
          <CardWalletOverview 
            selectedWallet={selectedWallet}
            onSelectWallet={handleSelectWallet}
          />
        </div>
        <div className="w-full xl:w-5/12 px-4" style={{ flex: "0 0 40%" }}>
          {selectedWallet ? (
            <CombinedComponent wallet={selectedWallet} />
          ) : (
            <p>Select a wallet to view details</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;