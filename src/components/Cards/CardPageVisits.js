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

export default function CardPageVisits() {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-sm text-blueGray-700">
                Recent Transactions
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
              >
                See all
              </button>
            </div>
          </div>
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
            <tr>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Transaction Type
                </th>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Description
                </th>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Date
                </th>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Source
                </th>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Destination
                </th>
                <th className="px-6 text-blueGray-500 align-middle border border-solid py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Amount
                </th>
              </tr>
            </thead>
            
            <tbody className="space-y-4">
              {transactions.map((transaction, index) => (
                <tr key={index} className="rounded-my overflow-hidden" style={{ height: "80px", width: "100%" }}>
                  <td colSpan="6" className="p-0">
                    <div className="bg-white my-1.5 rounded-my">
                      <div className="flex">
                        <div className="w-1/6 px-6 py-3">
                          <div className="flex items-center">
                            <img
                              src={transaction.typeImage}
                              alt={transaction.type}
                              className="w-8 h-8 rounded-full mr-4"
                              style={{ objectFit: "cover" }}
                            />
                            <span className="text-sm font-semibold text-blueGray-700">{transaction.type}</span>
                          </div>
                        </div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">{transaction.description}</div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">{transaction.date}</div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">{transaction.source}</div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">{transaction.destination}</div>
                        <div className="w-1/6 px-6 py-3 text-sm font-bold text-blueGray-700">₦{transaction.amount}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
