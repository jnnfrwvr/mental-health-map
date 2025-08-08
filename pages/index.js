import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [response, setResponse] = useState(null);

  const fetchResources = async (stateName) => {
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
        <ComposableMap projection="geoAlbersUsa">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => fetchResources(geo.properties.name)}
                  style={{
                    default: { fill: "#DDD", outline: "none" },
                    hover: { fill: "#999", outline: "none", cursor: "pointer" },
                    pressed: { fill: "#555", outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
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
