import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StayCrowdTime_2nd.css";

const Table = ({selectedDate}) => {
  const [crowdTimeData, setCrowdTimeData] = useState([]); // 초기 상태를 빈 배열로 설정
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        
        const exhbId = 'exhb1'; // 임시로 설정
        const date = selectedDate;
        
        const response = await axios.get(`http://localhost:4000/bywork`, {
          params: { userId, exhbId, date },
          withCredentials: true,
        });

        if (response.status === 200) {
          const latestData = response.data.reduce((acc, curr) => {
            if (!acc[curr.zone_name] || new Date(acc[curr.zone_name].time) < new Date(curr.time)) {
              acc[curr.zone_name] = curr;
            }
            return acc;
          }, {});

          setCrowdTimeData(Object.values(latestData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

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
    <table className="stay-crowd-table">
      <thead>
        <tr>
          <th>구역명</th>
          <th onClick={() => handleSort('population')}>인원(명)</th>
          <th onClick={() => handleSort('staying_time')}>시간(분)</th>
        </tr>
      </thead>
      <tbody>
        {sortedData.length > 0 &&
          sortedData.map((data, index) => (
            <tr key={index} className="stay-item">
              <td>{data.zone_name}</td>
              <td>{data.population}</td>
              <td>{data.staying_time}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
