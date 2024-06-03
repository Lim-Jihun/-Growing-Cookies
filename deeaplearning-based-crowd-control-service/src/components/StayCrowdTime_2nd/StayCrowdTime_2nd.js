import React, { useState } from "react";
import "./StayCrowdTime_2nd.css";

const Table = () => {
  const [crowdTimeData, setCrowdTimeData] = useState([
    { artwork: '작품 01', area: '구역 01', count: 80, time: 5 },
    { artwork: '작품 02', area: '구역 02', count: 98, time: 2 },
    { artwork: '작품 03', area: '구역 03', count: 87, time: 3 },
    { artwork: '작품 04', area: '구역 04', count: 76, time: 7 },
    { artwork: '작품 05', area: '구역 05', count: 65, time: 4 },
    { artwork: '작품 06', area: '구역 06', count: 90, time: 6 },
    { artwork: '작품 07', area: '구역 07', count: 75, time: 8 }   
  ]);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = sortColumn
    ? [...crowdTimeData].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : crowdTimeData;

  return (
    <table style={{ margin: '0 20px' }}>
      <thead>
        <tr>
          <th>작품명</th>
          <th onClick={() => handleSort('area')}>구역명</th>
          <th onClick={() => handleSort('count')}>인원(명)</th>
          <th onClick={() => handleSort('time')}>시간(분)</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 &&
          sortedData.map((data, index) => (
            <tr key={index} className="risk-item">
              <td>{data.artwork}</td>
              <td>{data.area}</td>
              <td>{data.count}</td>
              <td>{data.time}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;