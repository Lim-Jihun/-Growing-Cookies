import React from 'react'
import { useState, useRef,useEffect } from 'react';
import LineGraph from '../LineGraph_2nd/LineGraph_2nd';
import Header from '../Header/Header';
import Dropdown from '../Dropdown/Dropdown';
import DatePicker from '../DatePicker/DatePicker';
import styles from "./DateandLineGraph_2nd.module.css";

const DateandLineGraph_2nd = () => {

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    

    

    

    // const [selectedData, setSelectedData] = React.useState([]);
  const [visibilityState, setVisibilityState] = React.useState(false);
  const pageRef = useRef(null);

  const handleDropdownClose = () => {
    setVisibilityState(false);
  };

  const handlePageClick = (e) => {
    if (pageRef.current && !pageRef.current.contains(e.target)) {
      setVisibilityState(false);
    }
  };

  const handleDropdownItemClick = (item) => {
    console.log('Selected item:', item);
  };

  const DropDownButton = () => {
    const [dropdownVisibility, setDropdownVisibility] = React.useState(false);

    return (
      <div className={styles.dropdownContainer}>
        <button
          className={styles.dropdownButton}
          onClick={() => setDropdownVisibility(!dropdownVisibility)}
        >
          전시관 선택
        </button>
        <Dropdown
          visibility={dropdownVisibility}
          onClose={handleDropdownClose}
          onItemSelect={handleDropdownItemClick}
        >
          <ul>
            <li>제1전시관</li>
            <li>제2전시관</li>
            <li>제3전시관</li>
            <li>제4전시관</li>
          </ul>
        </Dropdown>
      </div>
    );
  };

    return (
        <div>
            <div id={styles.title}>
                <h2>그래프 페이지</h2><DropDownButton /><DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
            <div className={`${styles.graphContainer} ${styles.row1}`}>
                <Header>평균 관람객 추이</Header>
                <LineGraph selectedDate={selectedDate}/>
            </div>
        </div>
    )
}

export default DateandLineGraph_2nd;