import React from "react";

// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardStats from "components/Cards/CardStats";
import CombinedComponent from "components/Cards/CardTransactionTrack";
import CardWalletOverview from "components/Cards/CardWalletOverview.js";

export default function Dashboard() {
  return (
    <>
      <div className="flex ">
        <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4" style={{ flex: "0 0 60%" }}>
          <CardStats />
          <CardWalletOverview />
        </div>
        <div className="w-full xl:w-5/12 px-4" style={{ flex: "0 0 40%" }}>
          <CombinedComponent />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        {/* <div className="w-full xl:w-4/12 px-4">
          <CardSocialTraffic />
        </div> */}
      </div>
    </>
  );
}
