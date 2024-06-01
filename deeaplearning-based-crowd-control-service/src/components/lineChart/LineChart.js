import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const LinePlot = ({
  data = [],
  width,
  height,
  color,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 50,
  marginLeft = 40,
  useAxis,
  useDp,
  useCurve,
}) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      console.error("Data is required and must not be empty");
      return;
    }

    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - marginBottom, marginTop]);

    const line = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d));
    if (useCurve) {
      line.curve(d3.curveCardinal);
    }

    if (useAxis) {
      // Add x-axis
      svgElement
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSize(0)) // Removed tickSize
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");

      // Add y-axis
      svgElement
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickSize(0)) // Removed tickSize
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");
    }

    // Add line
    svgElement
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 8)
      .attr("d", line);

    if (useDp) {
      // Add data points
      svgElement
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => x(i))
        .attr("cy", (d) => y(d))
        .attr("r", 12)
        .attr("fill", "#3498DB")
        .attr("stroke", "white")
        .attr("stroke-width", 0.5);
    }
  }, [data, height, marginBottom, marginLeft, marginRight, marginTop, width]);

  return <svg width={width} height={height} ref={svgRef}></svg>;
};

export default LinePlot;
