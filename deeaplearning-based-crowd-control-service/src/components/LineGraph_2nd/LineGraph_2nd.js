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
        const userId = "user1";
        const exhbId = "exhb1";
        const date = "2024-05-30";
        // 백엔드 API에서 데이터 가져오기
        const response = await axios.get(
          `http://localhost:4000/visitor/query?userId=${userId}&exhbId=${exhbId}&date=${date}}`,
          {}
        );
        setData(response.data);
        if (response.status === 200) {
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          { hour: 9, today: 120, yesterday: 100, weekAvg: 150, monthAvg: 130 },
          { hour: 10, today: 180, yesterday: 160, weekAvg: 200, monthAvg: 170 },
          { hour: 11, today: 220, yesterday: 200, weekAvg: 250, monthAvg: 210 },
          { hour: 12, today: 280, yesterday: 260, weekAvg: 300, monthAvg: 270 },
          { hour: 13, today: 320, yesterday: 300, weekAvg: 350, monthAvg: 310 },
          { hour: 14, today: 360, yesterday: 340, weekAvg: 380, monthAvg: 350 },
          { hour: 15, today: 320, yesterday: 300, weekAvg: 350, monthAvg: 310 },
          { hour: 16, today: 280, yesterday: 260, weekAvg: 300, monthAvg: 270 },
          { hour: 17, today: 220, yesterday: 200, weekAvg: 250, monthAvg: 210 },
          { hour: 18, today: 180, yesterday: 160, weekAvg: 200, monthAvg: 170 },
        ];

        const margin = { top: 20, right: 20, bottom: 30, left: 60 };
        const width = 1650 - margin.left - margin.right;
        const height = 330 - margin.top - margin.bottom;

        // x축을 시간 단위로 변경
        const x = d3
          .scaleTime()
          .range([0, width])
          .domain([new Date(2000, 0, 1, 9, 0), new Date(2000, 0, 1, 18, 0)]);
        const y = d3.scaleLinear().range([height, 0]).domain([0, 400]);

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // x축 생성
        svg
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${height})`)
          .call(
            d3
              .axisBottom(x)
              .ticks(d3.timeHour.every(1))
              .tickFormat(d3.timeFormat("%H"))
          )
          .attr("font-family", "Pretendard")
          .attr("font-size", "20px")
          .attr("font-weight", "medium");

        // y축 생성
        svg
          .append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(y).ticks(8))
          .selectAll("text")
          .attr("font-family", "Pretendard")
          .attr("font-size", "20px")
          .attr("font-weight", "regular");

        const transition = d3.transition().duration(1000); // 애니메이션 지속 시간 1초

        // 라인 생성 함수 (x축을 시간으로 변경)
        const line = d3
          .line()
          .curve(d3.curveMonotoneX) // 곡선 보간 추가
          .x((d) => x(new Date(2000, 0, 1, d.hour, 0)))
          .y((d) => y(d.value));

        // 라인 생성 2. 어제의 관람객
        const yesterdayLine = svg
          .append("path")
          .datum(data.map((d) => ({ hour: d.hour, value: d.yesterday })))
          .attr("fill", "none")
          .attr("stroke", "#DADADA")
          .attr("stroke-width", 8)
          .attr("d", line);

        // 라인 생성 3. 1주일 평균 관람객
        const weekAvgLine = svg
          .append("path")
          .datum(data.map((d) => ({ hour: d.hour, value: d.weekAvg })))
          .attr("fill", "none")
          .attr("stroke", "#DADADA")
          .attr("stroke-width", 8)
          .attr("d", line);

        // 라인 생성 4. 1달 평균 관람객
        const monthAvgLine = svg
          .append("path")
          .datum(data.map((d) => ({ hour: d.hour, value: d.monthAvg })))
          .attr("fill", "none")
          .attr("stroke", "#DADADA")
          .attr("stroke-width", 8)
          .attr("d", line);

        // 1시간 단위 피벗 생성 (4개 라인 모두)
        const pivots = svg
          .selectAll(".pivot")
          .data(data)
          .enter()
          .append("g")
          .attr("class", "pivot");

        pivots
          .append("circle")
          .attr("r", 8)
          .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
          .attr("cy", (d) => y(d.yesterday))
          .attr("fill", "#c1c1c1"); // 어제

        pivots
          .append("circle")
          .attr("r", 8)
          .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
          .attr("cy", (d) => y(d.weekAvg))
          .attr("fill", "#c1c1c1"); // 1주일 평균

        pivots
          .append("circle")
          .attr("r", 8)
          .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
          .attr("cy", (d) => y(d.monthAvg))
          .attr("fill", "#c1c1c1"); // 1달 평균

        // 라인 생성 1. 오늘의 관람객
        const todayLine = svg
          .append("path")
          .datum(data.map((d) => ({ hour: d.hour, value: d.today })))
          .attr("fill", "none")
          .attr("stroke", "#3498DB")
          .attr("stroke-width", 8)
          .attr("d", line);

        pivots
          .append("circle")
          .attr("r", 10)
          .attr("cx", (d) => x(new Date(2000, 0, 1, d.hour, 0)))
          .attr("cy", (d) => y(d.today))
          .attr("fill", "#3498DB"); // 오늘
        // 점선 생성
        const verticalLine = svg
          .append("line")
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "5, 5");

        pivots
          .selectAll("circle")
          .on("mouseover", function (event, d) {
            // pivots.on (피벗에 커서 올리면 수직 점선과 툴팁 출력)시작
            d3.select(this).transition().duration(100).attr("r", 12); // 피벗 크기 커지게 하기

            const xDate = x(new Date(2000, 0, 1, d.hour, 0)); // 피벗의 x 좌표(시간) 구하기
            const hourValue = d.hour; // 피벗의 시간값 구하기

            verticalLine
              .attr("x1", xDate)
              .attr("x2", xDate)
              .attr("y1", y(400))
              .attr("y2", y(0));

            const toolTipData = data.find((datum) => datum.hour === hourValue);

            tooltip
              .html(
                `<div>${hourValue}시</div>
                <div>오늘: ${toolTipData.today}명</div>
                <div>어제: ${toolTipData.yesterday}명</div>
                <div>1주일 평균: ${toolTipData.weekAvg}명</div>
                <div>1달 평균: ${toolTipData.monthAvg}명</div>`
              )
              .style("visibility", "visible")
              .style("top", `${event.pageY - 20}px`)
              .style("left", `${event.pageX + 20}px`);
          }) // pivots.on (피벗에 커서 올리면 수직 점선과 툴팁 출력) 마무리

          .on("mousemove", function (event) {
            tooltip
              .style("top", `${event.pageY - 20}px`)
              .style("left", `${event.pageX + 20}px`);
          })

          .on("mouseout", function () {
            // pivots.on (피벗에서 커서를 떼면 피벗 크기 원래대로, 수직 점선과 툴팁 사라짐) 시작
            d3.select(this).transition().duration(100).attr("r", 10); // 피벗 크기 원래대로

            tooltip.style("visibility", "hidden");
            verticalLine
              .attr("x1", null)
              .attr("x2", null)
              .attr("y1", null)
              .attr("y2", null);
          }); // pivots.on (피벗에서 커서를 떼면 피벗 크기 원래대로, 수직 점선과 툴팁 사라짐) 마무리

        // 툴팁 생성
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
          .style("width", "120px")
          .style("height", "120px")
          .style("line-height", "1.5")
          .style("overflow", "auto");
      } catch (error) {
        console.error("Error fetching data :", error);
      }
    };
    fetchData();
  }, [data]);

  return (
    <div className="line-graph-container">
      <svg ref={svgRef} className="line-graph"></svg>
      <div ref={tooltipRef}></div>
    </div>
  );
};

export default LineGraph;
