import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const SmallLinePlot = ({
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
      .scaleTime()
      .domain([new Date(2000, 0, 1, 9, 0), new Date(2000, 0, 1, 18, 0)])
      .range([marginLeft, width - marginRight]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.today)])
      .nice()
      .range([height - marginBottom, marginTop]);

    const line = d3
      .line()
      .x(d => x(new Date(2000, 0, 1, d.hour, 0)))
      .y((d) => y(d.value));
      
    if (useCurve) {
      line.curve(d3.curveCardinal);
    }

    if (useAxis) {
      // Add x-axis
      svgElement
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");

      // Add y-axis
      svgElement
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#4b5563")
        .style("font-size", "12px");
    }

    // Add line
    svgElement
      .append("path")
      .datum(data.map(d => ({ hour: d.hour, value: d.today })))
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 6)
      .attr("d", line);

    if (useDp) {
      // Add data points
      svgElement
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr("cy", (d) => y(d.today))
        .attr("r", 4)
        .attr("fill", "#3498DB")
        .attr("stroke", "#3498DB")
        .attr("stroke-width", 5);
    }
  }, [data, height, marginBottom, marginLeft, marginRight, marginTop, width, color, useAxis, useDp, useCurve]);

  return <svg width={width} height={height} ref={svgRef}></svg>;
};

export default SmallLinePlot;
