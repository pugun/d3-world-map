import React, { useRef, useEffect, useState } from "react";
import { select, geoPath, geoMercator, min, max, scaleLinear } from "d3";
import useResizeObserver from "./useResizeObserver";
import "./App.css";

function GeoChart({ data, property }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    console.log("selectedCountry", selectedCountry);
    console.log("0", data.features[0]);
  }, [selectedCountry]);

  useEffect(() => {
    const svg = select(svgRef.current);

    const minProp = min(
      data.features,
      (feature) => feature.properties[property]
    );
    const maxProp = max(
      data.features,
      (feature) => feature.properties[property]
    );
    console.log(minProp, maxProp);

    const colorScale = scaleLinear()
      .domain([minProp, maxProp])
      .range(["#ccc", "red"]);

    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    const projection = geoMercator()
      .fitSize([width, height], selectedCountry || data)
      .precision(100);

    const pathGenerator = geoPath().projection(projection);

    svg
      .selectAll(".country")
      .data(data.features)
      .join("path")
      .on("click", (e, feature) => {
        console.log(feature.path);
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr("class", "country")
      .transition()
      .duration(1000)
      .attr("fill", (feature) => colorScale(feature.properties[property]))
      .attr("d", (feature) => pathGenerator(feature));

    svg
      .selectAll(".label")
      .data([selectedCountry])
      .join("text")
      .attr("class", "label")
      .text(
        (feature) =>
          feature &&
          `${feature.properties.name}: ${feature.properties[
            property
          ].toLocaleString()}`
      )
      .attr("x", 10)
      .attr("y", 25);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg
        style={{
          width: "-webkit-fill-available",
          height: "500px",
        }}
        ref={svgRef}
      ></svg>
    </div>
  );
}

export default GeoChart;
