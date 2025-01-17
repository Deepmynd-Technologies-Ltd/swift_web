import React from "react";

// Example dynamic data for transactions
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

export default function CardTransactionTrack() {
  return (
    <>
      <div className="block w-full overflow-x-auto">
        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 className="font-semibold text-sm text-blueGray-700">
            Transactions
          </h3>
        </div>
        <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" />
        <div className="space-y-4"> {/* Increased spacing between rows */}
          {transactions.map((transaction, index) => (
            <div key={index} className="bg-white my-1 rounded-my p-4 shadow-md"style={{ height: "70px", width: "100%" }}>
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
}
