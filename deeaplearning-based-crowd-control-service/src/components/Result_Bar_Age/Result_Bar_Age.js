import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Age.css';
import axios from 'axios';

const Result_Bar_Age = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const exhbId = 'exhb1';

        const response = await axios.get(`http://localhost:4000/bygender`, {
          params: { userId, exhbId },
          withCredentials: true,
        });
        const response2 = await axios.get(`http://localhost:4000/byage`, {
          params: { userId, exhbId },
          withCredentials: true,
        });
        if (response.status === 200 && response2.status === 200) {
          const total_man = response2.data[0]["sum_child_man"] + response2.data[0]["sum_teen_man"] + response2.data[0]["sum_youth_man"] + response2.data[0]["sum_middle_man"] + response2.data[0]["sum_old_man"];
          const total_woman = response2.data[0]["sum_child_woman"] + response2.data[0]["sum_teen_woman"] + response2.data[0]["sum_youth_woman"] + response2.data[0]["sum_middle_woman"] + response2.data[0]["sum_old_woman"];
          setData({
            child_man: response2.data[0]["sum_child_man"],
            teen_man: response2.data[0]["sum_teen_man"],
            youth_man: response2.data[0]["sum_youth_man"],
            middle_man: response2.data[0]["sum_middle_man"],
            old_man: response2.data[0]["sum_old_man"],
            child_woman: response2.data[0]["sum_child_woman"],
            teen_woman: response2.data[0]["sum_teen_woman"],
            youth_woman: response2.data[0]["sum_youth_woman"],
            middle_woman: response2.data[0]["sum_middle_woman"],
            old_woman: response2.data[0]["sum_old_woman"],
            total_man,
            total_woman
          });
        } else {
          console.error('Failed to fetch data');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
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

      const man_colors = ['#118AB2', '#256980', '#2A4852', '#23292C'];
      const woman_colors = ['#EF476F', '#C76179', '#995767', '#4E3339'];

      const drawBars = (data, colors, startX, direction) => {
        let x = startX;
        data.forEach((d, i) => {
          // Calculate the percentage based on median and average comparison
          const percentage = d.value;

          svg.append('rect')
            .attr('x', direction === 'left' ? x - d.width : x)
            .attr('y', height / 2 - barHeight / 2)
            .attr('width', d.width)
            .attr('height', barHeight)
            .attr('fill', colors[i])
            .on('mouseover', (event) => {
              tooltip.transition().duration(200).style('opacity', 0.9);
              tooltip.html(`${d.label}: ${d.value}<br/>Percentage: ${percentage.toFixed(2)}%`)
                .style('left', `${event.pageX}px`)
                .style('top', `${event.pageY - 28}px`);
            })
            .on('mouseout', () => {
              tooltip.transition().duration(500).style('opacity', 0);
            });

          x += direction === 'left' ? -d.width : d.width;
        });

        svg.append('text')
          .attr('x', direction === 'left' ? x - 20 : x + 10)
          .attr('y', height / 2)
          .attr('dy', '.35em')
          .attr('text-anchor', direction === 'left' ? 'start' : 'start')
          .text(direction === 'left' ? 'Y' : 'O')
          .attr('font-size', '14px')
          .attr('fill', '#000');
      };

      const man_data_percentage = [
        { label: 'Man', value: (data.child_man + data.teen_man + data.youth_man + data.middle_man + data.old_man) / data.total_man * 100, percentage: 0, width: 360 },
      ];

      const woman_data_percentage = [
        { label: 'Woman', value: (data.child_woman + data.teen_woman + data.youth_woman + data.middle_woman + data.old_woman) / data.total_woman * 100, percentage: 0, width: 360 },
      ];

      // Draw bars based on the data
      drawBars(man_data_percentage, man_colors, width / 2, 'left');
      drawBars(woman_data_percentage, woman_colors, width / 2, 'right');

      // Add x-axis ticks
      const ticks = [0, 25, 50, 75, 100];
      const tickLabels = ['100%', '50%', '0%', '50%', '100%'];

      const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

      const xAxis = d3.axisBottom(xScale)
        .tickValues(ticks)
        .tickFormat((d, i) => tickLabels[i]);

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height / 1.6})`)
        .call(xAxis)
        .selectAll('text')
        .attr('dy', '1em');

        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 5)
        .attr("text-anchor", "middle")
        .attr("font-family", "Pretendard")
        .attr("font-size", "16px")
        .text("연령대 요약");

      return () => tooltip.remove();
    }
  }, [data]);

  return (
    <div className="Result_Bar_Age">
      <svg
        className="d3-component"
        ref={d3Container}
        />
      </div>
    );
  }
  
  export default Result_Bar_Age;