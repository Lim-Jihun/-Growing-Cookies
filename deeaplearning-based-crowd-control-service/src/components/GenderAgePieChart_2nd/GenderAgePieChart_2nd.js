import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GenderAgePieChart_2nd.module.css';

const GenderAgePieChart = () => {
  const svgRef = useRef(null);
  const[selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // DB에서 데이터 가져오는 코드 (주석 처리)
        // const response = await fetch('/api/gender-data');
        // const data = await response.json();
        // const { male, female } = data;

        // 남성 연령대별 고정 값 (합계가 40~45% 되도록)
        const mKids = 10;
        const mTeen = 12;
        const mAdult = 15; 
        const mMid = 18;
        const mEld = 20;
        const mTotal = mKids + mTeen + mAdult + mMid + mEld;
        const mPercent = 43; // 40~45% 사이의 값으로 설정
        const male = (mTotal / 100) * (mPercent * 10);

        // 여성 연령대별 고정 값 (합계가 55~60% 되도록)
        const fKids = 15;
        const fTeen = 18;
        const fAdult = 20;
        const fMid = 22;
        const fEld = 25;
        const fTotal = fKids + fTeen + fAdult + fMid + fEld;
        const fPercent = 100 - mPercent;
        const female = (fTotal / 100) * (fPercent * 10);

        // 양측 총합
        const total = male + female;

        const width = 675;
        const height = 675;
        const radius = width / 2;
        
        // svg 요소 설정(그래프 범위)
        const svg = d3
          .select(svgRef.current) // svg 요소 선택
          .attr('width', width) // SVG 너비 설정
          .attr('height', height) // SVG 높이 설정
          .append('g') // 그룹 요소 추가
          .attr('transform', `translate(${width / 2}, ${height / 2})`); // 여백 설정

        const pie = d3.pie().value(d => d.value); // pie 레이아웃을 통해 데이터를 파이 조각으로 변환
        const data = [
          { label: '남성', value: male },
          { label: '여성', value: female },
        ];

        const arc = d3 // 파이 조각의 형상 결정
          .arc()
          .innerRadius(radius * 0)
          .outerRadius(radius * 0.8);

        const arcs = svg // 각 조각의 요소 결정
          .selectAll('arc')
          .data(pie(data))
          .enter()
          .append('g')
          .attr('class', 'arc');

        arcs // 파이 조각 색상 및 애니메이션 지정
          .append('path')
          .attr('fill', (d, i) => (i === 0 ? '#118AB2' : '#EF476F'))
          .attr('d', d => arc(d))
          .on('mouseover', function(d,i){ // 커서 올렸을 때 테두리 진해지기 추가
            d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
          })
          .on('mouseout', function(d, i){ // 커서 치웠을 때 테두리 초기화
            d3.select(this)
            .transition()
            .duration(200)
            .attr('stroke', 'none')
          })
           .on('click', function(d, i){ // 클릭하면 막대그래프로 데이터 전달하는 이벤트 핸들러
             if(i === 0){ // 남성 조각 클릭 시
               setSelectedData([mKids, mTeen, mAdult, mMid, mEld]);
             } else {
              setSelectedData([fKids, fTeen, fAdult, fMid, fEld]);
             }
           })
          .transition() // 애니메이션 추가
          .duration(1000) // 애니메이션 지속 시간 1초
          .attrTween('d', function(d) {
            const i = d3.interpolate(d.startAngle, d.endAngle);
            return function(t) {
              d.endAngle = i(t);
              return arc(d);
            };
          });

          const genderTexts = arcs // 파이 조각(arcs) 데이터에 대한 텍스트 요소 생성
          .append('text') // text 요소 추가
          .attr('transform', d => `translate(${arc.centroid(d)})`) // 텍스트 위치를 각 조각의 중심으로 설정
          .attr('dy', '0.35em') // 텍스트 수직 방향 조정
          .attr('text-anchor', 'middle') // 텍스트 가운데 정렬
          .attr('font-family', 'Pretendard') // 폰트 패밀리 설정
          .attr('font-size', '40px') // 폰트 크기 설정
          .attr('font-weight', 'bold') // 폰트 굵기 설정
          .attr('fill', 'white'); // 텍스트 색상 설정 (흰색)
        
        genderTexts // 생성한 텍스트 요소에 대한 레이블 설정
          .append('tspan') // tspan 요소 추가 (다중 행 텍스트 표시 가능)
          .attr('x', 0) // x 위치 설정
          .attr('y', -10) // y 위치 설정
          .text(d => d.data.label); // 레이블 텍스트 설정 (데이터의 label 값)
        
        genderTexts
          .append('tspan') // 또 다른 tspan 요소 추가 (숫자 값을 표시하기 위함)
          .attr('x', 0) // x 위치 설정
          .attr('y', 60) // y 위치 설정
          .text(0) // 초기 텍스트 값을 0으로 설정
          .transition() // 트랜지션(애니메이션) 추가
          .duration(1000) // 애니메이션 지속 시간 1초 설정
          .tween('text', function(d) { // 텍스트 애니메이션을 위한 tween 함수 설정
            const i = d3.interpolateRound(0, d.data.value); // 0에서 실제 값까지 보간 함수 생성
            return function(t) {
              this.textContent = i(t); // 보간 함수를 사용하여 숫자 업데이트
            };
          });

          svg // SVG 요소에 제목 텍스트 추가
            .append('text') // text 요소 추가
            .attr('x', 0) // x 위치 설정 (중앙)
            .attr('y', -radius * 0.9) // y 위치 설정 (반지름의 0.9배 위쪽)
            .attr('text-anchor', 'middle') // 텍스트 가운데 정렬
            .attr('font-family', 'Pretendard') // 폰트 패밀리 설정
            .attr('font-size', '20px') // 폰트 크기 설정
            .text('성별 분포'); // 제목 텍스트 설정
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="pie-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GenderAgePieChart;