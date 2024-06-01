import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./RiskList_2nd.css";

const RiskList = () => {
  const [riskData, setRiskData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/danger");
        setRiskData(response.data);
      } catch (error) {
        console.error("Error fetching risk data :", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="risk-list-container">
      <table>
        <thead>
          <tr>
            <th>작품명</th>
            <th>구역명</th>
            <th>건수(건)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>작품1</td>
            <td>작품1</td>
            <td>작품1</td>
          </tr>
          <tr>
            <td>작품2</td>
            <td>작품2</td>
            <td>작품2</td>
          </tr>
          <tr>
            <td>작품3</td>
            <td>작품3</td>
            <td>작품3</td>
          </tr>
          <tr>
            <td>작품4</td>
            <td>작품4</td>
            <td>작품4</td>
          </tr>
          <tr>
            <td>작품5</td>
            <td>작품5</td>
            <td>작품5</td>
          </tr>
        </tbody>
      </table>
      {riskData.map((data, index) => (
        <tr key={index} className="risk-item">
          <td>{data.artwork}</td>
          <td>{data.area}</td>
          <td>{data.count}</td>
        </tr>
      ))}
    </div>
  );
};

export default RiskList;
