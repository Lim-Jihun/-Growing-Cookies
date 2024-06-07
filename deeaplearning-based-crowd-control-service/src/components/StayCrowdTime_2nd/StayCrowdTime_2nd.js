import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StayCrowdTime_2nd.css";

const Table = () => {
  const [crowdTimeData, setCrowdTimeData] = useState([
    { zone_name: '구역 01', population: 80, staying_time: 5 },
    { zone_name: '구역 02', population: 98, staying_time: 2 },
    { zone_name: '구역 03', population: 87, staying_time: 3 },
    { zone_name: '구역 04', population: 76, staying_time: 7 },
    { zone_name: '구역 05', population: 65, staying_time: 4 },
    { zone_name: '구역 06', population: 90, staying_time: 6 },
    { zone_name: '구역 07', population: 75, staying_time: 8 }   
  ]);
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
        //  세션에서 exhbID 비교
        // const exhbId = sessionStorage.getItem("exhbID"); // 세션에서 exhbId 가져오기

        // if (!exhbId) {
        //   console.error("세션에서 exhbID를 가져올 수 없습니다.");
        //   return;
        // }
        const exhbId = 'exhb1';

        const response = await axios.get(`http://localhost:4000/bywork`, {
          params: { userId, exhbId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (response.status === 200) {
          // API에서 받아온 데이터를 설정
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
  }, []);

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