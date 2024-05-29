import React from 'react';
import './StayCrowdTime_2nd.css';

const StayCrowdTime = () => {
  const crowdTimeData = [
    { artwork: '작품 1', area: '구역 1', count: 80, time: 5 },
    { artwork: '작품 2', area: '구역 2', count: 98, time: 2 },
    { artwork: '작품 3', area: '구역 3', count: 87, time: 3 },
    { artwork: '작품 4', area: '구역 4', count: 76, time: 7 },
    { artwork: '작품 5', area: '구역 5', count: 65, time: 4 }
  ];

  return (
    <div className="stay-crowd-container">
      <div className="stay-header-bar">
        <span>작품명</span>
        <span>구역명</span>
        <span>체류 인원(명)</span>
        <span>체류 시간(분)</span>
      </div>
      <div className="stay-list">
        {crowdTimeData.map((data, index) => (
          <div key={index} className="stay-item">
            <span>{data.artwork}</span>
            <span>{data.area}</span>
            <span>{data.count}</span>
            <span>{data.time}</span>
          </div>
        ))}
      </div>
      <div className="vertical-line left" />
      <div className="vertical-line mid" />
      <div className="vertical-line right" />
    </div>
  );
};

export default StayCrowdTime;
