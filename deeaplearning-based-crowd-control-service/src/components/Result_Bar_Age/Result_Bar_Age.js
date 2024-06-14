import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Age.css';

const Result_Bar_Age = ({ setAgeResult }) => {
  const d3Container = useRef(null);
  const [data, setData] = useState(null);

  const generateRandomPercentages = (total) => {
    const randomValues = Array.from({ length: 5 }, () => Math.random());
    const sum = randomValues.reduce((acc, val) => acc + val, 0);
    return randomValues.map(val => (val / sum) * total);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total_man = Math.floor(Math.random() * 101);
        const total_woman = 100 - total_man;

        const [child_man, teen_man, middle_man, old_man] = generateRandomPercentages(total_man);
        const [child_woman, teen_woman, middle_woman, old_woman] = generateRandomPercentages(total_woman);

        setData({
          child_man,
          teen_man,
          middle_man,
          old_man,
          child_woman,
          teen_woman,
          middle_woman,
          old_woman,
          total_man,
          total_woman,
        });

        // Calculate youngerTotal and olderTotal excluding youth
        const youngerTotal = child_man + teen_man + child_woman + teen_woman;
        const olderTotal = middle_man + old_man + middle_woman + old_woman;

        // Check which total is greater and set the result accordingly
        if (youngerTotal > olderTotal) {
          setAgeResult({ ageGroup: 'Y', youngerTotal, olderTotal });
        } else {
          setAgeResult({ ageGroup: 'O', youngerTotal, olderTotal });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setAgeResult]);

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
          // Skip drawing bars for youth category
          if (d.label.includes('Youth')) return;

          const percentage = d.value;

          svg.append('rect')
            .attr('x', direction === 'left' ? x - d.width : x)
            .attr('y', height / 2 - barHeight / 2)
            .attr('width', d.width)
            .attr('height', barHeight)
            .attr('fill', colors[i])
            .on('mouseover', (event) => {
              tooltip.transition().duration(200).style('opacity', 0.9);
              tooltip.html(`${d.label}: ${d.value.toFixed(2)}%`)
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
        { label: 'Child Man', value: data.child_man, width: (data.child_man / 100) * 360 },
        { label: 'Teen Man', value: data.teen_man, width: (data.teen_man / 100) * 360 },
        { label: 'Middle Man', value: data.middle_man, width: (data.middle_man / 100) * 360 },
        { label: 'Old Man', value: data.old_man, width: (data.old_man / 100) * 360 },
      ];

      const woman_data_percentage = [
        { label: 'Child Woman', value: data.child_woman, width: (data.child_woman / 100) * 360 },
        { label: 'Teen Woman', value: data.teen_woman, width: (data.teen_woman / 100) * 360 },
        { label: 'Middle Woman', value: data.middle_woman, width: (data.middle_woman / 100) * 360 },
        { label: 'Old Woman', value: data.old_woman, width: (data.old_woman / 100) * 360 },
      ];

      drawBars(man_data_percentage, man_colors, width / 2, 'left');
      drawBars(woman_data_percentage, woman_colors, width / 2, 'right');

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
    }, [data, setAgeResult]);
  
    return (
      <div className="Result_Bar_Age">
        <svg
          className="d3-component"
          ref={d3Container}
        />
      </div>
    );
  };
  
  export default Result_Bar_Age;
  