import React from "react";

// components

import CardPageVisits from "components/Cards/CardPageVisits.js";

export default function History() {
  return (
    <>
      <div className="align-center" style={{ width: "90%", overflow: "hidden", marginBottom: "85px"}}>
        <div className="justify-center items-center" style={{ marginLeft: "10%"}}>
          <p className="text-white text-aeonik text-left text-2xl lg:inline-block font-bold flex items-start md:items-center p-4">
            History
          </p>
          <CardPageVisits />
        </div>
        </div>
    </>
  );
}
