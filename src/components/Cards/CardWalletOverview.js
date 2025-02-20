import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchWalletData, setSelectedWallet } from "../../features/wallet/walletSlice";
import LoadingInterface from "../../components/Cards/LoadingInterface";

export default function CardWalletOverview({ onSelectWallet }) {
  const dispatch = useDispatch();
  const { transactions, loading, selectedWallet } = useSelector((state) => state.wallet);

  // Fetch wallet data on component mount
  useEffect(() => {
    dispatch(fetchWalletData());
  }, [dispatch]);

  // Notify parent component when selected wallet changes
  useEffect(() => {
    if (selectedWallet) {
      onSelectWallet(selectedWallet);
    }
  }, [selectedWallet, onSelectWallet]);

  const handleWalletClick = (wallet) => {
    dispatch(setSelectedWallet(wallet));
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-primary-color-4 flex justify-center items-center z-50 h-screen w-full top-0 left-0 z-100">
          <div className="bg-white rounded-my shadow-lg p-8">
            <LoadingInterface loading={loading} />
          </div>
        </div>
      )}
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="block w-full overflow-x-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
              <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
              <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700 hidden md:block">Market Price</div>
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
                          <span className="text-sm font-bold hidden md:block">{transaction.abbr}</span>
                          <span className="text-xs block font-semibold md:mt-0" style={{ maxWidth: "100px" }}>
                            {transaction.title}
                          </span>
                          <div className="flex items-center md:hidden">
                            <span className="text-xs">{transaction.marketPrice}</span>
                            <span className={`text-xs ml-2 ${parseFloat(transaction.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                              {transaction.marketPricePercentage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-center hidden md:block">
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