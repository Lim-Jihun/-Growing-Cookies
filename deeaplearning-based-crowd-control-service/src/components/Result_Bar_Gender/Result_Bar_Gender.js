import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Gender.css';

const Result_Bar_Gender = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const width = 720;
    const height = 150;
    const barHeight = 30;
    const barWidth = 90;

    // Generate random values for man_cnt and woman_cnt
    const man_cnt = Math.floor(Math.random() * 101);
    const woman_cnt = Math.floor(Math.random() * 101);

    const total = man_cnt + woman_cnt;
    const man_pct = Math.round((man_cnt / total) * 100);
    const woman_pct = Math.round((woman_cnt / total) * 100);
    const diff_pct = Math.abs(man_pct - woman_pct);

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
        svg.append('rect')
          .attr('x', direction === 'left' ? x - d.width : x)
          .attr('y', height / 2 - barHeight / 2)
          .attr('width', d.width)
          .attr('height', barHeight)
          .attr('fill', colors[i])
          .on('mouseover', (event) => {
            tooltip.transition().duration(200).style('opacity', 0.9);
            tooltip.html(`${d.label}: ${d.value}<br/>Percentage: ${d.percentage}%`)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', () => {
            tooltip.transition().duration(500).style('opacity', 0);
          });

        x += direction === 'left' ? -d.width : d.width;
      });

      svg.append('text')
        .attr('x', direction === 'left' ? startX - 10 : x + 10)
        .attr('y', height / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', direction === 'left' ? 'end' : 'start')
        .text(direction === 'left' ? 'M' : 'F')
        .attr('font-size', '14px')
        .attr('fill', '#000');
    };

    const man_data = [
      { label: 'Man', value: man_cnt, percentage: Math.min(man_pct, 25), width: Math.min(man_pct, 25) * 3.6 },
      { label: 'Man', value: man_cnt, percentage: Math.min(Math.max(man_pct - 25, 0), 25), width: Math.min(Math.max(man_pct - 25, 0), 25) * 3.6 },
      { label: 'Man', value: man_cnt, percentage: Math.min(Math.max(man_pct - 50, 0), 25), width: Math.min(Math.max(man_pct - 50, 0), 25) * 3.6 },
      { label: 'Man', value: man_cnt, percentage: Math.min(Math.max(man_pct - 75, 0), 25), width: Math.min(Math.max(man_pct - 75, 0), 25) * 3.6 },
    ];

    const woman_data = [
      { label: 'Woman', value: woman_cnt, percentage: Math.min(woman_pct, 25), width: Math.min(woman_pct, 25) * 3.6 },
      { label: 'Woman', value: woman_cnt, percentage: Math.min(Math.max(woman_pct - 25, 0), 25), width: Math.min(Math.max(woman_pct - 25, 0), 25) * 3.6 },
      { label: 'Woman', value: woman_cnt, percentage: Math.min(Math.max(woman_pct - 50, 0), 25), width: Math.min(Math.max(woman_pct - 50, 0), 25) * 3.6 },
      { label: 'Woman', value: woman_cnt, percentage: Math.min(Math.max(woman_pct - 75, 0), 25), width: Math.min(Math.max(woman_pct - 75, 0), 25) * 3.6 },
    ];

    if (man_pct > woman_pct) {
      drawBars(man_data, man_colors, width / 2, 'left');
      drawBars(woman_data, woman_colors, width / 2, 'right');
    } else {
      drawBars(woman_data, woman_colors, width / 2, 'right');
      drawBars(man_data, man_colors, width / 2, 'left');
    }

    
    // Add x-axis ticks
    const ticks = [0, 25, 50, 75, 100];
    const tickLabels = ['0%', '25%', '50%', '75%', '100%'];
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    const xAxis = d3.axisBottom(xScale)
      .tickValues(ticks)
      .tickFormat((d, i) => tickLabels[i]);

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height / 2})`)
      .call(xAxis)
      .selectAll('text')
      .attr('dy', '1em');

    return () => tooltip.remove();
  }, []);

  return (
    <div className="Result_Bar_Gender">
      <svg
        className="d3-component"
        ref={d3Container}
      />
    </div>
  );
}

export default Result_Bar_Gender;