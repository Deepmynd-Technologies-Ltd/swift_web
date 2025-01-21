import React, { useState } from "react";
import { LineChart, Line, Area, Tooltip, ResponsiveContainer } from "recharts";

const CardLineChart = () => {
  const [activePeriod, setActivePeriod] = useState("1H");

  const timePeriodsData = {
    "1H": [
      { name: "0min", value: 50 },
      { name: "15min", value: 40 },
      { name: "30min", value: 300 },
      { name: "45min", value: 220 },
      { name: "60min", value: 500 },
    ],
    "1D": [
      { name: "00:00", value: 100 },
      { name: "06:00", value: 200 },
      { name: "12:00", value: 150 },
      { name: "18:00", value: 400 },
      { name: "24:00", value: 300 },
    ],
    "1W": [
      { name: "Mon", value: 200 },
      { name: "Tue", value: 300 },
      { name: "Wed", value: 250 },
      { name: "Thu", value: 450 },
      { name: "Fri", value: 500 },
      { name: "Sat", value: 300 },
      { name: "Sun", value: 400 },
    ],
    "1M": [
      { name: "Week 1", value: 1000 },
      { name: "Week 2", value: 1500 },
      { name: "Week 3", value: 1200 },
      { name: "Week 4", value: 2000 },
    ],
    "ALL": [
      { name: "Jan", value: 1000 },
      { name: "Feb", value: 1500 },
      { name: "Mar", value: 1200 },
      { name: "Apr", value: 2000 },
      { name: "May", value: 1800 },
      { name: "Jun", value: 2400 },
    ],
  };

  const periods = ["1H", "1D", "1W", "1M", "ALL"];

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="items-center">
          <h2 className="text-3xl text-center font-bold mb-1">0.1 BTC</h2>
          <p className="text-xs text-center mb-4 text-blueGray-500">$ 25,000 USDT</p>
          <p className="text-base font-bold font-medium mt-8">Current BTC Price</p>
          <p className="text-xs text-blueGray-500">
            0.0095 BTC <span className="text-red-500 ml-4">-0.49%</span>
          </p>
        </div>

        <div className="flex-auto">
          <div className="relative h-64" style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timePeriodsData[activePeriod]}
                margin={{ top: 20, right: 20, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient
                    id="greenGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#065F46" stopOpacity={0.9} />
                    <stop offset="50%" stopColor="#10B981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="url(#greenGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#065F46"
                  strokeWidth={3}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                  formatter={(value) => [`${value} units`, "Value"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activePeriod === period
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
    description: "You recieved ₦200,000 to your bank account.",
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
    <>
      <div className="block w-full overflow-x-auto">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-sm text-blueGray-700">
            Transactions
          </h3>
        </div>
        <div className="h-2 mx-4 my-2 border border-solid border-blueGray-100" />
        <div className="space-y-4"> {/* Increased spacing between rows */}
          {transactions.map((transaction, index) => (
            <div key={index} className="bg-white my-1 rounded-my p-2 shadow-md"style={{ height: "70px", width: "100%", marginTop: "5px" }}>
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
                    <span className="block text-xs text-blueGray-500">{transaction.description}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blueGray-700">₦{transaction.amount}</div>
                  <div className="text-xs text-blueGray-500">{transaction.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default function CombinedComponent() {
  return (
    <>
      <CardLineChart />
      <CardTransactionTrack />
    </>
  );
}
