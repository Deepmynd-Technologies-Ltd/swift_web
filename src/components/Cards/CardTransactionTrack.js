import React, { useState, useEffect } from "react";
import { CardWalletOverview } from "./CardWalletOverview";

// Example dynamic data for different wallets (to simulate the change of charts for different wallets)
const chartData = {
  BTC: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 10, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 20, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
  ETH: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 15, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
  BNB: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 10, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 20, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
  SOL: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 15, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
  DOGE: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 10, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 20, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
  USDT: {
    "1H": "M0 50 Q50 0, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1D": "M0 50 Q50 15, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1W": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1M": "M0 50 Q50 30, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "1Y": "M0 50 Q50 40, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "2Y": "M0 50 Q50 50, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
    "ALL": "M0 50 Q50 60, 100 50 T200 50 T300 50 T350 50 T400 50 T450 50",
  },
};


const CardLineChart = ({ wallet }) => {
  const [activePeriod, setActivePeriod] = useState("1H");
  const [svgPath, setSvgPath] = useState("");

  const periods = ["1H", "1D", "1W", "1M", "1Y", "2Y", "ALL"];

  useEffect(() => {
    if (wallet) {
      setSvgPath(chartData[wallet.abbr]?.[activePeriod]);
    }
  }, [wallet, activePeriod]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="items-center">
          {!wallet ? (
            <div className="text-center text-gray-500 mt-4">
              Select a Wallet
            </div>
          ) : (
            <>
              <h2 className="text-3xl text-center font-bold mb-1">{wallet?.equivalenceValue} {wallet?.abbr}</h2>
              <p className="text-xs text-center mb-4 text-blueGray-500">{wallet?.equivalenceValueAmount}</p>
              <p className="text-base font-bold font-medium mt-8">Current {wallet?.title} Price</p>
              <p className="text-xs text-blueGray-500">
                {wallet?.equivalenceValue} {wallet?.abbr} <span className="text-red-500 ml-4">-0.49%</span>
              </p>
            </>
          )}
        </div>
        <div className="flex-auto">
          <div className="relative h-64 mt-4">
            <svg width="350" height="100" viewBox="0 0 350 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_932_4270)">
                <path d={svgPath || "M0 50 L350 50"} stroke="#006A4E" strokeWidth="2" strokeLinecap="round" />
                <path d={svgPath || "M0 50 L350 50"} fill="url(#paint0_linear_932_4270)" fillOpacity="0.4" />
              </g>
              <defs>
                <linearGradient id="paint0_linear_932_4270" x1="175" y1="50" x2="175" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00FFBC" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#F7FAFE" />
                </linearGradient>
                <clipPath id="clip0_932_4270">
                  <rect width="350" height="100" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between gap-2 mt-4">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activePeriod === period
                    ? "bg-green-500 text-white"
                    : "bg-primary-color-4 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const transactions = [
  {
    type: "Withdraw",
    description: "You sent ₦10,000 to your bank account.",
    date: "27 Dec - 05:07",
    source: "Naira Wallet",
    destination: "External Bank Account",
    amount: "10,000",
    typeImage: require("../../assets/img/withdraw_icon.png"),
  },
  {
    type: "Deposit",
    description: "You received ₦5,000 from an external source.",
    date: "26 Dec - 09:45",
    source: "External Bank Account",
    destination: "Naira Wallet",
    amount: "5,000",
    typeImage: require("../../assets/img/transaction_icon_1.png"),
  },
  {
    type: "Sale",
    description: "You received ₦200,000 to your bank account.",
    date: "27 Dec - 05:07",
    source: "Naira Wallet",
    destination: "External Bank Account",
    amount: "200,000",
    typeImage: require("../../assets/img/transaction_icon_2.png"),
  },
  {
    type: "Withdraw",
    description: "You sent ₦20,000 to your bank account.",
    date: "27 Dec - 05:07",
    source: "Naira Wallet",
    destination: "External Bank Account",
    amount: "20,000",
    typeImage: require("../../assets/img/transaction_icon_1.png"),
  },
  {
    type: "Purchase",
    description: "You paid ₦100,000 to your bank account.",
    date: "27 Dec - 05:07",
    source: "Naira Wallet",
    destination: "External Bank Account",
    amount: "100,000",
    typeImage: require("../../assets/img/transaction_icon_2.png"),
  },
];

const CardTransactionTrack = () => {
  return (
    <div className="block w-full overflow-x-auto">
      <div className="relative w-full px-4 max-w-full flex-grow flex-1">
        <h3 className="font-semibold text-sm text-blueGray-700">Transactions</h3>
      </div>
      <div className="h-2 mx-4 my-2 border border-solid border-blueGray-100" />
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div
            key={index}
            className="bg-white my-1 rounded-my p-2 shadow-md"
            style={{ height: "70px", width: "100%", marginTop: "5px" }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img
                  src={transaction.typeImage}
                  alt={transaction.type}
                  className="w-8 h-8 rounded-full mr-4"
                  style={{ objectFit: "cover" }}
                />
                <div>
                  <span className="text-sm font-semibold text-blueGray-700">{transaction.type}</span>
                  <span className="block text-xs text-blueGray-500">
                    {transaction.description}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blueGray-700">
                  ₦{transaction.amount}
                </div>
                <div className="text-xs text-blueGray-500">{transaction.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CombinedComponent({ wallet }) {

  return (

    <>

      <CardLineChart wallet={wallet} />

      <CardTransactionTrack />

    </>

  );

}
