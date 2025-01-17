import React from "react";

// Example dynamic data for transactions
const transactions = [
  {
    abbr: "BNB",
    title: "Binance coin",
    marketPrice: "$ 400.50",
    marketPricePercentage: "1.23%",
    equivalenceValue: "1.5",
    equivalenceValueAmount: "$ 600.75",
    typeImage: require("../../assets/img/bnb_icon.png"), 
  },
  {
    abbr: "BTC",
    title: "Bitcoin",
    marketPrice: "$ 50,000.26",
    marketPricePercentage: "0.701%",
    equivalenceValue: "0.1",
    equivalenceValueAmount: "$ 4,345.02",
    typeImage: require("../../assets/img/bitcoin_icon.png"), 
  },
  {
    abbr: "DOGE",
    title: "Doge coin",
    marketPrice: "$ 0.25",
    marketPricePercentage: "2.45%",
    equivalenceValue: "1000",
    equivalenceValueAmount: "$ 250.00",
    typeImage: require("../../assets/img/xrp_icon.png"), 
  },
  {
    abbr: "ETH",
    title: "Ethereum",
    marketPrice: "$ 3,500.00",
    marketPricePercentage: "0.98%",
    equivalenceValue: "2.5",
    equivalenceValueAmount: "$ 7,000.00",
    typeImage: require("../../assets/img/ethereum_icon.png"), 
  },
  {
    abbr: "SOL",
    title: "Solana",
    marketPrice: "$ 150.00",
    marketPricePercentage: "1.56%",
    equivalenceValue: "10",
    equivalenceValueAmount: "$ 1,500.00",
    typeImage: require("../../assets/img/solana_icon.png"), 
  },
  {
    abbr: "USDT",
    title: "USDT BEP20",
    marketPrice: "$ 1.00",
    marketPricePercentage: "0.01%",
    equivalenceValue: "1000",
    equivalenceValueAmount: "$ 1,000.00",
    typeImage: require("../../assets/img/usdt_icon.png"), 
  }
];

export default function CardWalletOverview() {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-2/3 mb-6 rounded mx-auto">
        <div className="block w-full overflow-x-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between bg-gray-100 px-6 py-3 rounded-t">
              <div className="w-1/3 text-left text-xs font-semibold text-blueGray-700">Token</div>
              <div className="w-1/3 text-center text-xs font-semibold text-blueGray-700">Market Price</div>
              <div className="w-1/3 text-right text-xs font-semibold text-blueGray-700">USD Equivalent</div>
            </div>
            {transactions.map((transaction, index) => (
              <div key={index} className="rounded-my overflow-hidden" style={{ height: "80px", width: "100%" }}>
                <a href={`/wallet/${transaction.abbr}`} className="wallet-row block my-1.5 rounded-my hover:text-white active:text-white">
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
                          <span className="text-sm font-semibold text-blueGray-700">{transaction.abbr}</span>
                          <span className="text-xs text-blueGray-400 block" style={{ maxWidth: "100px" }}>{transaction.title}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/3 px-6 py-3 text-xs text-blueGray-500 text-center">
                      {transaction.marketPrice}
                      <span className="text-xs text-green-500 ml-2">{transaction.marketPricePercentage}</span>
                    </div>

                    <div className="w-1/3 px-6 py-3 text-xs text-blueGray-500 text-right">
                      <div>
                        <span className="text-sm font-semibold text-blueGray-700">{transaction.equivalenceValue}</span>
                        <span className="text-xs text-blueGray-400 block">{transaction.equivalenceValueAmount}</span>
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
