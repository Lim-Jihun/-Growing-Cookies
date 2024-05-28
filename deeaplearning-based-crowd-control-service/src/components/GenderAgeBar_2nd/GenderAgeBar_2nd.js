import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './GenderAgeBar_2nd.module.css';

const GenderAgeBar = ( {data}) => {
  // SVG 요소에 대한 참조를 저장할 useRef
  const svgRef = useRef(null);

  useEffect(() => {
    // 데이터를 가져오고 그래프를 렌더링하는 비동기 함수
    const fetchData = async () => {
      try {
        // DB에서 데이터 가져오는 코드
        // const response = await fetch('/api/gender-data');
        // const data = await response.json();
        // const {  } = data;

        // 임시 랜덤 데이터 생성
        const data = [
          { age: '어린이', dangerCount: Math.floor(Math.random() * 27) + 3 },
          { age: '청소년', dangerCount: Math.floor(Math.random() * 27) + 3 },
          { age: '청년', dangerCount: Math.floor(Math.random() * 27) + 3 },
          { age: '중장년', dangerCount: Math.floor(Math.random() * 27) + 3 },
          { age: '노년', dangerCount: Math.floor(Math.random() * 27) + 3 },
        ];

        // 그래프 여백 설정
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 908 - margin.left - margin.right;
        const height = 730 - margin.top - margin.bottom;

        // x, y 축 스케일 설정
        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);

        // SVG 요소 생성 및 여백 설정
        const svg = d3
          .select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // x, y 축 도메인 설정
        x.domain(data.map(d => d.age)); // 
        y.domain([0, 40]).nice();

        // x축 렌더링
        svg
          .append('g')
          .attr('class', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x))
          .attr('font-family', 'Pretendard')
          .attr('font-size', '16px')
          .attr('font-weight', 'regular');

        // y축 렌더링
        svg
          .append('g')
          .attr('class', 'y-axis')
          .call(d3.axisLeft(y).ticks(8)) // y축 눈금 개수 설정
          .attr('font-family', 'Pretendard')
          .attr('font-size', '16px')
          .attr('font-weight', 'regular');

        // 막대 그래프와 애니메이션
        const bars = svg
          .selectAll('.bar') // 기존 '.bar' 클래스 요소 선택 -> bar의 세팅을 설정
          .data(data) // 데이터 바인딩
          .enter() // 새로운 데이터에 대한 요소 생성
          .append('rect') // 새 요소를 rect로 추가
          .attr('class', 'bar') // 클래스 이름 지정
          .attr('x', d => x(d.age)) // x 위치 설정
          .attr('width', x.bandwidth()) // 막대 너비 설정 -> 너비에 맞춰 막대 너비 분배
          .attr('y', d => y(0)) // 초기 y 위치 0으로 설정
          .attr('height', d => height - y(0)) // 초기 높이 0으로 설정
          .style('fill', (d, i) => { // 막대 색상 설정
            const sortedData = data.slice().sort((a, b) => b.dangerCount - a.dangerCount);
            const index = sortedData.findIndex(item => item.age === d.age);
            const colors = ['#EF476F', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];
            return colors[index];
          });

        // 막대 그래프 애니메이션
        bars
          .transition() // 트랜지션 시작
          .duration(1000) // 애니메이션 지속 시간 1초
          .attr('y', d => y(d.dangerCount)) // 실제 데이터에 따른 y 위치로 이동
          .attr('height', d => height - y(d.dangerCount)); // 실제 데이터에 따른 높이로 변경

        // 숫자 애니메이션
        const text = svg
          .selectAll('.label')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', d => x(d.age) + x.bandwidth() / 2) // 막대 가운데에 숫자 위치
          .attr('y', d => y(d.dangerCount) - 20) // 숫자를 막대 위로 조금 올림
          .attr('dy', '0.75em') // 텍스트 수직 정렬 조정
          .text(0) // 초기 숫자 0으로 설정
          .attr('font-family', 'Pretendard')
          .attr('font-size', '20px')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle'); // 텍스트 가운데 정렬

        // 숫자 애니메이션 트랜지션
        text
          .transition()
          .duration(1000) // 애니메이션 지속 시간 1초
          .tween('text', function(d) {
            const i = d3.interpolateRound(0, d.dangerCount); // 숫자 함수 (0에서 실제 데이터 값으로 변화)
            return function(t) {
              this.textContent = i(t); // 숫자 업데이트
            };
          });

            } catch (error) {
              console.error('Error fetching data:', error); // 데이터가 알맞게 전송되지 않았을 경우 출력할 메시지
            }
          };

  fetchData();
}, []);

return (
  <div className="bar-graph-container">
    <svg ref={svgRef} className="bar-graph"></svg>
  </div>
);
};

export default GenderAgeBar;