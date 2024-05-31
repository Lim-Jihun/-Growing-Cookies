import React, { useState, useEffect } from "react";

import styles from "./FirstPage.module.css";

import { ToastContainer, toast } from "react-toastify";
import WeeklyVisitorTrend from "../../components/WeeklyVisitorTrend/WeeklyVisitorTrend.js";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.js";
import LinePlot from "../../components/LineChart/LineChart.js";
import Header from "../../components/Header/Header.js";

const FirstPage = () => {
  const [lineData, setLineData] = useState([]);
  const [lineData2, setLineData2] = useState([]);
  const [twvisitor, setTwvisitor] = useState(0);
  const [lwvisitor, setLwvisitor] = useState(0);

  useEffect(() => {
    // 데이터를 비동기적으로 가져오거나 초기화할 수 있습니다.
    const fetchData = async () => {
      // 데이터 가져오기 로직 (예: API 호출)
      const data = [10, 15, 30, 50, 100, 65, 55, 30, 20, 10, 8];
      setLineData(data);

      // 두 번째 데이터 가져오기 로직
      const data2 = [80, 20, 25, 40, 80, 60, 45, 20, 10, 5, 4];
      setLineData2(data2);

      // twvisitor와 lwvisitor 계산 로직 추가
      const twvisitor = 222;
      const lwvisitor = 333;

      setTwvisitor(twvisitor);
      setLwvisitor(lwvisitor);
    };

    fetchData();
  }, []);

  const notify = () =>
    toast.error("토스트 내용!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  return (
    <>
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>메인페이지</h2>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div className={styles.gridcontent}>
              <Header> 실시간 밀집도</Header>
              <div className={styles.griditem}>
                <DoughnutChart color="#10A400" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FFC300" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FF6B00" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FF0000" />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div className={styles.half}>
              <Header>일주일 추이</Header>
              <div className={styles.WeekOrNowCol}>
                <WeeklyVisitorTrend
                  data1={lineData2}
                  data2={lineData2}
                  width={350}
                  height={120}
                  color1="#10A400"
                  color2="#FF0000"
                  useAxis={false}
                  useDp={false}
                  useCurve={true}
                  twvisitor={twvisitor}
                  lwvisitor={lwvisitor}
                />
              </div>
            </div>
            <div className={styles.half}>
              <Header>일일 추이</Header>
              <LinePlot
                data={lineData}
                width={800}
                height={350}
                color="#3498DB"
                useAxis={true}
                useDp={true}
                useCurve={false}
              />
            </div>
          </div>
        </div>

        <button onClick={notify}>토스트 알림 보이기</button>
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
