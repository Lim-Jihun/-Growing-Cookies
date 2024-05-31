import React, { act, useEffect, useRef, useState } from "react";
import { FiPieChart, FiGrid } from "react-icons/fi";
import { IoStatsChart } from "react-icons/io5";
import styles from "./Sidebar.module.css";
import { MdOutlineEditNote } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { color } from "d3";

const Sidebar = (props) => {
  // console.log(
  //   "sessionStorage.getItem('userID')",
  //   sessionStorage.getItem("userID")
  // ); // user1

  const nav = useNavigate();
  const location = useLocation();

  const indexRef = useRef();
  // 메뉴 리스트
  // 활성화된 메뉴v
  const [activeMenu, setActiveMenu] = useState();

  const handleMenuCk = (props) => {
    console.log("menu ck", props);

    //  디자인이 바껴야됨
    setActiveMenu(props);
    nav(`/${props}`, { state: { userId: sessionStorage.getItem("userID") } });
  };

  // console.log("location.state.userId", sessionStorage.getItem("userID"));
  let isLogged = location.state == null ? null : location.state.userId;

  const handleLogout = () => {
    console.log("Logout ck");
    sessionStorage.clear();

    isLogged = null;
    console.log(
      "sessionStorage.getItem('userID')",
      sessionStorage.getItem("user_id")
    ); //null
    nav("/", { state: null });
  };

  return (
    <>
      <div className={styles.sidebar}>
        <button
          className={"inside" === activeMenu ? styles.active : styles.box}
          menu="오늘의개요"
          onClick={() => {
            handleMenuCk("index");
          }}
        >
          <FiPieChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>오늘의 개요</span>
        </button>
        <button
          className={"inside" === activeMenu ? styles.active : styles.box}
          onClick={() => {
            handleMenuCk("inside");
          }}
        >
          <FiGrid color="white" size={50} className={styles.icon} />
          <span className={styles.text}>실내혼잡도 확인</span>
        </button>
        <button
          className={"detail" === activeMenu ? styles.active : styles.box}
          onClick={() => {
            handleMenuCk("detail");
          }}
        >
          <IoStatsChart color="white" size={50} className={styles.icon} />
          <span className={styles.text}>상세정보 확인</span>
        </button>
        <button
          className={"future" === activeMenu ? styles.active : styles.box}
          onClick={() => {
            handleMenuCk("future");
          }}
        >
          <MdOutlineEditNote color="white" size={50} className={styles.icon} />
          <span className={styles.text}>분석 보기</span>
        </button>
        <button
          className={"notification" === activeMenu ? styles.active : styles.box}
          onClick={() => {
            handleMenuCk("notification");
          }}
        >
          <IoMdNotificationsOutline
            color="white"
            size={50}
            className={styles.icon}
          />
          <span className={styles.text}>알림 설정</span>
        </button>
        <button
          className={"profile" === activeMenu ? styles.active : styles.box}
          onClick={() => {
            handleMenuCk("profile");
          }}
        >
          <div className={styles.profile}>
            <img
              alt="profile"
              src="https://i.namu.wiki/i/HmmZ7T3vGlrBfU-jcL3GqrdsHJ0Amjkoj_Og5U4Q-j8odCmpqdFOi2mUT66Tmz6-UX-ashFao-jst3jiCxBSow.webp"
              className={styles.photo}
            />
          </div>
        </button>

        {sessionStorage.getItem("userID") == null ? (
          <div className={styles.box}>
            <button
              className={"login" === activeMenu ? styles.active : styles.box}
              type="button"
              onClick={() => {
                nav("/login");
              }}
            >
              로그인
            </button>
          </div>
        ) : (
          <div className={styles.box}>
            <button
              className={styles.btn}
              type="button"
              onClick={() => {
                handleLogout();
              }}
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
