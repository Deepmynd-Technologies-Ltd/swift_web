import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWalletData, setSelectedWallet, updateWallets } from "../../features/wallet/walletSlice";
import Loading from "react-loading";

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
  const { wallets, loading, selectedWallet } = useSelector((state) => state.wallet);
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
        {loading || isRefreshing ? (
          <div className="flex justify-center items-center py-4">
            <Loading type="spinningBubbles" color="#006A4E" height={50} width={50} />
          </div>
        ) : null}
        <div className="flex flex-col space-y-4">
          <div className="w-full flex flex-row justify-between items-center bg-gray-100 rounded-t-lg py-3 px-4">
            <div className="text-sm font-semibold text-blueGray-700 flex-1">Token</div>
            <div className="text-sm font-semibold text-blueGray-700 flex-1 text-center">Market Price</div>
            <div className="text-sm font-semibold text-blueGray-700 flex-1 text-right">USD Equivalent</div>
          </div>

          {Object.keys(tokenNames).map((token) => {
            const wallet = wallets.find(w => w.abbr === token) || {};
            const formatNumber = (value) => {
              // If value is undefined or null, return a default string
              if (value === undefined || value === null) return "0";
              
              // Check if the value can be converted to a number
              const num = Number(value);
              
              // If the value isn't a valid number, return the original value as is
              if (isNaN(num)) return value.toString();
              
              // For billion values (≥1e9)
              if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
              
              // For million values (≥1e6)
              if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
              
              // For thousand values (≥1e3)
              if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
              
              // For numbers with decimal places
              if (num % 1 !== 0) return num.toFixed(2);
              
              // For integers
              return num.toString();
            };

            const isSelected = selectedWallet?.abbr === token;
            const textColorClass = isSelected ? "text-white" : "";

            return (
              <div
                key={token}
                className={`rounded-my overflow-hidden
                }`}
              >
                <a
                  href={`/wallet/${token}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleWalletClick(wallet);
                  }}
                  style={{
                    display: "block",
                    margin: "0.375rem 0",
                    borderRadius: "12px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "color 0.2s",
                    gap: "32px",
                  }}
                  className={`wallet-row ${isSelected ? "active" : ""}`}
                >
                  <div className="flex md:flex-row justify-between items-center h-full">
                    <div className="w-full md:w-1/3 px-6 py-3">
                      <div className="flex items-center text-left">
                        <img
                          src={tokenImages[token]}
                          alt={token}
                          className="w-12 h-12 rounded mr-4"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <span className={`text-sm font-bold hidden md:block ${textColorClass}`}>{token}</span>
                          <span className={`text-xs block font-semibold md:mt-0 ${textColorClass}`} style={{ maxWidth: "100px" }}>
                            {tokenNames[token]}
                          </span>
                          <div className="flex items-center md:hidden w-full">
                            <span className={`text-sm ${textColorClass}`}> ${formatNumber(wallet.marketPrice) || "0.00"}</span>
                            <span className={`text-sm ml-2 ${
                              isSelected ? "text-white" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"
                            }`}>
                              {formatNumber(wallet.marketPricePercentage) || "0.0"}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`w-full md:w-1/3 px-6 h-full flex items-center justify-center hidden md:flex ${textColorClass}`}>
                      <div>
                        <span className={`text-sm ${textColorClass}`}>${formatNumber(wallet.marketPrice) || "0.00"}</span>
                        <span className={`text-sm ml-2 ${
                          isSelected ? "text-white" : parseFloat(wallet.marketPricePercentage) >= 0 ? "text-green" : "text-red-500"
                        }`}>
                          {formatNumber(wallet.marketPricePercentage) || "0.0"}%
                        </span>
                      </div>
                    </div>
                    <div className={`w-full md:w-1/3 px-6 py-3 text-sm text-right ${textColorClass}`}>
                      <div>
                        <span className={`text-sm font-semibold ${textColorClass}`}>{formatNumber(wallet.equivalenceValue) + '.0' || "0"}</span>
                        <span className={`text-sm block ${textColorClass}`}>{formatNumber(wallet.equivalenceValueAmount) + '.0' || "$0"}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}