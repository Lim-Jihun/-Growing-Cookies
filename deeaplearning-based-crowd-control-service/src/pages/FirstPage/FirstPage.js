import React, { useState, useEffect } from "react";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart";
import styles from "./FirstPage.module.css";
import LinePlot from "../../components/LineChart/LineChart.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import { ToastContainer, toast } from "react-toastify";

const FirstPage = () => {
  const [lineData, setLineData] = useState([]);
  const [lineData2, setLineData2] = useState([]);

  useEffect(() => {
    // 데이터를 비동기적으로 가져오거나 초기화할 수 있습니다.
    const fetchData = async () => {
      // 데이터 가져오기 로직 (예: API 호출)
      const data = [10, 15, 30, 50, 100, 65, 55, 30, 20, 10, 8];
      setLineData(data);

      // 두 번째 데이터 가져오기 로직
      const data2 = [80, 20, 25, 40, 80, 60, 45, 20, 10, 5, 4];
      setLineData2(data2);
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
          <LinePlot
            data={lineData2}
            width={200}
            height={150}
            color="#DD919B"
            useAxis={false}
            useDp={false}
            useCurve={true}
          />
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
