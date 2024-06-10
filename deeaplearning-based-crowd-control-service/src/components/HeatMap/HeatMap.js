import React, { useEffect, useState, useRef } from "react";
import h337 from "heatmap.js";
import "./HeatMap.css";
import axios from "axios";
import { geoConicEquidistantRaw } from "d3";

const HeatMap = () => {
  const heatmapRef = useRef(null);
  const [exhibitionList, setExhibitionList] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [currentCapacity, setCurrentCapacity] = useState(0);
  const [heatmapData, setHeatmapData] = useState([]);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }
        const response = await axios.get(`http://localhost:4000/getexhb`, {
          params: { userId },
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // 데이터를 비동기로 가져오는 과정이 완료되면 useEffect가 실행됨
  }, []);

  useEffect(() => {
    // 데이터 배열이 비어 있는지 확인
    if (data.length === 0) {
      return; // 데이터가 없으면 아무것도 하지 않고 종료
    }

    const exhb1 = data[0]["exhb_id"];
    const exhb2 = data[1]["exhb_id"];
    const exhb3 = data[2]["exhb_id"];
    const exhb4 = data[3]["exhb_id"];

    const exhibitionList = [
      { id: exhb1, name: "전시관 A" },
      { id: exhb2, name: "전시관 B" },
      { id: exhb3, name: "전시관 C" },
      { id: exhb4, name: "전시관 D" },
    ];
    setExhibitionList(exhibitionList);
  }, [data]);

  useEffect(() => {
    if (selectedExhibition && heatmapRef.current) {
      const width = 1920;
      const height = 1080;

      const fetchData = async () => {
        try {
          // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
          const today = new Date().toISOString().slice(0, 10);
          // 예시로 전시관 A를 클릭했을 때 해당 전시관의 exhb_id를 가져오는 방식
          const exhbId = selectedExhibition.id; // 선택된 전시관의 exhb_id
          const userId = sessionStorage.getItem("userID");
          const response = await axios.get(`http://localhost:4000/heatmap`, {
            params: {
              userId,
              exhbId,
              time: `${today} ${selectedHour}:${selectedMinute}`,
            },
            withCredentials: true,
          });
          if (response.status === 200) {
            setData2(response.data);
            // setHeatmapData(data);
            // renderHeatmap(data); // 데이터를 가져온 후에 히트맵 렌더링
            const data = Array.from({ length: 300 }, () => ({
              x: Math.floor(Math.random() * width),
              y: Math.floor(Math.random() * height),
              value: Math.random(),
            }));
            setHeatmapData(data);
            if (heatmapInstance) {
              // heatmapInstance가 null이 아닌지 확인
              renderHeatmap(data); // 데이터를 가져온 후에 히트맵 렌더링
            }
          }
        } catch (error) {
          console.error("Error fetching heatmap data:", error);
        }
      };

      // 히트맵 인스턴스 생성
      const instance = h337.create({
        container: heatmapRef.current,
        radius: 20,
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.75,
      });
      setHeatmapInstance(instance);

      // 히트맵 렌더링 함수
      const renderHeatmap = (data) => {
        if (heatmapInstance) {
          // heatmapInstance가 null이 아닌지 확인
          const max = data.reduce(
            (prev, curr) => Math.max(prev, curr.value),
            0
          );
          const heatmapData = { max, data };
          heatmapInstance.setData(heatmapData);
        }
      };
      fetchData(); // 데이터 가져오기`
    }
  }, [selectedExhibition, selectedHour, selectedMinute]);

  useEffect(() => {
    if (data2.length === 0) {
      return; // 데이터가 없으면 아무것도 하지 않고 종료
    }

    const currentCapacity = data2[0]["total_population"];
    console.log(data2[0], "d2확인");
    setMaxCapacity(1000); //여기만 수정해주세요
    setCurrentCapacity(currentCapacity);
  }, [data2]);
  useEffect(() => {
    return () => {
      if (heatmapInstance && typeof heatmapInstance.destroy === "function") {
        heatmapInstance.destroy();
      }
    };
  }, [heatmapInstance]);

  const handleExhibitionChange = (event) => {
    const selectedExhibitionId = event.target.value;
    const selectedExhibition = exhibitionList.find(
      (exhibition) => exhibition.id === selectedExhibitionId
    );
    setSelectedExhibition(selectedExhibition);
  };

  const handleHourChange = (event) => {
    const hour = parseInt(event.target.value);
    setSelectedHour(hour);
  };

  const handleMinuteChange = (event) => {
    const minute = parseInt(event.target.value);
    setSelectedMinute(minute);
  };

  return (
    <div className="heatmap-container">
      <div>
        <label htmlFor="exhibition-select">전시관 선택:</label>
        <select id="exhibition-select" onChange={handleExhibitionChange}>
          <option value="">전시관 선택</option>
          {exhibitionList.map((exhibition) => (
            <option key={exhibition.id} value={exhibition.id}>
              {exhibition.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="hour-select">시간:</label>
        <select id="hour-select" onChange={handleHourChange}>
          {[...Array(9).keys()].map((hour) => (
            <option key={hour + 9} value={hour + 9}>
              {hour + 9}
            </option>
          ))}
        </select>
        <label htmlFor="minute-select">분:</label>
        <select id="minute-select" onChange={handleMinuteChange}>
          {[0, 10, 20, 30, 40, 50].map((minute) => (
            <option key={minute} value={minute}>
              {minute}
            </option>
          ))}
        </select>
      </div>

      {selectedExhibition && (
        <div>
          <p>
            최대 입장객 수: {maxCapacity}명 / 현재 입장객 수: {currentCapacity}
            명
          </p>
        </div>
      )}
      <div
        ref={heatmapRef}
        style={{
          backgroundImage: "url(/preview.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1920px 1080px",
          width: "1920px",
          height: "1080px",
        }}
      ></div>
    </div>
  );
};

export default HeatMap;
