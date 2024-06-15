import React, { useEffect, useState, useRef } from "react";
import h337 from "heatmap.js";
import "./HeatMap.css";
import axios from "axios";

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
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // 데이터를 비동기로 가져오는 과정이 완료되면 useEffect가 실행됨
  }, []);

  useEffect(() => {
    if (data.length === 0) {
      return;
    }

    const exhb1 = data[0]["exhb_id"];
    const exhb2 = data[1]["exhb_id"];
    const exhb3 = data[2]["exhb_id"];
    const exhb4 = data[3]["exhb_id"];

    const exhibitionList = [
      { id: exhb1, name: "제1전시관" },
      { id: exhb2, name: "제2전시관" },
      { id: exhb3, name: "제3전시관" },
      { id: exhb4, name: "제4전시관" },
    ];
    setExhibitionList(exhibitionList);
    setSelectedExhibition(exhibitionList[0]); // 첫 번째 전시관을 기본 선택
  }, [data]);

  useEffect(() => {
    if (selectedExhibition && heatmapRef.current) {
      const width = "1200"; // 화면 가로 길이
      const height = "700"; // 화면 세로 길이

      const fetchData = async () => {
        try {
          const today = new Date().toISOString().slice(0, 10);
          const exhbId = selectedExhibition.id;
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
            const data = Array.from({ length: 300 }, () => ({
              x: Math.floor(Math.random() * width),
              y: Math.floor(Math.random() * height),
              value: Math.random(),
            }));
            setHeatmapData(data);
            renderHeatmap(data);
          }
        } catch (error) {
          console.error("Error fetching heatmap data:", error);
        }
      };

      const instance = h337.create({
        container: heatmapRef.current,
        radius: 20,
        maxOpacity: 0.8,
        minOpacity: 0.1,
        blur: 0.75,
      });
      setHeatmapInstance(instance);

      const renderHeatmap = (data) => {
        if (heatmapInstance) {
          heatmapInstance.removeData(); // 이전 데이터 제거
          const max = data.reduce(
            (prev, curr) => Math.max(prev, curr.value),
            0
          );
          const heatmapData = { max, data };
          heatmapInstance.setData(heatmapData);
        }
      };

      fetchData();
    }
  }, [selectedExhibition, selectedHour, selectedMinute]);

  useEffect(() => {
    if (data2.length === 0) {
      return;
    }

    const currentCapacity = data2[0]["total_population"];
    setMaxCapacity(1000);
    setCurrentCapacity(currentCapacity);
  }, [data2]);

  useEffect(() => {
    return () => {
      if (heatmapInstance && typeof heatmapInstance.destroy === "function") {
        setHeatmapInstance(null);
      }
    };
  }, [heatmapInstance]);

  const handleExhibitionChange = (event) => {
    const selectedExhibitionId = event.target.value;
    const selectedExhibition = exhibitionList.find(
      (exhibition) => exhibition.id === selectedExhibitionId
    );
    setSelectedExhibition(selectedExhibition);
    console.log("removeData");
    heatmapInstance.removeData(); // 이전 데이터 제거
    setHeatmapInstance(null);
    heatmapInstance.setData(heatmapData);
  };

  const handleHourChange = (event) => {
    const hour = parseInt(event.target.value);
    setSelectedHour(hour);
    setHeatmapInstance(null);
    heatmapInstance.setData(heatmapData);
  };

  const handleMinuteChange = (event) => {
    const minute = parseInt(event.target.value);
    setSelectedMinute(minute);
    setHeatmapInstance(null);
    heatmapInstance.setData(heatmapData);
  };

  return (
    <div className="heatmap-container">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginLeft: "180px", marginTop: "50px" }}>
          <select id="exhibition-select" onChange={handleExhibitionChange}>
            {exhibitionList.map((exhibition) => (
              <option key={exhibition.id} value={exhibition.id}>
                {exhibition.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: "50px", marginLeft: "30px" }}>
          <label
            htmlFor="hour-select"
            style={{
              fontFamily: "Pretendard",
              fontWeight: "regular",
              fontSize: "16px",
            }}
          >
            시간:
          </label>
          <select
            id="hour-select"
            style={{ height: "36px", marginLeft: "10px" }}
            onChange={handleHourChange}
          >
            {[...Array(9).keys()].map((hour) => (
              <option key={hour + 9} value={hour + 9}>
                {hour + 9}
              </option>
            ))}
          </select>
          <label
            htmlFor="minute-select"
            style={{
              marginLeft: "30px",
              fontFamily: "Pretendard",
              fontWeight: "regular",
              fontSize: "16px",
            }}
          >
            분:
          </label>
          <select
            id="minute-select"
            style={{ height: "36px", marginLeft: "10px" }}
            onChange={handleMinuteChange}
          >
            {[0, 10, 20, 30, 40, 50].map((minute) => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedExhibition && (
        <div>
          <p
            style={{
              marginLeft: "180px",
              fontFamily: "Pretendard",
              fontWeight: "regular",
              fontSize: "14.5px",
            }}
          >
            최대 입장객 수: {maxCapacity}명 / 현재 입장객 수: {currentCapacity}
            명
          </p>
        </div>
      )}

      <div className="heatmapcon">
        <div
          ref={heatmapRef}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: "url(/canvas.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1280px 720px",
            width: "1280px",
            height: "720px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default HeatMap;
