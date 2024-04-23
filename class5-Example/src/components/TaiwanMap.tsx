import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import taiwanTowns from "taiwan-atlas/towns-10t.json";
import taiwanTownsMercator from "taiwan-atlas/towns-mercator-10t.json";
import taiwanNation from "taiwan-atlas/nation-10t.json";
import taiwanCounties from "taiwan-atlas/counties-10t.json";
import taiwanDistricts from "taiwan-atlas/districts-10t.json";
import taiwanVillages from "taiwan-atlas/villages-10t.json";
import mercatorTw from "taiwan-atlas";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const MapContainer = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 200px;
`;

const Select = styled.select`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

function TaiwanMap() {
  const svgRef = useRef(null);
  const [mode, setMode] = useState("Towns");
  const [color, setColor] = useState("COUNTYID");

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear the svg to reset when data updates
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    svg.attr("width", width).attr("height", height);

    // Initialize and use the custom projection function
    const projection = mercatorTw();
    const pathGenerator = d3.geoPath().projection(projection);

    // Define a color scale for towns
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    let geoData;
    switch (mode) {
      case "Towns":

        geoData = feature(taiwanTowns, taiwanTowns.objects.towns);
        break;
      case "Nation":
        geoData = feature(taiwanNation, taiwanNation.objects.nation);
        break;
      case "Counties":
        geoData = feature(taiwanCounties, taiwanCounties.objects.counties);
        break;
      case "Districts":
        geoData = feature(taiwanDistricts, taiwanDistricts.objects.districts);
        break;
      case "Villages":
        geoData = feature(taiwanVillages, taiwanVillages.objects.villages);
        break;
      default:
        geoData = feature(taiwanTowns, taiwanTowns.objects.towns);
    }

    const mercatorData = feature(taiwanTownsMercator, taiwanTownsMercator.objects.towns);

    // Draw towns with Mercator projection data
    svg.selectAll(".town-mercator")
      .data(mercatorData.features)
      .enter()
      .append("path")
      .attr("class", "town-mercator")
      .attr("d", pathGenerator)
      .attr("fill", "lightblue")
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

    // Draw features based on the selected mode
    svg.selectAll(".feature")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("class", "feature")
      .attr("d", pathGenerator)
      .attr("fill", d => colorScale(d.properties[color]))
      .attr("stroke", "#333");

  }, [color, mode]);

  return (
    <Layout>
      <MapContainer>
        <svg ref={svgRef} width="800" height="600"></svg>
      </MapContainer>
      <ControlsContainer>
        <Label htmlFor="mode-select">Select Mode:</Label>
        <Select id="mode-select" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="Nation">Nation</option>
          <option value="Counties">Counties</option>
          <option value="Districts">Districts</option>
          <option value="Towns">Towns</option>
          <option value="Villages">Villages</option>
        </Select>
        <Label htmlFor="color-select">Select Color:</Label>
        <Select id="color-select" value={color} onChange={(e) => setColor(e.target.value)}>
          <option value="COUNTYID">County ID</option>
          <option value="TOWNID">Town ID</option>
        </Select>
      </ControlsContainer>
    </Layout>
  );
}

export default TaiwanMap;
