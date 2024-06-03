import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import styles from "./DougnutChart.module.css";

const DoughnutChart = ({ color, doughnutdata, yesterday, week, month }) => {
  
  
 
  const [chartData, setChartData] = useState({
    
  
    series: [0],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "60%",
          },
          dataLabels: {
            name: {
              show: true,
            },
            value: {
              show: true,
              fontSize: "30px",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "30px",
            },
          },
        },
      },
      colors: [color],
      labels: ["Cricket"],
    },
  });

  useEffect(() => {
    // doughnutdata prop이 변경될 때마다 실행됨
    const persent = parseInt(doughnutdata);
    setChartData(prevState => ({
      ...prevState,
      series: [persent], // persent 값을 series에 반영
    }));
  }, [doughnutdata]); // doughnutdata prop을 의존성 배열에 추가


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");

        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        // 서버에 GET 요청을 보냅니다.
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div id="dchart1">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="radialBar"
          height={299}
        />
      </div>
      <div id="html-dist1"></div>
      <p>
        어제 동시간대 인원 <b>{yesterday}명</b>
      </p>
      <p>
        1주일 동시간대 평균 <b>{week}명</b>
      </p>
      <p>
        1개월 동시간대 평균 <b>{month}명</b>
      </p>
    </div>
  );
};

export default DoughnutChart;
