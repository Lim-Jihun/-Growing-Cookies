import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GenderAgePieChart_2nd.module.css';
import axios from 'axios';

const GenderAgePieChart = ({ setSelectedData, selectedDate, selectedExhibition}) => {
  const svgRef = useRef(null);
  const [data, setData] = useState(null);
  const [ageData, setAgeData] = useState(null);
  const [selectedGender, setSelectedGender] = useState('male');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        
        const exhbId = selectedExhibition;
        const date = selectedDate;

        const response = await axios.get(`http://localhost:4000/bygender`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });
        const response2 = await axios.get(`http://localhost:4000/byage`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });
        if (response.status === 200) {
          setData(response.data);
        }
        if (response2.status === 200) {
          console.log(response2.data);
          setAgeData(response2.data);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedDate, selectedExhibition]);

  useEffect(() => {
    if (data && ageData) {
      const man_cnt = parseInt(data[0]?.['man_cnt_sum'] || 0, 10);
      const woman_cnt = parseInt(data[0]?.['woman_cnt_sum'] || 0, 10);

      const child_man = parseInt(ageData[0]?.sum_child_man || 0, 10);
      // const teen_man = parseInt(ageData[0]?.sum_teen_man || 0, 10);
      // const youth_man = parseInt(ageData[0]?.sum_youth_man || 0, 10);
      const middle_man = parseInt(ageData[0]?.sum_middle_man || 0, 10);
      const old_man = parseInt(ageData[0]?.sum_old_man || 0, 10);

      const child_woman = parseInt(ageData[0]?.sum_child_woman || 0, 10);
      // const teen_woman = parseInt(ageData[0]?.sum_teen_woman || 0, 10);
      // const youth_woman = parseInt(ageData[0]?.sum_youth_woman || 0, 10);
      const middle_woman = parseInt(ageData[0]?.sum_middle_woman || 0, 10);
      const old_woman = parseInt(ageData[0]?.sum_old_woman || 0, 10);

      // const man_cnt = child_man + middle_man + old_man;
      // const woman_cnt = child_woman + middle_woman + old_woman;

      const updateBarChart = (gender) => {
        if (gender === 'male') {
          setSelectedData([
            { age: '어린이', value: child_man },
            // { age: '청소년', value: teen_man },
            // { age: '청년', value: youth_man },
            { age: '중장년', value: middle_man },
            { age: '노인', value: old_man },
          ]);
        } else {
          setSelectedData([
            { age: '어린이', value: child_woman },
            // { age: '청소년', value: teen_woman },
            // { age: '청년', value: youth_woman },
            { age: '중장년', value: middle_woman },
            { age: '노인', value: old_woman },
          ]);
        }
      };

      // 선택된 성별에 따라 막대 그래프 업데이트
      if (selectedGender) {
        updateBarChart(selectedGender);
      }

      const svg = d3.select(svgRef.current)
        .attr('width', 620)
        .attr('height', 620);

      let g = svg.select('g');

      if (g.empty()) {
        g = svg.append('g')
          .attr('transform', `translate(${280}, ${280})`);
      }

      const pie = d3.pie().value(d => d.value);
      const chartData = [
        { label: '남성', value: man_cnt, gender: 'male' },
        { label: '여성', value: woman_cnt, gender: 'female' },
      ];

      const arc = d3.arc().innerRadius(0).outerRadius(280 * 0.8);

      const arcs = g.selectAll('.arc')
        .data(pie(chartData), d => d.data.gender);

      // Enter
      const newArcs = arcs.enter()
        .append('g')
        .attr('class', 'arc');

      newArcs.append('path')
        .attr('fill', (d, i) => (i === 0 ? '#118AB2' : '#EF476F'))
        .attr('d', arc)
        .attr('opacity', d => (selectedGender === d.data.gender) ? 1 : 0.3)
        .on('mouseover', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
        })
        .on('mouseout', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'none');
        })
        .on('click', function (event, d) { // 클릭 시 선택된 성별 상태 업데이트
          setSelectedGender(d.data.label === '남성' ? 'male' : 'female');
        })
        .transition()
        .duration(300)
        .attrTween('d', function (d) {
          const i = d3.interpolate(d.startAngle, d.endAngle);
          return function (t) {
            d.endAngle = i(t);
            return arc(d);
          };
        });

      newArcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .text(d => d.data.label);

      // 값 텍스트 렌더링 (애니메이션 효과)
      newArcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '1.5em')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'Pretendard')
        .attr('font-size', '16px')
        .text(0)
        .transition()
        .duration(1000)
        .tween('text', function (d) {
          const i = d3.interpolateRound(0, d.data.value);
          return function (t) {
            this.textContent = i(t);
          };
        });

      // 파이 조각 내부에 성별 텍스트 추가
      arcs.select('text')
        .text(d => d.data.label);

      // 선택 여부에 따른 색감 차이
      arcs.select('path')
        .attr('opacity', d => (selectedGender === d.data.gender) ? 1 : 0.3);
    }
  }, [data, ageData, selectedGender, selectedDate, selectedExhibition]);

  return (
    <div className="pie-chart-container">
      <svg ref={svgRef}></svg> {/* SVG 요소 렌더링 */}
    </div>
  );
};

export default GenderAgePieChart;
