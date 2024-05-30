import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3'; // d3.js 라이브러리 임포트
import './DangerPlaceBar_2nd.module.css';
import axios from 'axios';

const BarGraph = () => {
  // SVG 요소에 대한 참조를 저장할 useRef
  const svgRef = useRef(null);
  const textRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // 데이터를 가져오고 그래프를 렌더링하는 비동기 함수
    const fetchData = async () => {
      try {
        // 랜덤 데이터 생성
        // const data = [
        //   { areaName: '구역 A', dangerCount: Math.floor(Math.random() * 27) + 3 },
        //   { areaName: '구역 B', dangerCount: Math.floor(Math.random() * 27) + 3 },
        //   { areaName: '구역 C', dangerCount: Math.floor(Math.random() * 27) + 3 },
        //   { areaName: '구역 D', dangerCount: Math.floor(Math.random() * 27) + 3 },
        //   { areaName: '구역 E', dangerCount: Math.floor(Math.random() * 27) + 3 },
        // ];
        const userId = 'user1';
        const exhbId = 'exhb1';

        const response = await axios.get(`http://localhost:4000/crowded`);

        setData(response.data);
        if(response.status ===200) {
          console.log(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
        
        
  useEffect(() => {
    if (data.length > 0){
      // 그래프 여백 설정
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 1650 - margin.left - margin.right;
      const height = 330 - margin.top - margin.bottom;

      // x, y 축 스케일 설정
      const x = d3.scaleLinear().range([0, width]).domain([0, 35]); // x축 스케일 설정 (0부터 35까지)
      const y = d3.scaleBand().range([0, height]).padding(0.1); // y축 스케일 설정 (밴드 스케일 사용)

      // SVG 요소 생성 및 여백 설정
      const svg = d3
        .select(svgRef.current) // SVG 요소 선택
        .attr('width', width + margin.left + margin.right) // SVG 너비 설정
        .attr('height', height + margin.top + margin.bottom) // SVG 높이 설정
        .append('g') // 그룹 요소 추가
        .attr('transform', `translate(${margin.left}, ${margin.top})`); // 여백 설정

      // y축 도메인 설정 (데이터의 zone_name으로 설정)
      y.domain(data.map(d => d.zone_name));

      // x축 렌더링
      svg
        .append('g') // 그룹 요소 중
        .attr('class', 'x-axis') // x축 선택
        .attr('transform', `translate(0, ${height})`) // x축을 아래 쪽에 위치시킴
        .call(d3.axisBottom(x).ticks(5)) // x축 눈금 개수 5개로 설정
        .attr('font-family', 'Pretendard') // 글꼴
        .attr('font-size', '16px') // 글씨 크기
        .attr('font-weight', 'regular'); // 글씨 굵기

      // y축 렌더링
      svg
        .append('g') // 그룹 요소 중
        .attr('class', 'y-axis') // y축 선택
        .call(d3.axisLeft(y)) // y축 렌더링
        .selectAll('text') // y축 텍스트 선택
        .attr('font-family', 'Pretendard') // 글꼴
        .attr('font-size', '16px') // 글씨 크기
        .attr('font-weight', 'regular'); // 글씨 굵기

      // 막대 그래프 애니메이션
      const bars = svg
        .selectAll('.bar') // 기존 '.bar' 클래스 요소 선택
        .data(data) // 데이터 바인딩
        .enter() // 새로운 데이터에 대한 요소 생성
        .append('rect') // 새 요소를 rect로 추가
        .attr('class', 'bar') // 클래스 이름 지정
        .attr('y', d => y(d.zone_name)) // y 위치 설정 (areaName에 따라 결정)
        .attr('height', y.bandwidth()) // 막대 높이 설정
        .attr('x', 0) // 초기 x 위치 0으로 설정
        .attr('width', 0) // 초기 너비 0으로 설정
        .style('fill', (d, i) => { // 막대 색상 설정
          const sortedData = data.slice().sort((a, b) => b.total_population - a.total_population);
          const index = sortedData.findIndex(item => item.zone_name === d.zone_name);
          const colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];
          return colors[index];
        });

      // 막대 그래프 애니메이션
      bars
        .transition() // 트랜지션 시작
        .duration(1000) // 애니메이션 지속 시간 1초
        .attr('width', d => x(d.total_population)); // 실제 데이터에 따른 너비로 증가 애니메이션

      // 숫자 애니메이션
      const text = svg
        .selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.total_population) + 5) // 막대 오른쪽에 숫자 위치
        .attr('y', d => y(d.zone_name) + y.bandwidth() / 2) // 막대 가운데에 숫자 위치
        .attr('dy', '0.35em') // 텍스트 수직 정렬
        .text(0)
        .attr('font-family', 'Pretendard')
        .attr('font-size', '20px')
        .attr('font-weight', 'bold')
        ; // 초기 숫자 0으로 설정

      text
        .transition()
        .duration(1000) // 애니메이션 지속 시간 1초
        .tween('text', function(d) {
          const i = d3.interpolateRound(0, d.total_population); // 숫자 보간 함수
          return function(t) {
            this.textContent = i(t); // 숫자 업데이트
          };
        });
    }
  })   

  return (
    <div className="bar-graph-container">
      <svg ref={svgRef} className="bar-graph"></svg>
    </div>
  );
};

export default BarGraph;