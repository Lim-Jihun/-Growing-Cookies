import Sidebar from "../../components/Sidebar/Sidebar.js";
import GenderAgePieChart_2nd from "../../components/GenderAgePieChart_2nd/GenderAgePieChart_2nd";
import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";
import styles from "./ForthPage.module.css";
import React, { useState } from "react";

const ForthPage = () => {
  const [selectedData, setSelectedData] = useState([]);
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <GenderAgePieChart_2nd setSelectedData={setSelectedData} />
        <GenderAgeBar_2nd data={selectedData} />
      </div>
    </>
  );
};

export default ForthPage;