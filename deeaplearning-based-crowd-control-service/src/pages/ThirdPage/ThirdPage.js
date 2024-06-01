import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ThirdPage.module.css";
import LineGraph_2nd from "../../components/LineGraph_2nd/LineGraph_2nd";
import DangerPlaceBar_2nd from "../../components/DangerPlaceBar_2nd/DangerPlaceBar_2nd.js";
import GenderAgePieChart_2nd from "../../components/GenderAgePieChart_2nd/GenderAgePieChart_2nd";
import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";
import React, { useState } from "react";

const ThirdPage = () => {
  const [selectedData, setSelectedData] = useState([]);
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.graphContainer}>
          <LineGraph_2nd />
        </div>
        <div className={styles.graphContainer}>
          <DangerPlaceBar_2nd />
        </div>
        <div className={styles.graphContainer}>
          <GenderAgePieChart_2nd setSelectedData={setSelectedData} />
        </div>
        <div className={styles.graphContainer}>
          <GenderAgeBar_2nd data={selectedData} />
        </div>
      </div>
    </>
  );
};

export default ThirdPage;