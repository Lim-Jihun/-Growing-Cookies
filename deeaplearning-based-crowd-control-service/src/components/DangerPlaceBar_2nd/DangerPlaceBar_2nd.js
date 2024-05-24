import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './DangerPlaceBar.module.css';

const BarGraph = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MySQL DB에서 JSON 데이터 가져오기
        const response = await fetch('/api/congestion-data');
        const data = //await response.json();
        [
          { areaName: '구역 A', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 B', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 C', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 D', dangerCount: Math.floor(Math.random() * 30) },
          { areaName: '구역 E', dangerCount: Math.floor(Math.random() * 30) },
        ];

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 816 - margin.left - margin.right;
        const height = 330 - margin.top - margin.bottom;

        const x = d3.scaleLinear().range([0, width]).domain([0, 30]);
        const y = d3.scaleBand().range([0, height]).padding(0.1);

        const svg = d3
          .select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        y.domain(data.map(d => d.areaName));

        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(5));

        svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(y));

        svg
          .selectAll('.bar')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('y', d => y(d.areaName))
          .attr('height', y.bandwidth())
          .attr('x', 0)
          .attr('width', d => x(d.dangerCount))
          .style('fill', (d, i) => {
            const colors = ['#E71825', '#F45D48', '#F9A086', '#FACAB2', '#D2BEC0'];
            return colors[i];
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bar-graph-container">
    <div className="bar-graph-title-container">
      <div className="bar-graph-title">위험 상황 발생 구역 상위 5개</div>
      </div>
      <svg ref={svgRef} className="bar-graph"></svg>
    </div>
  );
};

export default BarGraph;
