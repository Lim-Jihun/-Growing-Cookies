import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './GenderAgePieChart_2nd.module.css';
import axios from 'axios';

const GenderAgePieChart = ( {setSelectedData} ) => {
  // SVG 요소를 참조할 useRef 훅 선언
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  
  const [selectedGender, setSelectedGender] = useState('male');
  
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
          params: { userId, exhbId}, // 쿼리스트링으로 전달
          withCredentials: true,
        });
        const response2 = await axios.get(`http://localhost:4000/byage`, {
          params: { userId, exhbId}, // 쿼리스트링으로 전달
          withCredentials: true,
        });
        if(response.status === 200){
          setData(response.data);
          console.log(response.data);
        }
        if(response2.status === 200){
          setAgeData(response2.data);
          console.log(response2.data);
          }

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
        // SVG 요소 크기 설정
        const width = 560;
        const height = 560;
        const radius = width / 2;
        const margin = { top: 30 };

    useEffect(() => {
      if (data.length > 0){
        // const { man_cnt, woman_cnt } = data[0]
      const man_cnt = parseInt(data[0]["SUM(a.man_cnt)"], 10);
      const woman_cnt = parseInt(data[0]["SUM(a.woman_cnt)"], 10);
        console.log(man_cnt, woman_cnt, "man, woman");
    // 기존 SVG 요소 제거
    d3.select(svgRef.current).selectAll('*').remove();
        const child_man = parseInt(ageData[0]["sum_child_man"],10);
        const teen_man = parseInt(ageData[0]["sum_teen_man"],10);
        const youth_man = parseInt(ageData[0]["sum_child_man"],10);
        const middle_man = parseInt(ageData[0]["sum_youth_man"], 10);
        const old_man = parseInt(ageData[0]["sum_child_man"],10);

        const child_woman = parseInt(ageData[0]["sum_child_woman"],10);
        const teen_woman = parseInt(ageData[0]["sum_teen_woman"],10);
        const youth_woman = parseInt(ageData[0]["sum_youth_woman"],10);
        const middle_woman = parseInt(ageData[0]["sum_middle_woman"],10);
        const old_woman = parseInt(ageData[0]["sum_old_woman"],10);

        if (selectedGender === 'male') {
                    setSelectedData([
                      { age: '어린이', value: child_man },
                      { age: '청소년', value: teen_man },
                      { age: '청년', value: youth_man },
                      { age: '중장년', value: middle_man },
                      { age: '노인', value: old_man },
                    ]);
                  } else {
                    setSelectedData([
                      { age: '어린이', value: child_woman },
                      { age: '청소년', value: teen_woman },
                      { age: '청년', value: youth_woman },
                      { age: '중장년', value: middle_woman },
                      { age: '노인', value: old_woman },
                    ]);
                  }
    // SVG 요소 생성 및 중심 설정
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height + margin.top - 30)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // 파이 레이아웃 생성 및 데이터 바인딩
    const pie = d3.pie().value(d => d.value);
    const chartData = [
      { label: '남성', value: man_cnt },
      { label: '여성', value: woman_cnt },
    ];

    // 파이 조각 형상 결정 (내부 반지름 0, 외부 반지름 0.8배)
    const arc = d3.arc().innerRadius(0).outerRadius(radius * 0.8);

    // 파이 조각 요소 생성 및 데이터 바인딩
    const arcs = svg
      .selectAll('arc')
      .data(pie(chartData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // 파이 조각 렌더링 및 색상 지정
    arcs
      .append('path')
      .attr('fill', (d, i) => (i === 0 ? '#118AB2' : '#EF476F'))  // 남성: 파란색, 여성: 빨간색
      .attr('d', arc) // 파이 조각 형상 적용
      .on('mouseover', function () { // 마우스 오버 시 테두리 강조
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'black')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function () { // 마우스 아웃 시 테두리 초기화
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'none');
      })
      .on('click', function (event, d) { // 클릭 시 선택된 성별 상태 업데이트
        setSelectedGender(d.data.label === '남성' ? 'male' : 'female');
        setSelectedGender(selectedGender);
        if (selectedGender === 'male'){
          setSelectedData([
            { age : '어린이', value : child_man },
            { age : '청소년', value : teen_man },
            { age : '청년', value : youth_man },
            { age : '중장년', value : middle_man },
            { age : '노인', value : old_man }
          ]);
        }else{
          setSelectedData([
            { age : '어린이', value : child_woman },
            { age : '청소년', value : teen_woman },
            { age : '청년', value : youth_woman },
            { age : '중장년', value : middle_woman },
            { age : '노인', value : old_woman }
          ]);
        }
      })
      .transition() // 파이 조각 애니메이션 추가
      .duration(300) // 애니메이션 지속 시간 0.3초
      .attrTween('d', function(d) {
        const i = d3.interpolate(d.startAngle, d.endAngle); // 시작각과 종료각 보간 함수 생성
        return function(t) { // 보간 함수를 통해 중간 각도 계산
          d.endAngle = i(t); // 중간 각도로 종료각 업데이트
          return arc(d); // 업데이트된 각도로 파이 조각 형상 반환
        }
      });

    // 파이 조각 내부에 성별 텍스트 추가  
    const genderTexts = arcs
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`) // 텍스트 위치 설정 (파이 조각 중심)
      .attr('dy', '0.35em') // 텍스트 수직 위치 조정
      .attr('text-anchor', 'middle') // 텍스트 가운데 정렬
      .attr('font-family', 'Pretendard') // 폰트 패밀리 설정
      .attr('font-size', '40px') // 폰트 크기 설정
      .attr('font-weight', 'bold') // 폰트 두께 설정 
      .attr('fill', 'white'); // 텍스트 색상 설정 (흰색)

    // 성별 텍스트 렌더링
    genderTexts
      .append('tspan')
      .attr('x', 0)
      .attr('y', -10)
      .text(d => d.data.label); // 성별 라벨 출력

    // 값 텍스트 렌더링 (애니메이션 효과)  
    genderTexts
      .append('tspan')
      .attr('x', 0)
      .attr('y', 60)
      .text(0) // 초기값 0 출력
      .transition()
      .duration(1000) // 애니메이션 지속 시간 1초
      .tween('text', function(d) {
        const i = d3.interpolateRound(0, d.data.value); // 0에서 실제 값까지 보간 함수 생성
        return function(t) { // 보간 함수를 통해 중간값 계산하여 텍스트 업데이트
          this.textContent = i(t);
        }
      });
      
    // 제목 텍스트 추가
    svg
      .append('text')
      .attr('x', 0) // 가로 위치 0 (중앙)
      .attr('y', -radius * 0.9) // 세로 위치 (반지름의 0.9배 위)
      .attr('text-anchor', 'middle') // 텍스트 가운데 정렬
      .attr('font-family', 'Pretendard') // 폰트 패밀리
      .attr('font-size', '15px') // 폰트 크기
      .text('성별 분포(명)'); // 제목 텍스트
              }
            }, [data, ageData]);
  
  return (
    <div className="pie-chart-container">
      <svg ref={svgRef}></svg> {/* SVG 요소 렌더링 */}
    </div>
  );
};

export default GenderAgePieChart;