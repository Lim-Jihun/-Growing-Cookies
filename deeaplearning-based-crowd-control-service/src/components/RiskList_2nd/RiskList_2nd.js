import React from 'react';
import './RiskList_2nd.css';

const RiskList = () => {
  const riskData = [
    { artwork: '작품 1', area: '구역 1', count: 80 },
    { artwork: '작품 2', area: '구역 2', count: 98 },
    { artwork: '작품 3', area: '구역 3', count: 87 },
    { artwork: '작품 4', area: '구역 4', count: 76 },
    { artwork: '작품 5', area: '구역 5', count: 65 }
  ];

  return (
    <div className="risk-list-container">
      <div className="header-bar">
        <span>작품명</span>
        <span>구역명</span>
        <span>건수(건)</span>
      </div>
      <div className="risk-list">
        {riskData.map((data, index) => (
          <div key={index} className="risk-item">
            <span>{data.artwork}</span>
            <span>{data.area}</span>
            <span>{data.count}</span>
          </div>
        ))}
      </div>
        <div className="vertical-line left" />
        <div className="vertical-line right" />
    </div>
  );
};

export default RiskList;
