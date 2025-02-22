import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux store

export default function CardPageVisits() {
  // Fetch transactions from the Redux store
  const transactions = useSelector((state) => state.transactions.transactions);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Transaction Type
                </th>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Description
                </th>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Date
                </th>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Source
                </th>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Destination
                </th>
                <th className="px-6 text-blueGray-500 align-middle py-3 text-xs border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="space-y-4">
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="rounded-my overflow-hidden"
                  style={{ height: "80px", width: "100%" }}
                >
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
                            <span className="text-sm font-semibold text-blueGray-700">
                              {transaction.type}
                            </span>
                          </div>
                        </div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">
                          {transaction.description}
                        </div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">
                          {transaction.date}
                        </div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">
                          {transaction.source}
                        </div>
                        <div className="w-1/6 px-6 py-3 text-xs text-blueGray-500">
                          {transaction.destination}
                        </div>
                        <div className="w-1/6 px-6 py-3 text-sm font-bold text-blueGray-700">
                          ₦{transaction.amount}
                        </div>
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
