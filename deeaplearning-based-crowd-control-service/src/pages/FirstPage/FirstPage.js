import React, { useState, useEffect } from "react";

import styles from "./FirstPage.module.css";

import { ToastContainer, toast } from "react-toastify";
import WeeklyVisitorTrend from "../../components/WeeklyVisitorTrend/WeeklyVisitorTrend.js";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.js";
import LinePlot from "../../components/LineChart/LineChart.js";
import Header from "../../components/Header/Header.js";
import axios from "axios";

const FirstPage = () => {
  const [d1Data, setD1Data] = useState([]);
  const [d2Data, setD2Data] = useState([]);
  const [d3Data, setD3Data] = useState([]);
  const [d4Data, setD4Data] = useState([]);
  const [db1yData, setDb1yData] = useState([]);
  const [db2yData, setDb2yData] = useState([]);
  const [db3yData, setDb3yData] = useState([]);
  const [db4yData, setDb4yData] = useState([]);
  const [db1wData, setDb1wData] = useState([]);
  const [db2wData, setDb2wData] = useState([]);
  const [db3wData, setDb3wData] = useState([]);
  const [db4wData, setDb4wData] = useState([]);
  const [db1mData, setDb1mData] = useState([]);
  const [db2mData, setDb2mData] = useState([]);
  const [db3mData, setDb3mData] = useState([]);
  const [db4mData, setDb4mData] = useState([]);
  const [slineData, setSLineData] = useState([]);
  const [slineData2, setSLineData2] = useState([]);
  const [blineDataf, setBLineData] = useState([]);
  const [twvisitor, setTwvisitor] = useState(0);
  const [lwvisitor, setLwvisitor] = useState(0);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("userID");
        console.log("fpUserId",userId)
        if (!userId) {
          console.error("세션에서 userID를 가져올 수 없습니다.");
          return;
        }

        // 도넛차트 요청
        const response = await axios.get(`http://localhost:4000/donutchart`, {
          params: { userId }, // userId 전달
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("도넛데이터",response.data);
          
        }
        
        // 도넛차트 데이터 설정하기
        // if (response.data.length >= 4) {
          setD1Data(response.data[0].total_population);
          setD2Data(response.data[1].total_population);
          setD3Data(response.data[2].total_population);
          setD4Data(response.data[2].total_population);
          
          
          
          //도넛 아래 데이터 요청
          const sameResponse = await axios.get(`http://localhost:4000/sametime`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (sameResponse.status === 200) {
          console.log("도넛아래데이터",sameResponse.data);
        }

        // 도넛 아래 데이터 전달
        setDb1yData(parseInt(sameResponse.data[0].yesterday_avg_population))
        setDb1wData(parseInt(sameResponse.data[0].last_week_avg_population))
        setDb1mData(parseInt(sameResponse.data[0].last_month_avg_population))

        setDb2yData(parseInt(sameResponse.data[1].yesterday_avg_population))
        setDb2wData(parseInt(sameResponse.data[1].last_week_avg_population))
        setDb2mData(parseInt(sameResponse.data[1].last_month_avg_population))

        setDb3yData(parseInt(sameResponse.data[2].yesterday_avg_population))
        setDb3wData(parseInt(sameResponse.data[2].last_week_avg_population))
        setDb3mData(parseInt(sameResponse.data[2].last_month_avg_population))

        setDb4yData(parseInt(sameResponse.data[3].yesterday_avg_population))
        setDb4wData(parseInt(sameResponse.data[3].last_week_avg_population))
        setDb4mData(parseInt(sameResponse.data[3].last_month_avg_population))


        // 큰 라인그래프 데이터 요청
        const btResponse = await axios.get(`http://localhost:4000/bytime`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (btResponse.status === 200) {
          console.log("시간별인원데이터",btResponse.data);
        }

        

        // 큰 라인그래프 데이터 전달
      const blineDatat = btResponse.data.map((item, index) => ({
        hour: 9 + index,
        today: parseInt(item.total_population),
      }));
      setBLineData(blineDatat);


      
      
        

        



        const weekResponse = await axios.get(`http://localhost:4000/weekavg`, {
          params: { userId }, // 쿼리스트링으로 userId 전달
          withCredentials: true,
        });

        if (weekResponse.status === 200) {
          console.log("주간평균데이터",weekResponse.data);
        }


      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
      

    };

    fetchData();
  }, []);


  useEffect(() => {
    
    // 데이터를 비동기적으로 가져오거나 초기화할 수 있습니다.
    const fetchData = async () => {
      try {
      // 데이터 가져오기 로직 (예: API 호출)
      
      

      // 두 번째 데이터 가져오기 로직
      const data2 = [
        { hour: 9, today: 349},
        { hour: 10, today: 120},
        { hour: 11, today: 164},
        { hour: 12, today: 125},
        { hour: 13, today: 253},
        { hour: 14, today: 144},
        { hour: 15, today: 157},
        { hour: 16, today: 129},
        { hour: 17, today: 160},
        { hour: 18, today: 124},
        
      ];
      setSLineData2(data2);

      // twvisitor와 lwvisitor 계산 로직 추가
      const twvisitor = 222;
      const lwvisitor = 333;

      setTwvisitor(twvisitor);
      setLwvisitor(lwvisitor);

    
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data!");
    }
  };
    fetchData();
  }, []);
    

  const notify = () =>
    toast.error("토스트 내용!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  return (
    <>
      <div className={styles.content}>
        <div id={styles.title}>
          <h2>메인페이지</h2>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div className={styles.gridcontent}>
              <Header> 실시간 밀집도</Header>
              <div className={styles.griditem}>
                <DoughnutChart color="#10A400" doughnutdata={d1Data} yesterday={db1yData} week={db1wData} month={db1mData} />
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FFC300" doughnutdata={d2Data} yesterday={db2yData} week={db2wData} month={db2mData}/>
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FF6B00" doughnutdata={d3Data} yesterday={db3yData} week={db3wData} month={db3mData}/>
              </div>
              <div className={styles.griditem}>
                <DoughnutChart color="#FF0000" doughnutdata={d4Data} yesterday={db4yData} week={db4wData} month={db4mData}/>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.SecondRaw}>
            <div className={styles.half}>
              <Header>일주일 추이</Header>
              <div className={styles.WeekOrNowCol}>
                <WeeklyVisitorTrend
                  data1={slineData}
                  data2={slineData2}
                  width={350}
                  height={120}
                  color1="#10A400"
                  color2="#FF0000"
                  useAxis={false}
                  useDp={false}
                  useCurve={true}
                  twvisitor={twvisitor}
                  lwvisitor={lwvisitor}
                />
              </div>
            </div>
            <div className={styles.half}>
              <Header>일일 추이</Header>
              <LinePlot
                data={blineDataf}
                width={800}
                height={350}
                color="#3498DB"
                useAxis={true}
                useDp={true}
                useCurve={false}
              />
            </div>
          </div>
        </div>

        <button onClick={notify}>토스트 알림 보이기</button>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </>
  );
};

export default FirstPage;
