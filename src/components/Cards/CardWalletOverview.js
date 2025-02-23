import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWalletData, setSelectedWallet, updateWallets } from "../../features/wallet/walletSlice";

export default function CardWalletOverview({ onSelectWallet }) {
  const dispatch = useDispatch();
  const { wallets, loading, selectedWallet, isFetched } = useSelector((state) => state.wallet);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle page refresh and initial load
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear localStorage flag on page refresh
      localStorage.removeItem('walletDataFetched');
    };

    // Add beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Check if this is a fresh page load
    const isFirstLoad = !localStorage.getItem('walletDataFetched');
    
    if (isFirstLoad || !isFetched) {
      dispatch(fetchAllWalletData());
      localStorage.setItem('walletDataFetched', 'true');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch, isFetched]);

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

  const shouldShowLoading = (loading && !isFetched) || (!localStorage.getItem('walletDataFetched') && loading);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
      <div className="block w-full overflow-x-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
            <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
            <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700 hidden md:block">Market Price</div>
            <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
          </div>
          {(shouldShowLoading ? Array.from({ length: 5 }) : wallets).map((wallet, index) => (
            <div
              key={wallet?.abbr || index}
              className={`rounded-my overflow-hidden ${
                !shouldShowLoading && selectedWallet?.abbr === wallet?.abbr ? "bg-blue-50" : ""
              }`}
              style={{ height: "80px", width: "100%" }}
            >
              <a
                href={shouldShowLoading ? "#" : `/wallet/${wallet.abbr}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (!shouldShowLoading) handleWalletClick(wallet);
                }}
                style={{
                  display: "block",
                  margin: "0.375rem 0",
                  borderRadius: "0.375rem",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "color 0.2s",
                }}
                className={`wallet-row ${!shouldShowLoading && selectedWallet?.abbr === wallet?.abbr ? "active" : ""}`}
              >
                <div className="flex justify-between">
                  <div className="w-1/3 px-6 py-3">
                    <div className="flex items-center text-left">
                      <img
                        src={shouldShowLoading ? require("../../assets/img/browser_icon.png") : wallet.typeImage}
                        alt={shouldShowLoading ? "loading" : wallet.abbr}
                        className="w-5 h-5 rounded mr-4"
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <span className="text-sm font-bold hidden md:block">{shouldShowLoading ? "" : wallet.abbr}</span>
                        <span className="text-xs block font-semibold md:mt-0" style={{ maxWidth: "100px" }}>
                          {shouldShowLoading ? "Loading..." : wallet.title}
                        </span>
                        <div className="flex items-center md:hidden">
                          <span className="text-xs">{shouldShowLoading ? "0.0" : wallet.marketPrice}</span>
                          <span className={`text-xs ml-2 ${shouldShowLoading ? "" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                            {shouldShowLoading ? "0.0%" : wallet.marketPricePercentage}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/3 px-6 py-3 text-xs text-center hidden md:block">
                    {shouldShowLoading ? "0.0" : wallet.marketPrice}
                    <span className={`text-xs ml-2 ${shouldShowLoading ? "" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                      {shouldShowLoading ? "0.0%" : wallet.marketPricePercentage}
                    </span>
                  </div>
                  <div className="w-1/3 px-6 py-3 text-xs text-right">
                    <div>
                      <span className="text-sm font-semibold">{shouldShowLoading ? "0.0" : wallet.equivalenceValue}</span>
                      <span className="text-xs block">{shouldShowLoading ? "0.0" : wallet.equivalenceValueAmount}</span>
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