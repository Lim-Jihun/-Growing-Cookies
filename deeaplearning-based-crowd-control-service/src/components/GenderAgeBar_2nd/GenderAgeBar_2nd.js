import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./GenderAgeBar_2nd.module.css";

const GenderAgeBar = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 그래프 여백 설정
        const margin = { top: 60, right: 20, bottom: 30, left: 40 };
        const width = 760 - margin.left - margin.right;
        const height = 650 - margin.top - margin.bottom;

        // x, y 축 스케일 설정
        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);

        // x, y 축 도메인 설정
        x.domain(data.map((d) => d.age));
        y.domain([0, d3.max(data, (d) => d.value)]); // y 축 도메인을 파이차트 값의 최대값으로 설정

        d3.select(svgRef.current).selectAll("*").remove();

        // SVG 요소 생성 및 여백 설정
        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // x축 렌더링
        svg
          .append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0, ${height})`)
          .call(d3.axisBottom(x))
          .attr("font-family", "Pretendard")
          .attr("font-size", "16px")
          .attr("font-weight", "regular");

        // x축 범례
        svg
            .append('text')
            .attr('class', 'axis-label')
            .attr('x', -margin.left + 40)
            .attr('y', -margin.top + 30)
            .attr('transform', 'rotate(-90')
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Pretendard')
            .attr('font-size', '15px')
            .attr('font-weight', 'regular')
            .text('인원(명)')

        // y축 렌더링
        svg
          .append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(y).ticks(8)) // y축 눈금 개수 설정
          .attr("font-family", "Pretendard")
          .attr("font-size", "16px")
          .attr("font-weight", "regular");

        // y축 범례
        svg
            .append('text')
            .attr('class', 'axis-label')
            .attr('x', width/2)
            .attr('y', height + margin.bottom + 25)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'Pretendard')
            .attr('font-size', '15px')
            .attr('font-weight', 'regular')
            .text('시간(시)')

        

        // 막대 그래프와 애니메이션
        const bars = svg
          .selectAll(".bar") // 기존 '.bar' 클래스 요소 선택 -> bar의 세팅을 설정
          .data(data) // 데이터 바인딩
          .enter() // 새로운 데이터에 대한 요소 생성
          .append("rect") // 새 요소를 rect로 추가
          .attr("class", "bar") // 클래스 이름 지정
          .attr("x", (d) => x(d.age)) // x 위치 설정
          .attr("width", x.bandwidth()) // 막대 너비 설정 -> 너비에 맞춰 막대 너비 분배
          .attr("y", (d) => y(0)) // 초기 y 위치 0으로 설정
          .attr("height", (d) => height - y(0)) // 초기 높이 0으로 설정
          .style("fill", (d, i) => {
            // 막대 색상 설정
            const sortedData = data.slice().sort((a, b) => b.value - a.value);
            const index = sortedData.findIndex((item) => item.age === d.age);
            const colors = [
              "#3498DB",
              "#EF476F",
              "#FFD166",
              "#06D6A0",
              "#118AB2"
            ];
            return colors[index];
          });

        // 막대 그래프 애니메이션
        bars
          .transition() // 트랜지션 시작
          .duration(1000) // 애니메이션 지속 시간 1초
          .attr("y", (d) => y(d.value)) // 실제 데이터에 따른 y 위치로 이동
          .attr("height", (d) => height - y(d.value)); // 실제 데이터에 따른 높이로 변경

        // 숫자 애니메이션
        const text = svg
          .selectAll(".label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("x", (d) => x(d.age) + x.bandwidth() / 2) // 막대 가운데에 숫자 위치
          .attr("y", (d) => y(d.value) - 20) // 숫자를 막대 위로 조금 올림
          .attr("dy", "15px") // 텍스트 수직 정렬 조정
          .text(0) // 초기 숫자 0으로 설정
          .attr("font-family", "Pretendard")
          .attr("font-size", "20px")
          .attr("font-weight", "bold")
          .attr("text-anchor", "middle"); // 텍스트 가운데 정렬

        // 숫자 애니메이션 트랜지션
        text
          .transition()
          .duration(1000) // 애니메이션 지속 시간 1초
          .tween("text", function (d) {
            const i = d3.interpolateRound(0, d.value); // 숫자 함수 (0에서 실제 데이터 값으로 변화)
            return function (t) {
              this.textContent = i(t); // 숫자 업데이트
            };
          });

        // 제목 추가
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", -margin.top / 2)
          .attr("text-anchor", "middle")
          .attr("font-family", "Pretendard")
          .attr("font-size", "20px")
          .text("연령대별 분포");
      } catch (error) {
        console.error("Error fetching data:", error); // 데이터가 알맞게 전송되지 않았을 경우 출력할 메시지
      }
    };

    fetchData();
  }, [data]);

  return (
    <div className="bar-graph-container">
      <svg ref={svgRef} className="bar-graph"></svg>
    </div>
  );
};

export default GenderAgeBar;
