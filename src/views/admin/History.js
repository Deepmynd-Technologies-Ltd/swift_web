import React from "react";

// components

import CardPageVisits from "components/Cards/CardPageVisits.js";

export default function History() {
  return (
    <>
      <div className="align-center" style={{ width: "90%", overflow: "hidden", marginBottom: "8px"}}>
        <p className="text-white text-aeonik text-left text-2xl lg:inline-block font-bold flex items-start md:items-center p-4" style={{ marginTop: "-50px", marginLeft: "40px"}}>
          History
        </p>
        <CardPageVisits />
      </div>
    </>
  );
}
