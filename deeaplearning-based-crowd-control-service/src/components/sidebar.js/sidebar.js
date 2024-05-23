import React from "react";
import { FiPieChart, FiGrid } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { MdOutlineEditNote } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

function Sidebar() {
  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.box}>
          <FiPieChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>오늘의 개요</span>
        </div>

        <div className={styles.box}>
          <FiGrid color="white" size={50} className={styles.icon} />
          <span className={styles.text}>실내혼잡도 확인</span>
        </div>

        <div className={styles.box}>
          <IoStatsChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>상세정보 확인</span>
        </div>

        <div className={styles.box}>
          <MdOutlineEditNote color="white" size={50} className={styles.icon} />
          <span className={styles.text}>분석 보기</span>
        </div>

        <div className={styles.box}>
          <IoMdNotificationsOutline
            color="white"
            size={50}
            className={styles.icon}
          />
          <span className={styles.text}>알림 설정</span>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
