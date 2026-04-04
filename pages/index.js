import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [response, setResponse] = useState("");

  const fetchResources = async (stateName) => {
    setSelectedState(stateName);
    setResponse("Loading...");

    try {
      const res = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `What suicide prevention and mental health resources are available in ${stateName}? Include 988 and well-known statewide or national resources. Do not invent organizations.`
        })
      });

      const data = await res.json();
      setResponse(data.reply || "No response received.");
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResponse("Sorry, something went wrong while loading resources.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>
        Click a State for Mental Health Resources
      </h1>

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
                    default: { fill: "#D9D9D9", outline: "none" },
                    hover: { fill: "#A6A6A6", outline: "none", cursor: "pointer" },
                    pressed: { fill: "#737373", outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      {selectedState && (
        <div style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
          <h2 style={{ marginTop: 0 }}>Resources for {selectedState}</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
            {response}
          </pre>
        </div>
      )}
    </main>
  );
}