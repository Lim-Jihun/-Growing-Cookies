import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ThirdPage.module.css";
import LineGraph_2nd from "../../components/LineGraph_2nd/LineGraph_2nd";
import DangerPlaceBar_2nd from "../../components/DangerPlaceBar_2nd/DangerPlaceBar_2nd.js";
import RiskList_2nd from "../../components/RiskList_2nd/RiskList_2nd";
import StayCrowdTime_2nd from "../../components/StayCrowdTime_2nd/StayCrowdTime_2nd.js";
import GenderAgePieChart_2nd from "../../components/GenderAgePieChart_2nd/GenderAgePieChart_2nd";
import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";
import React, { useState } from "react";
import Header from "../../components/Header/Header.js";
const ThirdPage = () => {
  const [selectedData, setSelectedData] = useState([]);
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>분석페이지</h2>
        </div>
        <div className={`${styles.graphContainer} ${styles.row1}`}>
          <Header>평균 관람객 추이</Header>
          <LineGraph_2nd />
        </div>
        <div className={`${styles.graphContainer} ${styles.row2}`}>
          <Header>혼잡도 상위 구역 5곳</Header>
          <div className={styles.hcenterdanger}>
            <DangerPlaceBar_2nd />
          </div>
        </div>
        <div className={`${styles.graphContainer} ${styles.row3}`}>
          <Header>작품별 체류 인원/평균 체류 시간 목록</Header>
          <div className={styles.hcenter}>
          <StayCrowdTime_2nd />
        </div>
        </div>
        <div className={`${styles.graphContainer} ${styles.row4}`}></div>
        <div className={`${styles.graphContainer} ${styles.row5}`}>
          <Header>관람객 남녀, 연령대 통계</Header>
          <div className={styles.left}>
            <GenderAgePieChart_2nd setSelectedData={setSelectedData} />
          </div>
          <div className={styles.right}>
            <div className={styles.shiftDown}>
              <GenderAgeBar_2nd
                data={selectedData}
                className={styles.genderbar}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThirdPage;
