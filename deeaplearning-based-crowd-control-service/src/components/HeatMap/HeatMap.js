import React, { useEffect, useState, useRef } from 'react';
import h337 from 'heatmap.js';
import './HeatMap.css';

const HeatMap = () => {
  const heatmapRef = useRef(null);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [selectedHour, setSelectedHour] = useState(10);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapInstance, setHeatmapInstance] = useState(null);

  useEffect(() => {
    // 전시관 목록 가져오기 (더미 데이터 사용)
    const dummyExhibitionList = [
      { id: 'exhb1', name: '전시관 A' },
      { id: 'exhb2', name: '전시관 B' },
      { id: 'exhb3', name: '전시관 C' },
    ];
    setExhibitionList(dummyExhibitionList);
  }, []);

  useEffect(() => {
    if (selectedExhibition) {
      // 선택한 전시관의 최대 입장객 수와 현재 입장객 수 가져오기 (더미 데이터 사용)
      const dummyCapacityData = {
        maxCapacity: Math.floor(Math.random() * 1000) + 500,
        currentCapacity: Math.floor(Math.random() * 500) + 100,
      };
      setMaxCapacity(dummyCapacityData.maxCapacity);
      setCurrentCapacity(dummyCapacityData.currentCapacity);
    }
  }, [selectedExhibition]);

  useEffect(() => {
    if (selectedExhibition && heatmapRef.current) {
      const width = 1920;
      const height = 1080;

      // 히트맵 인스턴스 생성
      const instance = h337.create({
        container: heatmapRef.current,
        radius: 20,
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.75,
      });
      setHeatmapInstance(instance);

      // 히트맵 렌더링 함수
      const renderHeatmap = (data) => {
        if (heatmapInstance) { // heatmapInstance가 null이 아닌지 확인
          const max = data.reduce((prev, curr) => Math.max(prev, curr.value), 0);
          const heatmapData = { max, data };
          heatmapInstance.setData(heatmapData);
        }
      };      
      
      // 선택된 시간대와 전시관에 따라 데이터 가져오기 (더미 데이터 사용)
      const fetchData = () => {
        const data = Array.from({ length: 300 }, () => ({
          x: Math.floor(Math.random() * width),
          y: Math.floor(Math.random() * height),
          value: Math.random(),
        }));
        setHeatmapData(data);
        if (heatmapInstance) { // heatmapInstance가 null이 아닌지 확인
          renderHeatmap(data); // 데이터를 가져온 후에 히트맵 렌더링
        }
      };
      
      
      fetchData(); // 데이터 가져오기
      }
      }, [selectedExhibition, selectedHour, selectedMinute]);
      
      useEffect(() => {
        return () => {
          if (heatmapInstance && typeof heatmapInstance.destroy === 'function') {
            heatmapInstance.destroy();
          }
        };
      }, [heatmapInstance]);
      
      
      const handleExhibitionChange = (event) => {
        const selectedExhibitionId = event.target.value;
        const selectedExhibition = exhibitionList.find(
          (exhibition) => exhibition.id === selectedExhibitionId
        );
        setSelectedExhibition(selectedExhibition);
      };
      
      const handleHourChange = (event) => {
        const hour = parseInt(event.target.value);
        setSelectedHour(hour);
      };
      
      const handleMinuteChange = (event) => {
        const minute = parseInt(event.target.value);
        setSelectedMinute(minute);
      };
      
      return (
        <div className="heatmap-container">
          <div>
            <label htmlFor="exhibition-select">전시관 선택:</label>
            <select id="exhibition-select" onChange={handleExhibitionChange}>
              <option value="">전시관 선택</option>
              {exhibitionList.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id}>
                  {exhibition.name}
                </option>
              ))}
            </select>
          </div>
          <div>
  <label htmlFor="hour-select">시간:</label>
  <select id="hour-select" onChange={handleHourChange}>
    {[...Array(10).keys()].map((hour) => (
      <option key={hour + 9} value={hour + 9}>
        {hour + 9}
      </option>
    ))}
  </select>
  <label htmlFor="minute-select">분:</label>
  <select id="minute-select" onChange={handleMinuteChange}>
    {[0, 10, 20, 30, 40, 50].map((minute) => (
      <option key={minute} value={minute}>
        {minute}
      </option>
    ))}
  </select>
</div>

{selectedExhibition && (
  <div>
    <p>
      최대 입장객 수: {maxCapacity}명 / 현재 입장객 수: {currentCapacity}명
    </p>
  </div>
)}
<div ref={heatmapRef} style={{ width: '1920px', height: '1080px' }}></div>
</div>
);
};

export default HeatMap;
