import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWalletData, setSelectedWallet, updateWallets } from "../../features/wallet/walletSlice";

const tokenNames = {
  BNB: "BNB BEP20",
  BTC: "Bitcoin",
  DOGE: "Doge coin",
  ETH: "Ethereum",
  SOL: "Solana",
  USDT: "USDT BEP20",
};

const tokenImages = {
  BNB: require("../../assets/img/bnb_icon_.png"),
  BTC: require("../../assets/img/bitcoin_icon.png"),
  DOGE: require("../../assets/img/xrp_icon_.png"),
  ETH: require("../../assets/img/ethereum_icon.png"),
  SOL: require("../../assets/img/solana_icon.png"),
  USDT: require("../../assets/img/usdt_icon_.png"),
};

export default function CardWalletOverview({ onSelectWallet }) {
  const dispatch = useDispatch();
  const { wallets, loading, selectedWallet, isFetched } = useSelector((state) => state.wallet);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchAllWalletData());
  }, [dispatch]);

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

  useEffect(() => {
    if (selectedWallet) {
      onSelectWallet(selectedWallet);
    }
  }, [selectedWallet, onSelectWallet]);

  const handleWalletClick = (wallet) => {
    dispatch(setSelectedWallet(wallet));
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full md:w-2/3 mb-6 rounded mx-auto bg-gradient-to-r from-blue-500 to-green-500">
      <div className="block w-full overflow-x-auto">
        <div className="flex flex-col space-y-4"></div>
          <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
            <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
            <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700 hidden md:block">Market Price</div>
            <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
          </div>

          {Object.keys(tokenNames).map((token, index) => {
            const wallet = wallets.find(w => w.abbr === token) || {};
            return (
              <div
                key={token}
                className={`rounded-my overflow-hidden ${
                  !loading && selectedWallet?.abbr === token ? "bg-blue-50" : ""
                }`}
                style={{ height: "80px", width: "100%" }}
              >
                <a
                  href={loading ? "#" : `/wallet/${token}`}
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
                  className={`wallet-row ${!loading && selectedWallet?.abbr === token ? "active" : ""}`}
                >
                  <div className="flex  md:flex-row justify-between">
                    <div className="w-full md:w-1/3 px-6 py-3">
                      <div className="flex items-center text-left">
                        <img
                          src={tokenImages[token]}
                          alt={token}
                          className="w-8 h-8 rounded mr-4"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <span className="text-sm font-bold hidden md:block">{token}</span>
                          <span className="text-xs block font-semibold md:mt-0" style={{ maxWidth: "100px" }}>
                            {tokenNames[token]}
                          </span>
                          <div className="flex items-center md:hidden">
                            <span className="text-xs">{wallet.marketPrice || "$0.00"}</span>
                            <span className={`text-xs ml-2 ${parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                              {wallet.marketPricePercentage || "0.0%"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 px-6 py-3 text-xs text-center hidden md:block">
                      {wallet.marketPrice || "$0.00"}
                      <span className={`text-xs ml-2 ${parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"}`}>
                        {wallet.marketPricePercentage || "0.0%"}
                      </span>
                    </div>
                    <div className="w-full md:w-1/3 px-6 py-3 text-xs text-right">
                      <div>
                        <span className="text-sm font-semibold">{wallet.equivalenceValue || "0.0"}</span>
                        <span className="text-xs block">{wallet.equivalenceValueAmount || "$0.00"}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
  );
}
