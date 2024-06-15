import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Age.css';
import axios from 'axios';

const Result_Bar_Age = ({ setAgeResult }) => {
  const d3Container = useRef(null);
  const today = new Date().toISOString().split('T')[0];
  const [ageData, setAgeData] = useState({
    manChildTotal: 0,
    womanChildTotal: 0,
    manMiddleTotal: 0,
    womanMiddleTotal: 0,
    manOldTotal: 0,
    womanOldTotal: 0,
    totalYounger: 0,
    totalOlder: 0,
  });
  console.log("ffageData",ageData);

  const generateRandomPercentages = (total) => {
    const randomValues = Array.from({ length: 3 }, () => Math.random());
    const sum = randomValues.reduce((acc, val) => acc + val, 0);
    return randomValues.map(val => (val / sum) * total);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const total_man = Math.floor(Math.random() * 101);
        const total_woman = 100 - total_man;
        const [child_man, middle_man, old_man] = generateRandomPercentages(total_man);
        const [child_woman, middle_woman, old_woman] = generateRandomPercentages(total_woman);

        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        const fetchDataByExhibition = async (exhbId) => {
          const response = await axios.get(`http://localhost:4000/byage`, {
            params: { userId, exhbId, date: today },
            withCredentials: true,
          });
          return response.data[0];
        };

        const exhibitions = ['exhb1', 'exhb2', 'exhb3', 'exhb4'];

        let newAgeData = {
          manChildTotal: 0,
          womanChildTotal: 0,
          manMiddleTotal: 0,
          womanMiddleTotal: 0,
          manOldTotal: 0,
          womanOldTotal: 0,
          totalYounger: 0,
          totalOlder: 0,
        };

        for (let exhb of exhibitions) {
          const data = await fetchDataByExhibition(exhb);
          

          newAgeData.manChildTotal += parseInt(data.sum_child_man);
          newAgeData.womanChildTotal += parseInt(data.sum_child_woman);
          newAgeData.manMiddleTotal += parseInt(data.sum_middle_man);
          newAgeData.womanMiddleTotal += parseInt(data.sum_middle_woman);
          newAgeData.manOldTotal += parseInt(data.sum_old_man);
          newAgeData.womanOldTotal += parseInt(data.sum_old_woman);
        }

        newAgeData.totalYounger = newAgeData.manChildTotal + newAgeData.womanChildTotal;
        newAgeData.totalOlder = newAgeData.manMiddleTotal + newAgeData.womanMiddleTotal + newAgeData.manOldTotal + newAgeData.womanOldTotal;

        const ageGroup = newAgeData.totalYounger > newAgeData.totalOlder
          ? 'Y'
          : newAgeData.totalYounger < newAgeData.totalOlder
            ? 'O'
            : 'E';

        setAgeData(newAgeData);

        setAgeResult({ ageGroup, youngerTotal: newAgeData.totalYounger, olderTotal: newAgeData.totalOlder });


       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    if (ageData) {
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

      const man_colors = ['#118AB2', '#256980', '#2A4852'];
      const woman_colors = ['#EF476F', '#C76179', '#995767'];

      const drawBars = (ageData, colors, startX, direction) => {
        let x = startX;
        ageData.forEach((d, i) => {
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
              tooltip.html(`${d.label}: ${d.value}%`)
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

      const man_total = ageData.manChildTotal + ageData.manMiddleTotal + ageData.manOldTotal;
      const woman_total = ageData.womanChildTotal + ageData.womanMiddleTotal + ageData.womanOldTotal;
      const total = man_total + woman_total;
      const man_data_percentage = [    
        { label: 'Child Man', value: parseInt((ageData.manChildTotal/total)*100).toFixed(2), width: ((ageData.manChildTotal / total) * width/2 ) },
        { label: 'Middle Man', value: parseInt((ageData.manMiddleTotal/total)*100).toFixed(2), width: ((ageData.manMiddleTotal /total)* width/2)},
        { label: 'Old Man', value: parseInt((ageData.manOldTotal/total)*100).toFixed(2), width: ((ageData.manMiddleTotal /total)* width/2 )},
      ];
      
      const woman_data_percentage = [
        { label: 'Child Woman', value:parseInt((ageData.womanChildTotal/total)*100).toFixed(2), width: ((ageData.womanChildTotal/total)* width/2 )},
        { label: 'Middle Woman', value: parseInt((ageData.womanMiddleTotal/total)*100).toFixed(2), width: ((ageData.womanMiddleTotal/total)* width/2 ) },
        { label: 'Old Woman', value: parseInt((ageData.womanOldTotal/total)*100).toFixed(2), width: ((ageData.womanOldTotal/total)* width/2 ) },
      ];

      drawBars(man_data_percentage, man_colors, width/2, 'left');
      drawBars(woman_data_percentage, woman_colors, width/2, 'right');

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
    }, [ageData, setAgeResult]);
  
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
  