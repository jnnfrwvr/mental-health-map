import React, { useState } from "react";
import dynamic from "next/dynamic";

const USAMap = dynamic(() => import("react-usa-map"), { ssr: false });

export default function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [response, setResponse] = useState(null);

  const stateNames = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas",
    KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts",
    MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
    NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
    NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma",
    OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
    TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
    WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
  };

  const mapHandler = async (event) => {
    const stateAbbrev = event.target.dataset.name;
    const stateName = stateNames[stateAbbrev];
    if (!stateName) return;

    setSelectedState(stateName);
    setResponse("Loading...");

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `What suicide prevention and mental health resources are in ${stateName}?` })
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Click a State for Mental Health Resources</h1>
      <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
        <USAMap onClick={mapHandler} />
      </div>
      {selectedState && (
        <div style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <h2>Resources for {selectedState}</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{response}</pre>
        </div>
      )}
    </main>
  );
}
