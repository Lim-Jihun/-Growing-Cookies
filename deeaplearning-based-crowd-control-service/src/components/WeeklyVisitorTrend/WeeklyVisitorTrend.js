import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./WeeklyVisitorTrend.module.css";
import LinePlot from "../LineChart/LineChart";

const WeeklyVisitorTrend = ({
  data1 = [],
  data2 = [],
  width,
  height,
  color1,
  color2,
  useAxis,
  useDp,
  useCurve,
  twvisitor,
  lwvisitor,
}) => {
  let llwvisitor = 20;
  let icon1 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="#3498DB"
      class="bi bi-dash"
      viewBox="0 0 16 16"
    >
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
    </svg>
  );
  let icon2 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      fill="#3498DB"
      class="bi bi-dash"
      viewBox="0 0 16 16"
    >
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
    </svg>
  );
  if (twvisitor > lwvisitor) {
    icon1 = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        fill="#EC5454"
        class="bi bi-arrow-up"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
        />
      </svg>
    );
  } else {
    icon1 = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#3498DB"
        class="bi bi-triangle-fill"
        viewBox="0 0 16 16"
        style={{ marginLeft: "2rem", transform: "rotate(60deg)" }}
      >
        <path
          fill-rule="evenodd"
          d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
        />
      </svg>
    );
  }
  if (lwvisitor > llwvisitor) {
    icon2 = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="#EC5454"
        class="bi bi-triangle-fill"
        viewBox="0 0 16 16"
        style={{ marginLeft: "2rem" }}
      >
        <path
          fill-rule="evenodd"
          d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z"
        />
      </svg>
    );
  } else {
    icon2 = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="20"
        fill="#549AEC"
        class="bi bi-arrow-down"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
        />
      </svg>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");

        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        const response = await axios.get(`http://localhost:4000/thisweek`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });
     
        const response2 = await axios.get(`http://localhost:4000/lastweek`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data);
        }
        if (response2.status === 200) {
          console.log(response2.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className={styles.VisitorTrend}>
      <table className={styles.visitor}>
        <tr>
          <td className={styles.td}>
            <LinePlot
              data={data1}
              width={width}
              height={height}
              color={color1}
              useAxis={useAxis}
              useDp={useDp}
              useCurve={useCurve}
            />
          </td>
          <td className={styles.td}>
            <div className={styles.infoCol}>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.numCol}>
                  <p className={styles.num}>{twvisitor}</p>

                  <div className={styles.arrawCol}>{icon1}</div>
                </div>
              </div>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.guide}>
                  <p className={styles.rguide}>이번주 방문자</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <div className={styles.borderLine} />
        <tr>
          <td className={styles.td}>
            <LinePlot
              data={data2}
              width={width}
              height={height}
              color={color2}
              useAxis={useAxis}
              useDp={useDp}
              useCurve={useCurve}
            />
          </td>
          <td className={styles.td}>
            <div className={styles.infoCol}>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.numCol}>
                  <p className={styles.num}>{lwvisitor}</p>
                </div>
                <div className={styles.arrawCol}>{icon2}</div>
              </div>
              <div className={styles.numOrGuideRaw}>
                <div className={styles.guide}>
                  <p className={styles.rguide}>지난주 방문자</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default WeeklyVisitorTrend;
