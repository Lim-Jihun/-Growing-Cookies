import React, { useEffect, useState } from "react";
import "./StayCrowdTime_2nd.css";
import axios from "axios";

const Table = () => {
  const [crowdTimeData, setCrowdTimeData] = useState([
    { area: '구역 01', count: 80, time: 5 },
    { area: '구역 02', count: 98, time: 2 },
    { area: '구역 03', count: 87, time: 3 },
    { area: '구역 04', count: 76, time: 7 },
    { area: '구역 05', count: 65, time: 4 },
    { area: '구역 06', count: 90, time: 6 },
    { area: '구역 07', count: 75, time: 8 }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        const exhbId = 'exhb1';
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        const response = await axios.get(`http://localhost:4000/bywork`, {
          params: { userId, exhbId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data);
        };



      }
      catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <table className="stay-crowd-table">
      <thead>
        <tr>
          <th>구역명</th>
          <th onClick={() => handleSort('count')}>인원(명)</th>
          <th onClick={() => handleSort('time')}>시간(분)</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 &&
          sortedData.map((data, index) => (
            <tr key={index} className="stay-item">
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