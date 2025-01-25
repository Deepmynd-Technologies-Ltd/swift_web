import React, { useState } from "react";
import CardStats from "components/Cards/CardStats";
import CombinedComponent from "components/Cards/CardTransactionTrack";
import CardWalletOverview from "components/Cards/CardWalletOverview.js";

export default function Dashboard() {
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleSelectWallet = (activeWallet) => {
    setSelectedWallet(activeWallet); // Update the selected wallet state
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4" style={{ flex: "0 0 60%" }}>
        <CardStats />
        <CardWalletOverview
          selectedWallet={selectedWallet}
          onSelectWallet={handleSelectWallet}
        />
      </div>
      <div className="w-full xl:w-5/12 px-4" style={{ flex: "0 0 40%" }}>
        <CombinedComponent wallet={selectedWallet} />
      </div>
    </div>
  );
}
