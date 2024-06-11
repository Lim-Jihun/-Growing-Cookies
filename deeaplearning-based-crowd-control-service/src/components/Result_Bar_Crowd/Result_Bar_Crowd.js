import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './Result_Bar_Crowd.css';

const Result_Bar_Crowd = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = 'exhb1';
        const date = new Date().toISOString().split("T")[0];

        const response = await axios.get(`http://localhost:4000/visitor`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });

        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => a.current_population - b.current_population);
      const midIndex = Math.floor(sortedData.length / 2);
      const median = sortedData.length % 2 !== 0
        ? sortedData[midIndex].current_population
        : (sortedData[midIndex - 1].current_population + sortedData[midIndex].current_population) / 2;

      const recentData = data.slice(-7);
      const average = recentData.reduce((acc, day) => acc + day.current_population, 0) / recentData.length;
      const difference = ((average - median) / median) * 100;

      const width = 720;
      const height = 150;
      const barHeight = 30;

      const svg = d3.select(d3Container.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('*').remove();

      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      const colors = ['#118AB2', '#EF476F'];

      const drawBars = (value, color, startX, direction, label) => {
        svg.append('rect')
          .attr('x', direction === 'left' ? startX - value : startX)
          .attr('y', height / 2 - barHeight / 2)
          .attr('width', Math.abs(value))
          .attr('height', barHeight)
          .attr('fill', color)
          .on('mouseover', (event) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`${label}<br/>Value: ${value.toFixed(2)}%`)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', () => {
            tooltip.transition().duration(500).style('opacity', 0);
          });

        svg.append('text')
          .attr('x', direction === 'left' ? startX - 20 : startX + Math.abs(value) + 10)
          .attr('y', height / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', direction === 'left' ? 'start' : 'start')
          .text(label)
          .attr('font-size', '14px')
          .attr('fill', '#000');
      };

      if (difference < 0) {
        drawBars(difference, colors[0], width / 2, 'left', 'Low');
      } else {
        drawBars(difference, colors[1], width / 2, 'right', 'High');
      }

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 5)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .text("Population Summary");

      return () => tooltip.remove();
    }
  }, [data]);

  return (
    <div className="Result_Bar_Crowd">
      <svg
        className="d3-component"
        ref={d3Container}
      />
    </div>
  );
}

export default Result_Bar_Crowd;