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

        <Header> 오늘 관람객 추이 </Header>

        <div>
          <div className={styles.grid2row}>
            <div className={styles.gridcontent}>
              <div className={styles.griditem}>
                <DoughnutChart color="#06D6A0" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FFD166" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FF8C42" />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#EF476F" />
              </div>
              <div className={styles.griditem}></div>
              <div className={styles.griditem}></div>
              <div className={styles.griditem}></div>
              <div className={styles.griditem}></div>
            </div>

            <div className={styles.gridcontent}>
              <div className={styles.griditem}>
                <div className="dinfoBox">
                  <p>
                    어제 동시간대 인원 <b>568명</b>
                  </p>
                  <p>
                    1주일 동시간대 평균 <b>768명</b>
                  </p>
                  <p>
                    1개월 동시간대 평균 <b>632명</b>
                  </p>
                </div>
              </div>
              <div className={styles.griditem}>
                <div className="dinfoBox">
                  <p>
                    어제 동시간대 인원 <b>568명</b>
                  </p>
                  <p>
                    1주일 동시간대 평균 <b>768명</b>
                  </p>
                  <p>
                    1개월 동시간대 평균 <b>632명</b>
                  </p>
                </div>
              </div>
              <div className={styles.griditem}>
                <div className="dinfoBox">
                  <p>
                    어제 동시간대 인원 <b>568명</b>
                  </p>
                  <p>
                    1주일 동시간대 평균 <b>768명</b>
                  </p>
                  <p>
                    1개월 동시간대 평균 <b>632명</b>
                  </p>
                </div>
              </div>
              <div className={styles.griditem}>
                <div className="dinfoBox">
                  <p>
                    어제 동시간대 인원 <b>568명</b>
                  </p>
                  <p>
                    1주일 동시간대 평균 <b>768명</b>
                  </p>
                  <p>
                    1개월 동시간대 평균 <b>632명</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div style={{ display: "grid" }}>
              <div className={styles.half}>
                <Header>관람객 비교</Header>
                <WeeklyVisitorTrend
                  data1={lineData2}
                  data2={lineData2}
                  width={150}
                  height={120}
                  color1="#43B077"
                  color2="#DD919B"
                  useAxis={false}
                  useDp={false}
                  useCurve={true}
                  twvisitor={twvisitor}
                  lwvisitor={lwvisitor}
                />
              </div>
            </div>
            <div>
              <LinePlot
                data={lineData}
                width={640}
                height={500}
                color="#FF8C42"
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
