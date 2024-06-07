import React, { useState, useEffect } from "react";

import styles from "./FirstPage.module.css";

import { ToastContainer, toast } from "react-toastify";
import WeeklyVisitorTrend from "../../components/WeeklyVisitorTrend/WeeklyVisitorTrend.js";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.js";
import LinePlot from "../../components/LineChart/LineChart.js";
import Header from "../../components/Header/Header.js";
import axios from "axios";

const FirstPage = () => {
  const [d1Data, setD1Data] = useState([]);
  const [d2Data, setD2Data] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  const [d4Data, setD4Data] = useState([]);
  const [db1yData, setDb1yData] = useState([]);
  const [db2yData, setDb2yData] = useState([]);
  const [db3yData, setDb3yData] = useState([]);
  const [db4yData, setDb4yData] = useState([]);
  const [db1wData, setDb1wData] = useState([]);
  const [db2wData, setDb2wData] = useState([]);
  const [db3wData, setDb3wData] = useState([]);
  const [db4wData, setDb4wData] = useState([]);
  const [db1mData, setDb1mData] = useState([]);
  const [db2mData, setDb2mData] = useState([]);
  const [db3mData, setDb3mData] = useState([]);
  const [db4mData, setDb4mData] = useState([]);
  const [blineDataf, setBLineData] = useState([]);
  const [weekavg, setWeekAvg] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        console.log("fpUserId", userId);
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        // 도넛차트 요청
        const response = await axios.get(`http://localhost:4000/donutchart`, {
          params: { userId }, // userId 전달
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("도넛데이터", response.data);
        }

        // 도넛차트 데이터 설정하기
        // if (response.data.length >= 4) {
        setD1Data(response.data[0].total_population);
        setD2Data(response.data[1].total_population);
        setD3Data(response.data[2].total_population);
        setD4Data(response.data[2].total_population);

        //도넛 아래 데이터 요청
        const sameResponse = await axios.get(`http://localhost:4000/sametime`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (sameResponse.status === 200) {
          console.log("도넛아래데이터", sameResponse.data);
        }

        // 도넛 아래 데이터 전달
        setDb1yData(parseInt(sameResponse.data[0].yesterday_avg_population));
        setDb1wData(parseInt(sameResponse.data[0].last_week_avg_population));
        setDb1mData(parseInt(sameResponse.data[0].last_month_avg_population));

        setDb2yData(parseInt(sameResponse.data[1].yesterday_avg_population));
        setDb2wData(parseInt(sameResponse.data[1].last_week_avg_population));
        setDb2mData(parseInt(sameResponse.data[1].last_month_avg_population));

        setDb3yData(parseInt(sameResponse.data[2].yesterday_avg_population));
        setDb3wData(parseInt(sameResponse.data[2].last_week_avg_population));
        setDb3mData(parseInt(sameResponse.data[2].last_month_avg_population));

        setDb4yData(parseInt(sameResponse.data[3].yesterday_avg_population));
        setDb4wData(parseInt(sameResponse.data[3].last_week_avg_population));
        setDb4mData(parseInt(sameResponse.data[3].last_month_avg_population));

        // 큰 라인그래프 데이터 요청
        const btResponse = await axios.get(`http://localhost:4000/bytime`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (btResponse.status === 200) {
          console.log("시간별인원데이터", btResponse.data);
        }

        // 큰 라인그래프 데이터 전달
        const blineDatat = btResponse.data.map((item, index) => ({
          hour: 9 + index,
          today: parseInt(item.total_population),
        }));
        setBLineData(blineDatat);

        const weekResponse = await axios.get(`http://localhost:4000/weekavg`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (weekResponse.status === 200) {
          console.log("주간평균데이터", weekResponse.data);
          const weekAvgData = weekResponse.data.map((item, index) => ({
            last_month: parseInt(item.last_month_avg_population),
            last_week: parseInt(item.last_week_avg_population),
            this_week: parseInt(item.this_week_avg_population),
          }));
          const weekAvgDataObj = weekAvgData[0];

          console.log("주평균 객체", weekAvgDataObj);
          setWeekAvg(weekAvgDataObj);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval); // 컴포넌트가 unmount될 때 interval 해제
  }, []);

  // 토스트 알림


  const notify = () =>
    toast.error("밀집도를 확인하세요", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  if (d1Data > 50) {
    notify();
  }

  return (
    <>
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>메인 페이지</h2>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div className={styles.gridcontent}>
              <Header> 실시간 밀집도</Header>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d1Data}
                  exhibition = "제1전시관"
                  yesterday={db1yData}
                  week={db1wData}
                  month={db1mData}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d2Data}
                  exhibition = "제2전시관"
                  yesterday={db2yData}
                  week={db2wData}
                  month={db2mData}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d3Data}
                  exhibition = "제3전시관"
                  yesterday={db3yData}
                  week={db3wData}
                  month={db3mData}
                />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart
                  doughnutdata={d4Data}
                  exhibition = "제4전시관"
                  yesterday={db4yData}
                  week={db4wData}
                  month={db4mData}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.SecondRawParent}>
          <div className={styles.SecondRaw}>
            <div className={styles.half1}>
              <Header>일주일 추이</Header>
              <div className={styles.WeekOrNowCol}>
                <WeeklyVisitorTrend
                  width={230}
                  height={120}
                  color1="#10A400"
                  color2="#FF0000"
                  useAxis={false}
                  useDp={false}
                  useCurve={true}
                  weekavg={weekavg}
                />
              </div>
            </div>
            <div className={styles.half2}>
            <Header  style={{ width: "calc(100% + 20px)", paddingRight: "10px"  }}>일일 추이</Header>
              <LinePlot
                data={blineDataf}
                width={718}
                height={350}
                color="#3498DB"
                useAxis={true}
                useDp={true}
                useCurve={false}
              />
            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default FirstPage;
