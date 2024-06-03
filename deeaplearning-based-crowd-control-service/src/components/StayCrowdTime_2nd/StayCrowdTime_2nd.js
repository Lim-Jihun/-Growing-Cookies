import React, { useState } from "react";
import "./StayCrowdTime_2nd.css";

const sortData = (data, sortBy, isAscending) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a[sortBy] < b[sortBy]) {
      return isAscending ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return isAscending ? 1 : -1;
    }
    return 0;
  });
  return sortedData;
};

const StayCrowdTime = () => {
  const [crowdTimeData, setCrowdTimeData] = useState([
    { artwork: "작품 01", area: "구역 01", count: 80, time: 5 },
    { artwork: "작품 02", area: "구역 02", count: 98, time: 2 },
    { artwork: "작품 03", area: "구역 03", count: 87, time: 3 },
    { artwork: "작품 04", area: "구역 04", count: 76, time: 7 },
    { artwork: "작품 05", area: "구역 05", count: 65, time: 4 },
    { artwork: "작품 06", area: "구역 06", count: 90, time: 6 },
    { artwork: "작품 07", area: "구역 07", count: 75, time: 8 },
    { artwork: "작품 08", area: "구역 08", count: 85, time: 4 },
    { artwork: "작품 09", area: "구역 09", count: 92, time: 5 },
    { artwork: "작품 10", area: "구역 10", count: 78, time: 3 },
  ]);
  const [sortBy, setSortBy] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  const handleSort = (column) => {
    if (sortBy === column) {
      setIsAscending(!isAscending);
    } else {
      setSortBy(column);
      setIsAscending(true);
    }
    const sortedData = sortData(crowdTimeData, column, isAscending);
    setCrowdTimeData(sortedData);
  };

  return (
    // <div className="stay-crowd-container">
    //   <div className="stay-header-bar">
    //     <span>작품명</span>
    //     <span className="sortable-cell" onClick={() => handleSort('area')}>구역명</span>
    //     <span className="sortable-cell" onClick={() => handleSort('count')}>체류 인원(명)</span>
    //     <span className="sortable-cell" onClick={() => handleSort('time')}>체류 시간(분)</span>
    //   </div>
    //   <div className="stay-list">
    //     {crowdTimeData.map((data, index) => (
    //       <div key={index} className="stay-item">
    //         <span>{data.artwork}</span>
    //         <span className="sortable-cell" onClick={() => handleSort('area')}>{data.area}</span>
    //         <span className="sortable-cell" onClick={() => handleSort('count')}>{data.count}</span>
    //         <span className="sortable-cell" onClick={() => handleSort('time')}>{data.time}</span>
    //       </div>
    //     ))}
    //   </div>
    //   <div className="vertical-line left" />
    //   <div className="vertical-line mid" />
    //   <div className="vertical-line right" />
    // </div>

    <table>
      <thead>
        <tr>
          <th>작품명</th>
          <th>구역명</th>
          <th>인원(명)</th>
          <th>시간(분)</th>
        </tr>
      </thead>
      <tbody>
        {crowdTimeData.map((data, index) => (
          <tr key={index} className="risk-item">
            <td>{data.artwork}</td>
            <td>{data.area}</td>
            <td>{data.count}</td>
            <td>{data.time}</td>
          </tr>
        ))}
      </div>
      <div className="vertical-line left" />
      <div className="vertical-line mid" />
      <div className="vertical-line right" />
    </div>
  );
};

export default StayCrowdTime;
