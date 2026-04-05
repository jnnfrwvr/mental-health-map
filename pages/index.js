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
      setResponse(
        "We’re actively expanding verified resources. Please check back soon or use 988 for immediate support."
      );
      return;
    }

    setResponse(stateResources);
  };

  return (
    <main
      style={{
        padding: "1rem",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0"
      }}
    >
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: "bold",
          textAlign: "center"
        }}
      >
        Find Verified Mental Health Resources by State
      </h1>

      <div style={{ maxWidth: "100%", margin: "1rem 0" }}>
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
                    hover: {
                      fill: "#A6A6A6",
                      outline: "none",
                      cursor: "pointer"
                    },
                    pressed: { fill: "#737373", outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      {selectedState && (
        <div
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem"
          }}
        >
          <h2 style={{ marginTop: 0 }}>Resources for {selectedState}</h2>

          {!response ? (
            <p>Loading resources...</p>
          ) : typeof response === "string" || !response.resources ? (
            <p>
              {typeof response === "string"
                ? response
                : "We’re actively expanding verified resources. Please check back soon or use 988 for immediate support."}
            </p>
          ) : (
            <div>
              <p>
                <strong>Crisis Support:</strong>{" "}
                <a href={response.crisisUrl} target="_blank" rel="noreferrer">
                  {response.crisisLine}
                </a>
              </p>

              <ul style={{ paddingLeft: "1.25rem" }}>
                {response.resources.map((item, index) => (
                  <li key={index} style={{ marginBottom: "1rem" }}>
                    <strong>{item.name}</strong>
                    <br />
                    Phone: {item.phone}
                    <br />
                    Website:{" "}
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
