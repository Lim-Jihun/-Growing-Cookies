import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ForthPage.module.css";
import Header from "../../components/Header/Header.js";
import ResultBarGender from "../../components/Result_Bar_Gender/Result_Bar_Gender.js";
import Result_Bar_Age from "../../components/Result_Bar_Age/Result_Bar_Age.js";
import Result_Bar_Crowd from "../../components/Result_Bar_Crowd/Result_Bar_Crowd.js";

const ForthPage = () => {
  const [genderResult, setGenderResult] = useState({ gender: '', man_pct: 0, woman_pct: 0 });
  const [ageResult, setAgeResult] = useState({ ageGroup: '', youngerTotal: 0, olderTotal: 0 });
  const [crowdResult, setCrowdResult] = useState({ label: '', value: 0 });

  let genderResultText = '';
  let ageResultText = '';
  let crowdResultText = '';

  // 성별 분석 결과 추가
  if (genderResult.gender === 'M') {
    genderResultText = `남성 관람객이 더 많습니다. (남성: ${genderResult.man_pct}%, 여성: ${genderResult.woman_pct}%)`;
  } else {
    genderResultText = `여성 관람객이 더 많습니다. (여성: ${genderResult.woman_pct}%, 남성: ${genderResult.man_pct}%)`;
  }

  // 연령대 분석 결과 추가
  if (ageResult.ageGroup === 'Y') {
    ageResultText = `젊은 관람객이 더 많이 왔습니다. (젊은 관람객들의 비율: ${ageResult.youngerTotal.toFixed(2)}%)`;
  } else {
    ageResultText = `나이 많은 관람객이 더 많습니다. (나이 많은 관람객 비율: ${ageResult.olderTotal.toFixed(2)}%)`;
  }

  // 관람객 증감 분석 결과 추가
  if (crowdResult.label === 'H') {
    crowdResultText = `지난 1주일 동안 관람객이 늘었습니다. (증가율: ${crowdResult.value.toFixed(2)}%)`;
  } else {
    crowdResultText = `지난 1주일 동안 관람객이 줄었습니다. (감소율: ${crowdResult.value.toFixed(2)}%)`;
  }

  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>결과 페이지</h2>
        </div>
        <div className={`${styles.graphContainer} ${styles.row1}`}>
          <Header>분석 결과</Header>
          <div className={styles.resultContainer}>
            <div className={styles.left}>
              <h3>
                {genderResult.gender} {ageResult.ageGroup} {crowdResult.label}
              </h3>
              <p>
                {genderResultText}
                <br />
                <br />
                {ageResultText}
                <br />
                <br />
                {crowdResultText}
              </p>
            </div>
            <div className={styles.right}>
              <ResultBarGender setGenderResult={setGenderResult} />
              <Result_Bar_Age setAgeResult={setAgeResult} />
              <Result_Bar_Crowd setCrowdResult={setCrowdResult} />
            </div>
          </div>
          <div className={styles.shiftDown}></div>
        </div>
      </div>
    </>
  );
};

export default ForthPage;
