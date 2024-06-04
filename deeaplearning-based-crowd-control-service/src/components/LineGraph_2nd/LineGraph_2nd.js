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
        const date = "2024-05-31";

        // 백엔드 API에서 데이터 가져오기
        const response = await axios.get(`http://localhost:4000/visitor`, {
          params: { userId, exhbId, date }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });
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
    const drawGraph = () => {
      const data = [
        { hour: 9, today: 50, yesterday: 70, weekAvg: 150, monthAvg: 200 },
        { hour: 10, today: 150, yesterday: 220, weekAvg: 100, monthAvg: 130 },
        { hour: 11, today: 210, yesterday: 150, weekAvg: 250, monthAvg: 90 },
        { hour: 12, today: 120, yesterday: 160, weekAvg: 300, monthAvg: 340 },
        { hour: 13, today: 320, yesterday: 300, weekAvg: 350, monthAvg: 310 },
        { hour: 14, today: 270, yesterday: 240, weekAvg: 380, monthAvg: 270 },
        { hour: 15, today: 180, yesterday: 100, weekAvg: 220, monthAvg: 110 },
        { hour: 16, today: 90, yesterday: 160, weekAvg: 270, monthAvg: 190 },
        { hour: 17, today: 220, yesterday: 80, weekAvg: 120, monthAvg: 270 },
        { hour: 18, today: 180, yesterday: 160, weekAvg: 200, monthAvg: 170 }
      ];

      const margin = { top: 50, right: 100, bottom: 30, left: 65 };
      const width = 1456 - margin.left - margin.right;
      const height = 330 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current);

      // 기존 요소 제거
      svg.selectAll('*').remove();

      const g = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleTime()
        .range([0, width])
        .domain([new Date(2000, 0, 1, 9, 0), new Date(2000, 0, 1, 18, 0)]);
      
      const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 400]);

      // x축 생성
      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat('%H')))
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .attr('font-weight', 'regular');

      // y축 생성
      g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(8))
        .selectAll("text")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .attr("font-weight", "regular");

      g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom + 15)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .attr('font-weight', 'regular')
        .text('시간(시)');

      g.append('text')
        .attr('class', 'axis-label')
        .attr('x', -margin.left + 46)
        .attr('y', -margin.top + 30)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .attr('font-weight', 'regular')
        .text('인원(명)');

      const line = d3.line()
        .x((d) => x(new Date(2000, 0, 1, d.hour, 0)))
        .y((d) => y(d.value));

      g.append("path")
        .datum(data.map((d) => ({ hour: d.hour, value: d.today })))
        .attr("fill", "none")
        .attr("stroke", "#EF476F")
        .attr("stroke-width", 3)
        .attr("d", line);

      g.append("path")
        .datum(data.map((d) => ({ hour: d.hour, value: d.yesterday })))
        .attr("fill", "none")
        .attr("stroke", "#55D1B1")
        .attr("stroke-width", 1)
        .attr("d", line);

      g.append("path")
        .datum(data.map((d) => ({ hour: d.hour, value: d.weekAvg })))
        .attr("fill", "none")
        .attr("stroke", "#3A9BBB")
        .attr("stroke-width", 1)
        .attr("d", line);

      g.append("path")
        .datum(data.map((d) => ({ hour: d.hour, value: d.monthAvg })))
        .attr("fill", "none")
        .attr("stroke", "#073B4C")
        .attr("stroke-width", 1)
        .attr("d", line);

      const pivots = g.selectAll(".pivot")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "pivot");

      pivots.append('circle')
        .attr('r', 5)
        .attr('cx', d => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr('cy', d => y(d.today))
        .attr('fill', '#EF476F')
        .attr('class', 'today');

      pivots.append('circle')
        .attr('r', 3)
        .attr('cx', d => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr('cy', d => y(d.yesterday))
        .attr('fill', '#55D1B1')
        .attr('class', 'yesterday');

      pivots.append('circle')
        .attr('r', 3)
        .attr('cx', d => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr('cy', d => y(d.weekAvg))
        .attr('fill', '#3A9BBB')
        .attr('class', 'weekAvg');

      pivots.append('circle')
        .attr('r', 3)
        .attr('cx', d => x(new Date(2000, 0, 1, d.hour, 0)))
        .attr('cy', d => y(d.monthAvg))
        .attr('fill', '#073B4C')
        .attr('class', 'monthAvg');

      const verticalLine = g.append("line")
        .attr("stroke", "gray")
        .attr("stroke-dasharray", "5, 5");

      pivots.selectAll('circle')
        .on('mouseover', function (event, d) {
          const isToday = d3.select(this).attr('class') === 'today';
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', isToday ? 9 : 5);

          const xDate = x(new Date(2000, 0, 1, d.hour, 0));
          const hourValue = d.hour;

          verticalLine
            .attr("x1", xDate)
            .attr("x2", xDate)
            .attr("y1", y(400))
            .attr("y2", y(0));

          const toolTipData = data.find((datum) => datum.hour === hourValue);

          tooltip.html(
            `<div>${hourValue}시</div>
            <div>오늘: ${toolTipData.today}명</div>
            <div>어제: ${toolTipData.yesterday}명</div>
            <div>1주일 평균: ${toolTipData.weekAvg}명</div>
            <div>1달 평균: ${toolTipData.monthAvg}명</div>`
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
          const isToday = d3.select(this).attr('class') === 'today';
          d3.select(this)
            .transition()
            .duration(100)
            .attr('r', isToday ? 7 : 3);

          tooltip.style("visibility", "hidden");
          verticalLine
            .attr("x1", null)
            .attr("x2", null)
            .attr("y1", null)
            .attr("y2", null);
        });

      const tooltip = d3.select(tooltipRef.current)
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .style('border', '1px solid black')
        .style('padding', '10px')
        .style('font-family', 'Pretendard')
        .style('font-size', '16px')
        .style('font-weight', 'regular')
        .style('width', '120px')
        .style('height', '120px')
        .style('line-height', '1.5')
        .style('overflow', 'auto');

      const legendWidth = 200;
      const legendHeight = -70;
      const legendX = width - legendWidth - 120;
      const legendY = 10;
      const legendItemWidth = legendWidth / 2;

      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${legendX}, ${legendY})`);

      const legendItems = legend.selectAll('.legend-item')
        .data([
          { color: '#EF476F', label: '오늘' },
          { color: '#55D1B1', label: '어제' },
          { color: '#3A9BBB', label: '1주일 평균' },
          { color: '#073B4C', label: '1달 평균' }
        ])
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(${i * legendItemWidth}, 0)`);

      legendItems.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('y', legendHeight / 2 - 5)
        .attr('fill', d => d.color);

      legendItems.append('text')
        .attr('x', 15)
        .attr('y', legendHeight / 2)
        .attr('dy', '0.35em')
        .text(d => d.label)
        .attr('font-family', 'Pretendard')
        .attr('font-weight', 'regular')
        .attr('font-size', '14px');
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