import React, { useState } from "react";
import PropTypes from "prop-types";

const Copya = ({ walletAddress }) => (
  <a
    className="text-sm text-blue-500"
    onClick={() => navigator.clipboard.writeText(walletAddress)}
  >
    <img
      src={require("../../assets/img/copy_image_1.png")}
      alt="Copy"
      className="w-4 h-4 rounded-full border-2"
      style={{ width: "20px", height: "20px", marginLeft: "20px" }}
    />
  </a>
);

const WalletIcon = () => (
  <img
    src={require("../../assets/img/just_an_icon.png")}
    alt="Icon"
    className="w-4 h-4 rounded-full border-2 border-blueGray-50 shadow"
    style={{ width: "20px", height: "20px", marginLeft: "20px" }}
  />
);

const VisibilityToggle = ({ hidden, onToggle }) => (
  <a
    className="absolute top-0 right-0 text-sm text-blue-500"
    onClick={onToggle}
  >
    <img
      src={require("../../assets/img/eye_viewing_icon.png")}
      alt={hidden ? "View Balance" : "Hide Balance"}
      className="rounded-full border-2 border-blueGray-50"
      style={{ width: "16px", height: "16px", marginRight: "130px" }}
    />
  </a>
);

const AssetCard = ({ title, amount, description, image }) => (
  <div
    className="flex flex-col justify-between bg-white bg-gray-100 rounded-my p-3 shadow-md"
    style={{ 
      width: "190px", 
      height: "150px", 
      borderRadius: "10px", 
      margin: "5px",
      marginTop: "5px",
      minWidth: "100px" 
    }}
  >
    <div style={{ marginTop: "8%", marginLeft: "5%" }}>
      <h6 className="text-lg font-semibold mb-1" style={{ fontSize: "18px", lineHeight: "29px" }}>
        {title}
      </h6>
      <p className="text-sm text-blueGray-700" style={{ fontSize: "12px", lineHeight: "16px" }}>
        ${amount}
      </p>
    </div>
    <img
      src={require("../../assets/img/north_east_arrow.png")}
      alt="Arrow"
      className="absolute w-4 h-4"
      style={{ width: "16px", height: "16px", marginLeft: "20%", marginTop: "4%" }}
    />
    <div className="flex items-center mt-4" style={{ marginBottom: "7%", marginLeft: "5%" }}>
      <img
        src={image}
        alt={title}
        className="w-12 h-12"
        style={{ borderRadius: "10px" }}
      />
      <p className="text-red-700" style={{ fontSize: "12px", lineHeight: "16px", marginLeft: "10px", color: "red" }}>
        {description}
      </p>
    </div>
  </div>
);

export default function CardStats({
  walletAddress,
  walletBalance,
  isHidden,
  statDescription,
  assets,
}) {
  const [hidden, setHidden] = useState(isHidden);

  return (
    <div className="relative flex flex-col min-w-0 break-words rounded mb-6 xl:mb-0 min-h-[300px]">
      <div className="flex-auto p-4">
        <div className="container flex flex-col lg:flex-row lg:justify-between gap-4 w-full">
          {/* Balance Card */}
          <div className="relative flex flex-col bg-white rounded-my shadow-lg p-4 mb-4 xl:mb-0 w-full lg:w-auto max-h-[300px]" style={{ maxHeight: "120px", minWidth: "220px" }}>
            <div className="relative mt-4">
              <p className="font-semibold text-3xl text-blueGray-700">
                {hidden ? `$${walletBalance}` : "••••••••"}
              </p>
              <p className="text-sm mt-2 text-blueGray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                <button className="text-xs bg-primary-color-3 text-green ml-3 w-8 rounded">WS</button>
              </p>
            </div>
          </div>

          {/* Transaction Grid Card */}
          <div className="relative bg-white rounded-my shadow-lg p-4 w-full lg:w-2/3" style={{ minHeight: "170px" }}>
            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1 text-red-500">
                    <i className="fas fa-send text-red-500 text-2xl pt-1 mb-1 block text-center group-hover:text-red-500"></i>
                    <span className="block text-xs font-semibold text-red-500 pb-2">Send</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-receive text-2xl pt-1 mb-1 block text-center group-hover:text-green"></i>
                    <span className="block text-xs font-semibold pb-2 text-green">Receive</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-scan text-2xl pt-1 mb-1 block text-center group-hover:text-purple-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-purple-500">Scan</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
            </div>

            <div className="flex grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-swap text-2xl pt-1 mb-1 block text-center group-hover:text-orange-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-orange-500">Swap</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-bAs text-2xl pt-1 mb-1 block text-center group-hover:text-lightBlue-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-lightBlue-500 whitespace-nowrap">Buy & Sell</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
              <div className="flex-1 group flex justify-center">
                <a href="#" className="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-indigo-500">
                  <span className="block px-1 pt-1 pb-1">
                    <i className="fas fa-p2p text-2xl pt-1 mb-1 block text-center group-hover:text-more-teal-500"></i>
                    <span className="block text-xs font-semibold pb-2 text-more-teal-500">P2P</span>
                    <span className="block w-5 mx-auto h-1 group-hover:bg-indigo-500 rounded-full"></span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


  CardStats.defaultProps = {
    walletAddress: "0x734hdyeh............ef27fhc64hbs5e54",
    walletBalance: "1,898.45",
    isHidden: true,
    statDescription: "Since last month",
    assets: [
    {
      title: "0.1 BTC",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
    {
      title: "2.5 ETH",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
    {
      title: "0.1 BTC",
      amount: "4,375.22",
      description: "-0.49%",
      image: require("../../assets/img/bitcoin_icon.png"),
    },
    ],
  };

  CardStats.propTypes = {
    walletAddress: PropTypes.string,
    walletBalance: PropTypes.string,
    isHidden: PropTypes.bool,
    statDescription: PropTypes.string,
    assets: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
    ),
  };
