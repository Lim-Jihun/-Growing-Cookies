import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Result_Bar_Age.css';
import axios from 'axios';

const Result_Bar_Age = ({ setAgeResult }) => {
  const d3Container = useRef(null);
  const [data, setData] = useState(null);
  const today = new Date().toISOString().split('T')[0];
  const [youngerTotal, setYoungerTotal] = useState(0);
  const [olderTotal, setOlderTotal] = useState(0);
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
  
  console.log("youngerTotal1", youngerTotal);
  console.log("olderTotal1", olderTotal);

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


        setAgeData(newAgeData);

        setAgeResult({ ageGroup: newAgeData.totalYounger > newAgeData.totalOlder ? 'Y' : 'O', youngerTotal: newAgeData.totalYounger, olderTotal: newAgeData.totalOlder });

        

        // const exhb1AResponse = await axios.get(`http://localhost:4000/byage`, {
        //   params: { userId, exhbId: "exhb1", date:today },
        //   withCredentials: true,
        // });

        // console.log("연령데이터",exhb1AResponse.data[0].sum_child_man);
       
        // const exhb1Child = parseInt(exhb1AResponse.data[0].sum_child_man) + parseInt(exhb1AResponse.data[0].sum_child_woman);
        // const exhb1Middle = parseInt(exhb1AResponse.data[0].sum_middle_man) + parseInt(exhb1AResponse.data[0].sum_middle_woman);
        // const exhb1Old = parseInt(exhb1AResponse.data[0].sum_old_man) + parseInt(exhb1AResponse.data[0].sum_old_woman);

        // console.log("exhb1Child", exhb1Child);


        // const exhb2AResponse = await axios.get(`http://localhost:4000/byage`, {
        //   params: { userId, exhbId: "exhb2", date:today },
        //   withCredentials: true,
        // });

        // const exhb2Child = parseInt(exhb2AResponse.data[0].sum_child_man) + parseInt(exhb2AResponse.data[0].sum_child_woman);
        // const exhb2Middle = parseInt(exhb2AResponse.data[0].sum_middle_man) + parseInt(exhb2AResponse.data[0].sum_middle_woman);
        // const exhb2Old = parseInt(exhb2AResponse.data[0].sum_old_man) + parseInt(exhb2AResponse.data[0].sum_old_woman);

        // const exhb3AResponse = await axios.get(`http://localhost:4000/byage`, {
        //   params: { userId, exhbId: "exhb3", date:today },
        //   withCredentials: true,
        // });
        // const exhb3Child = parseInt(exhb3AResponse.data[0].sum_child_man) + parseInt(exhb3AResponse.data[0].sum_child_woman);
        // const exhb3Middle = parseInt(exhb3AResponse.data[0].sum_middle_man) + parseInt(exhb3AResponse.data[0].sum_middle_woman);
        // const exhb3Old = parseInt(exhb3AResponse.data[0].sum_old_man) + parseInt(exhb3AResponse.data[0].sum_old_woman);

        // const exhb4AResponse = await axios.get(`http://localhost:4000/byage`, {
        //   params: { userId, exhbId: "exhb4", date:today },
        //   withCredentials: true,
        // });

        // const exhb4Child = parseInt(exhb4AResponse.data[0].sum_child_man) + parseInt(exhb4AResponse.data[0].sum_child_woman);
        // const exhb4Middle = parseInt(exhb4AResponse.data[0].sum_middle_man) + parseInt(exhb4AResponse.data[0].sum_middle_woman);
        // const exhb4Old = parseInt(exhb4AResponse.data[0].sum_old_man) + parseInt(exhb4AResponse.data[0].sum_old_woman);

        // const totalYounger= exhb1Child + exhb2Child + exhb3Child + exhb4Child;
        // const totalOlder = exhb1Middle + exhb1Old + exhb2Middle + exhb2Old + exhb3Middle + exhb3Old + exhb4Middle + exhb4Old;

        // console.log("totalYounger",totalYounger);
        // setYoungerTotal(totalYounger);
        // setOlderTotal(totalOlder);

        
        setData({
          child_man,
          middle_man,
          old_man,
          child_woman,
          middle_woman,
          old_woman,
          total_man,
          total_woman,
        });

        // Calculate youngerTotal and olderTotal excluding youth
        // const youngerTotal = data.child_man + data.child_woman;
        // console.log("youngerTotal",youngerTotal);
        // const olderTotal = data.middle_man + data.old_man + data.middle_woman + data.old_woman;
        // console.log("olderTotal",olderTotal);

       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [setAgeResult]);

  useEffect(() => {

    
    // if (newAgeData.totalYounger && newAgeData.totalOlder) {
    //   if (newAgeData.totalYounger > newAgeData.totalOlder) {
    //     setAgeResult({ ageGroup: 'Y', youngerTotal, olderTotal });
    //   } else if (youngerTotal < olderTotal) {
    //     setAgeResult({ ageGroup: 'O', youngerTotal, olderTotal });
    //   } else {
    //     setAgeResult({ ageGroup: 'E', youngerTotal, olderTotal }); // Equal numbers
    //   }
    // }
  }, [youngerTotal, olderTotal, setAgeResult]);

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
      const man_data_percentage = [    
        { label: 'Child Man', value: parseInt((ageData.manChildTotal/man_total)*100), width: (ageData.manChildTotal / man_total * 360 ) },
        { label: 'Middle Man', value: parseInt((ageData.manMiddleTotal/man_total)*100), width: (ageData.manMiddleTotal /man_total*360)},
        { label: 'Old Man', value: parseInt((ageData.manOldTotal/man_total)*100), width: (ageData.manMiddleTotal /man_total*360 )},
      ];
      const woman_total = ageData.womanChildTotal + ageData.womanMiddleTotal + ageData.womanOldTotal;
      const woman_data_percentage = [
        { label: 'Child Woman', value:parseInt((ageData.womanChildTotal/woman_total)*100), width: (ageData.womanChildTotal/woman_total)*360},
        { label: 'Middle Woman', value: parseInt((ageData.womanMiddleTotal/woman_total)*100), width: (ageData.womanMiddleTotal/woman_total)*360 },
        { label: 'Old Woman', value: parseInt((ageData.womanOldTotal/woman_total)*100), width: (ageData.womanOldTotal/woman_total)*360 },
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
  