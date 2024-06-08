import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as d3 from "d3";
import "./LineGraph_2nd.css";

const LineGraph = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = "exhb1";
        const date = new Date().toISOString().split("T")[0];

        const response = await axios.get(`http://localhost:4000/visitor`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });

        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const drawGraph = () => {
      if (data.length === 0) return;

      const margin = { top: 50, right: 100, bottom: 30, left: 65 };
      const width = 1456 - margin.left - margin.right;
      const height = 330 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();

      const g = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();

      const x = d3
        .scaleTime()
        .range([0, width])
        .domain([
          new Date(new Date().getFullYear(), 0, 1, 9, 0),
          new Date(new Date().getFullYear(), 0, 1, 18, 0),
        ]);

      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
          0,
          d3.max(data, d =>
            d3.max([
              d.current_population,
              d.yesterday_population,
              d.last_week_population,
              d.last_month_population,
            ])
          ) + 50,
        ]);

      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat("%H")))
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(8))
        .selectAll("text")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      g.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom + 15)
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular")
        .text("시간(시)");

      g.append("text")
        .attr("class", "axis-label")
        .attr("x", -margin.left + 46)
        .attr("y", -margin.top + 30)
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular")
        .text("인원(명)");

      const line = d3
        .line()
        .x(d =>
          x(
            new Date(
              new Date().getFullYear(),
              0,
              1,
              new Date(d.hour).getHours(),
              new Date(d.hour).getMinutes()
            )
          )
        )
        .y(d => y(d.value));

      const filteredDataToday = data.filter(
        d =>
          d.current_population != null &&
          new Date(d.hour).getHours() <= currentHour &&
          new Date(d.hour).getMinutes() <= currentMinute
      );

      g.append("path")
        .datum(filteredDataToday.map(d => ({
          hour: d.hour,
          value: d.current_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#EF476F")
        .attr("stroke-width", 3)
        .attr("d", line);

      const filteredDataYesterday = data.filter(
        d => d.yesterday_population !== null ? d.yesterday_population : 0
      );

      g.append("path")
        .datum(filteredDataYesterday.map(d => ({
          hour: d.hour,
          value: d.yesterday_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#55D1B1")
        .attr("stroke-width", 1)
        .attr("d", line);

      const filteredDataLastWeek = data.filter(
        d => d.last_week_population !== null ? d.last_week_population : 0
      );

      g.append("path")
        .datum(filteredDataLastWeek.map(d => ({
          hour: d.hour,
          value: d.last_week_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#3A9BBB")
        .attr("stroke-width", 1)
        .attr("d", line);

      const filteredDataLastMonth = data.filter(
        d => d.last_month_population !== null ? d.last_month_population : 0
      );

      g.append("path")
        .datum(filteredDataLastMonth.map(d => ({
          hour: d.hour,
          value: d.last_month_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#073B4C")
        .attr("stroke-width", 1)
        .attr("d", line);

      g.selectAll(".today-pivot")
        .data(filteredDataToday)
        .join(
          enter => enter.append("circle")
            .attr("class", "today-pivot")
            .attr("r", 7)
            .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
            .attr("cy", d => y(d.current_population))
            .attr("fill", "#EF476F")
            .on("mouseover", function (event, d) {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 9);

              const xDate = x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes()));
              const hourValue = new Date(d.hour).getHours();

              tooltip.html(
                `<div>${hourValue}시</div>
                <div>오늘: ${parseInt(d.current_population)}명</div>`
              )
                .style("visibility", "visible")
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mousemove", function (event) {
              tooltip
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 7);

              tooltip.style("visibility", "hidden");
            }),
          update => update,
          exit => exit.remove()
        );

      g.selectAll(".yesterday-pivot")
        .data(filteredDataYesterday)
        .join(
          enter => enter.append("circle")
            .attr("class", "yesterday-pivot")
            .attr("r", 5)
            .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
            .attr("cy", d => y(d.yesterday_population))
            .attr("fill", "#55D1B1")
            .on("mouseover", function (event, d) {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 7);

              const xDate = x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes()));
              const hourValue = new Date(d.hour).getHours();

              tooltip.html(
                `<div>${hourValue}시</div>
                <div>어제: ${parseInt(d.yesterday_population)}명</div>`
              )
                .style("visibility", "visible")
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mousemove", function (event) {
              tooltip
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 5);

              tooltip.style("visibility", "hidden");
            }),
          update => update,
          exit => exit.remove()
        );

      g.selectAll(".last-week-pivot")
        .data(filteredDataLastWeek)
        .join(
          enter => enter.append("circle")
            .attr("class", "last-week-pivot")
            .attr("r", 5)
            .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
            .attr("cy", d => y(d.last_week_population))
            .attr("fill", "#3A9BBB")
            .on("mouseover", function (event, d) {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 7);

              const xDate = x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes()));
              const hourValue = new Date(d.hour).getHours();

              tooltip.html(
                `<div>${hourValue}시</div>
                <div>지난주: ${parseInt(d.last_week_population)}명</div>`
              )
                .style("visibility", "visible")
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mousemove", function (event) {
              tooltip
                .style("top", `${event.pageY - 40}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX - 40}px`); // 피벗에 더 가깝게 조정
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 5);

              tooltip.style("visibility", "hidden");
            }),
          update => update,
          exit => exit.remove()
        );

      g.selectAll(".last-month-pivot")
        .data(filteredDataLastMonth)
        .join(
          enter => enter.append("circle")
            .attr("class", "last-month-pivot")
            .attr("r", 5)
            .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
            .attr("cy", d => y(d.last_month_population))
            .attr("fill", "#073B4C")
            .on("mouseover", function (event, d) {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 7);

              const xDate = x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes()));
              const hourValue = new Date(d.hour).getHours();

              tooltip.html(
                `<div>${hourValue}시</div>
                <div>지난달: ${parseInt(d.last_month_population)}명</div>`
              )
                .style("visibility", "visible")
                .style("top", `${event.pageY-300}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX-300}px`); // 피벗에 더 가깝게 조정
            })
            .on("mousemove", function (event) {
              tooltip
                .style("top", `${event.pageY-300}px`)  // 피벗에 더 가깝게 조정
                .style("left", `${event.pageX-300}px`); // 피벗에 더 가깝게 조정
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(100)
                .attr("r", 5);

              tooltip.style("visibility", "hidden");
            }),
          update => update,
          exit => exit.remove()
        );

      const tooltip = d3
        .select(tooltipRef.current)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "10px")
        .style("font-family", "Pretendard")
        .style("font-size", "16px")
        .style("font-weight", "regular")
        .style("width", "170px")
        .style("height", "auto")
        .style("line-height", "1.5")
        .style("overflow", "auto");

      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - 150}, 0)`); // 가로로 배치하고 30픽셀 위로 올림

      const legendData = [
        { color: "#EF476F", text: "오늘" },
        { color: "#55D1B1", text: "어제" },
        { color: "#3A9BBB", text: "지난주" },
        { color: "#073B4C", text: "지난달" },
      ];

      legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 80) // 가로로 배치
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => d.color);

      legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 80 + 24) // 가로로 배치
        .attr("y", 9)
        .attr("dy", "0.35em")
        .style("font-family", "Pretendard")
        .style("font-size", "16px")
        .text(d => d.text);
    };

    drawGraph();
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default LineGraph;
