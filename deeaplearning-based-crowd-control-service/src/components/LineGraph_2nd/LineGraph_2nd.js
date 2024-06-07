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
        // 이 부분은 클릭해서 값 받기
        const exhbId = "exhb1";
        const date = new Date().toISOString().split("T")[0]; // 현재 날짜

        // 백엔드 API에서 데이터 가져오기
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
    const intervalId = setInterval(fetchData, 60000); // 1분마다 데이터 fetching

    return () => clearInterval(intervalId); // 컴포넌트 unmount 시 interval 정리
  }, []);

  useEffect(() => {
    const drawGraph = () => {
      if (data.length === 0) return;

      const margin = { top: 50, right: 100, bottom: 30, left: 65 };
      const width = 1456 - margin.left - margin.right;
      const height = 330 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current);

      // 기존 요소 제거
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

      // x축 생성
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat("%H")))
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      // y축 생성
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
            new Date(d.hour).getHours() <= currentHour &&
            new Date(d.hour).getMinutes() <= currentMinute
        );
        
      // 오늘 관람객 수 라인 생성
      g.append("path")
        .datum(filteredDataToday.map(d => ({
          hour: d.hour,
          value: d.current_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#EF476F")
        .attr("stroke-width", 3)
        .attr("d", line);

      // 어제 관람객 수 라인 생성
      g.append("path")
        .datum(data.map(d => ({
          hour: d.hour,
          value: d.yesterday_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#55D1B1")
        .attr("stroke-width", 1)
        .attr("d", line);

      // 1주일 평균 관람객 수 라인 생성
      g.append("path")
        .datum(data.map(d => ({
          hour: d.hour,
          value: d.last_week_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#3A9BBB")
        .attr("stroke-width", 1)
        .attr("d", line);

      // 1달 평균 관람객 수 라인 생성
      g.append("path")
        .datum(data.map(d => ({
          hour: d.hour,
          value: d.last_month_population,
        })))
        .attr("fill", "none")
        .attr("stroke", "#073B4C")
        .attr("stroke-width", 1)
        .attr("d", line);

        g.selectAll(".today-pivot")
        .data(filteredDataToday)
        .exit()
        .remove();
      
      // 오늘 관람객 수 피벗 생성
      const todayPivot = g.selectAll(".today-pivot")
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
          <div>오늘: ${d.current_population}명</div>`
        )
          .style("visibility", "visible")
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
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
  .data(data.filter(d => {
    const pivotHour = new Date(d.hour).getHours();
    const pivotMinute = new Date(d.hour).getMinutes();
    return pivotHour < currentHour || (pivotHour === currentHour && pivotMinute <= currentMinute);
  }))
  .join(
    enter => enter.append("circle")
      .attr("class", "yesterday-pivot")
      .attr("r", 3)
      .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
      .attr("cy", d => y(d.yesterday_population))
      .attr("fill", "#55D1B1")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 5);

        tooltip.html(
          `<div>어제</div>
          <div>관람객 수: ${d.yesterday_population}명</div>`
        )
          .style("visibility", "visible")
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY - 20}px`)
          .style("left", `${event.pageX + 20}px`);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("r", 3);

        tooltip.style("visibility", "hidden");
      }),
    update => update,
    exit => exit.remove()
  );

      // 피벗 점 생성 (1주일 평균 관람객 수)
      g.selectAll(".last_week-pivot")
  .data(data.filter(d => {
    const pivotHour = new Date(d.hour).getHours();
    const pivotMinute = new Date(d.hour).getMinutes();
    return pivotHour < currentHour || (pivotHour === currentHour && pivotMinute <= currentMinute);
  }))
  .join(
        enter => enter.append("circle")
        .attr("class", "last_week-pivot")
        .attr("r", 3)
        .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours(), new Date(d.hour).getMinutes())))
        .attr("cy", d => y(d.last_week_population))
        .attr("fill", "#3A9BBB")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 5);

          tooltip.html(
            `<div>1주일 평균</div>
            <div>관람객 수: ${d.last_week_population}명</div>`
          )
            .style("visibility", "visible")
            .style("top", `${event.pageY - 20}px`)
            .style("left", `${event.pageX + 20}px`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", `${event.pageY - 20}px`)
            .style("left", `${event.pageX + 20}px`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 3);

          tooltip.style("visibility", "hidden");
        }),update => update,
        exit => exit.remove()
      );

      // 피벗 점 생성 (1달 평균 관람객 수)
      g.selectAll(".last_month-pivot")
  .data(data.filter(d => {
    const pivotHour = new Date(d.hour).getHours();
    const pivotMinute = new Date(d.hour).getMinutes();
    return pivotHour < currentHour || (pivotHour === currentHour && pivotMinute <= currentMinute);
  })).join(
        enter=>enter.append("circle")
        .attr("class", "last_month-pivot")
        .attr("r", 3)
        .attr("cx", d => x(new Date(new Date().getFullYear(), 0, 1, new Date(d.hour).getHours())))
        .attr("cy", d => y(d.last_month_population))
        .attr("fill", "#073B4C")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 5);

          tooltip.html(
            `<div>1달 평균</div>
            <div>관람객 수: ${d.last_month_population}명</div>`
          )
            .style("visibility", "visible")
            .style("top", `${event.pageY - 20}px`)
            .style("left", `${event.pageX + 20}px`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", `${event.pageY - 20}px`)
            .style("left", `${event.pageX + 20}px`);
        })
        .on("mouseout", function () {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("r", 3);

          tooltip.style("visibility", "hidden");
        }),
        update => update,
        exit => exit.remove()
      );

      // 툴팁 요소 생성
      const tooltip = d3.select(tooltipRef.current)
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

      // 범례 요소 생성
      const legendWidth = 200;
      const legendHeight = -70;
      const legendX = width - legendWidth - 120;
      const legendY = 10;
      const legendItemWidth = legendWidth / 2;

      const legend = g.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendX}, ${legendY})`);

      const legendItems = legend.selectAll(".legend-item")
        .data([
          { color: "#EF476F", label: "오늘" },
          { color: "#55D1B1", label: "어제" },
          { color: "#3A9BBB", label: "1주일 평균" },
          { color: "#073B4C", label: "1달 평균" }
        ])
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(${i * legendItemWidth}, 0)`);

      legendItems.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("y", legendHeight / 2 - 5)
        .attr("fill", d => d.color);

      legendItems.append("text")
        .attr("x", 15)
        .attr("y", legendHeight / 2)
        .attr("dy", "0.35em")
        .text(d => d.label)
        .attr("font-family", "Pretendard")
        .attr("font-weight", "regular")
        .attr("font-size", "14px");
    };

    drawGraph();
  }, [data]);

  return (
    <div className="line-graph-container">
      <svg ref={svgRef} className="line-graph"></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default LineGraph;
