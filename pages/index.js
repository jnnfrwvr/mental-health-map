import React, { useState } from "react";
import resources from "../data/resources";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

export default function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [response, setResponse] = useState("");

  const fetchResources = (stateName) => {
  setSelectedState(stateName);

  const stateResources = resources[stateName];

  if (!stateResources) {
    setResponse("We do not have verified resources for this state yet.");
    return;
  }

  setResponse(stateResources);
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
