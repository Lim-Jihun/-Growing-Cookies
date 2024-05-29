import Sidebar from "../../components/Sidebar/Sidebar.js";
import RiskList_2nd from "../../components/RiskList_2nd/RiskList_2nd";
import StayCrowdTime_2nd from "../../components/StayCrowdTime_2nd/StayCrowdTime_2nd.js"
import styles from "./FifthPage.module.css";

const FifthPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <StayCrowdTime_2nd />
        </div>
    </>
  );
};

export default FifthPage;
