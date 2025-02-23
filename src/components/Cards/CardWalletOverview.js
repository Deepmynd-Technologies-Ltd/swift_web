import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWalletData, setSelectedWallet, updateWallets } from "../../features/wallet/walletSlice";

export default function CardWalletOverview({ onSelectWallet }) {
  const dispatch = useDispatch();
  const { wallets, loading, selectedWallet, isFetched } = useSelector((state) => state.wallet);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dummy placeholder data to maintain UI when loading
  const placeholderWallets = Array.from({ length: 5 }).map((_, index) => ({
    abbr: "",
    title: "Loading...",
    marketPrice: "$0.00",
    marketPricePercentage: "0.0%",
    equivalenceValue: "0.0",
    equivalenceValueAmount: "$0.00",
    typeImage: "https://via.placeholder.com/40", // Placeholder image URL
  }));

  // Handle initial data fetch
  useEffect(() => {
    dispatch(fetchAllWalletData());
  }, [dispatch]);

  // Periodically refresh wallet data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRefreshing) {
        setIsRefreshing(true);
        dispatch(fetchAllWalletData()).then((action) => {
          if (action.payload) {
            dispatch(updateWallets(action.payload));
          }
          setIsRefreshing(false);
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch, isRefreshing]);

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
    <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
      <div className="block w-full overflow-x-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
            <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
            <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700 hidden md:block">Market Price</div>
            <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
          </div>

          {(loading || !isFetched ? placeholderWallets : wallets).map((wallet, index) => (
            <div
              key={wallet?.abbr || index}
              className={`rounded-my overflow-hidden ${
                !loading && selectedWallet?.abbr === wallet?.abbr ? "bg-blue-50" : ""
              }`}
              style={{ height: "80px", width: "100%" }}
            >
              <a
                href={loading ? "#" : `/wallet/${wallet.abbr}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!loading) handleWalletClick(wallet);
                }}
                style={{
                  display: "block",
                  margin: "0.375rem 0",
                  borderRadius: "0.375rem",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "color 0.2s",
                }}
                className={`wallet-row ${!loading && selectedWallet?.abbr === wallet?.abbr ? "active" : ""}`}
              >
                <div className="flex justify-between">
                  <div className="w-1/3 px-6 py-3">
                    <div className="flex items-center text-left">
                      <img
                        src={wallet.typeImage}
                        alt={wallet.abbr}
                        className="w-8 h-8 rounded mr-4"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <span className="text-sm font-bold hidden md:block">{wallet.abbr}</span>
                        <span className="text-xs block font-semibold md:mt-0" style={{ maxWidth: "100px" }}>
                          {wallet.title}
                        </span>
                        <div className="flex items-center md:hidden">
                          <span className="text-xs">{wallet.marketPrice}</span>
                          <span className={`text-xs ml-2 ${parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                            {wallet.marketPricePercentage}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/3 px-6 py-3 text-xs text-center hidden md:block">
                    {wallet.marketPrice}
                    <span className={`text-xs ml-2 ${parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                      {wallet.marketPricePercentage}
                    </span>
                  </div>
                  <div className="w-1/3 px-6 py-3 text-xs text-right">
                    <div>
                      <span className="text-sm font-semibold">{wallet.equivalenceValue}</span>
                      <span className="text-xs block">{wallet.equivalenceValueAmount}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
