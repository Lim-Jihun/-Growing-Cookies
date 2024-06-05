import React, { useState } from 'react';
import './DatePicker.css';

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  // 월별 날짜 수 계산
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  // 현재 날짜 가져오기
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  };

  // 날짜 형식 변환
  const formatDate = (date) => {
    if (!date) return ''; // date가 undefined일 경우 빈 문자열 반환
    const [year, month, day] = date.split('-');
    return `${year}-${month.padStart(2, '0')}-${day ? day.padStart(2, '0') : ''}`;
  };

  // 선택된 년도와 월 가져오기
  const getSelectedYearAndMonth = () => {
    const currentDate = selectedDate || getCurrentDate();
    const [year, month] = currentDate.split('-');
    return { year: parseInt(year), month: parseInt(month) };
  };

  const { year, month } = getSelectedYearAndMonth();
  const daysInMonth = getDaysInMonth(year, month);

  return (
    <div className="date-picker">
      <input
        type="text"
        value={selectedDate || formatDate(getCurrentDate())}
        onFocus={() => setCalendarVisible(true)}
        readOnly
      />
      {calendarVisible && (
        <div className="calendar">
          <div className="header">
            {year}-{String(month).padStart(2, '0')}
          </div>
          <div className="days">
            {[...Array(daysInMonth).keys()].map((day) => (
              <div
                key={day + 1}
                className="day"
                onClick={() => handleDateSelect(`${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`)}
              >
                {day + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;