import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWalletData, setSelectedWallet, updateWallets } from "../../features/wallet/walletSlice";
import LoadingInterface from "../../components/Cards/LoadingInterface";

export default function CardWalletOverview({ onSelectWallet }) {
  const dispatch = useDispatch();
  const { wallets, loading, selectedWallet, isFetched } = useSelector((state) => state.wallet);

  // Fetch wallet data on component mount
  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchAllWalletData());
    }
  }, [dispatch, isFetched]);

  // Periodically refresh wallet data (e.g., every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAllWalletData()).then((action) => {
        if (action.payload) {
          dispatch(updateWallets(action.payload)); // Update wallet details
        }
      });
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
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
    {/* {loading && (
        <div className="fixed inset-0 bg-primary-color-4 flex justify-center items-center z-50 h-screen w-full top-0 left-0 z-100">
          <div className="bg-white rounded-my shadow-lg p-8">
            <LoadingInterface loading={loading} />
          </div>
        </div>
      )} */}
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="block w-full overflow-x-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
              <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
              <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700 hidden md:block">Market Price</div>
              <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
            </div>
            {(loading && !isFetched ? Array.from({ length: 5 }) : wallets).map((wallet, index) => (
              <div
                key={index}
                className={`rounded-my overflow-hidden ${
                  !loading && selectedWallet?.abbr === wallet?.abbr ? "bg-blue-50" : ""
                }`}
                style={{ height: "80px", width: "100%" }}
              >
                <a
                  href={loading && !isFetched ? "#" : `/wallet/${wallet.abbr}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!loading || isFetched) handleWalletClick(wallet);
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
                          src={loading && !isFetched ? require("../../assets/img/browser_icon.png") : wallet.typeImage}
                          alt={loading && !isFetched ? "loading" : wallet.abbr}
                          className="w-5 h-5 rounded mr-4"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <span className="text-sm font-bold hidden md:block">{loading && !isFetched ? "" : wallet.abbr}</span>
                          <span className="text-xs block font-semibold md:mt-0" style={{ maxWidth: "100px" }}>
                            {loading && !isFetched ? "Loading..." : wallet.title}
                          </span>
                          <div className="flex items-center md:hidden">
                            <span className="text-xs">{loading && !isFetched ? "0.0" : wallet.marketPrice}</span>
                            <span className={`text-xs ml-2 ${loading && !isFetched ? "" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                              {loading && !isFetched ? "0.0%" : wallet.marketPricePercentage}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-center hidden md:block">
                      {loading && !isFetched ? "0.0" : wallet.marketPrice}
                      <span className={`text-xs ml-2 ${loading && !isFetched ? "" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                        {loading && !isFetched ? "0.0%" : wallet.marketPricePercentage}
                      </span>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-right">
                      <div>
                        <span className="text-sm font-semibold">{loading && !isFetched ? "0.0" : wallet.equivalenceValue}</span>
                        <span className="text-xs block">{loading && !isFetched ? "0.0" : wallet.equivalenceValueAmount}</span>
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