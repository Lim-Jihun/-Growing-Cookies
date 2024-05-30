import styles from "./SecondPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.js";
// import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";
import DangerPlaceBar_2nd from "../../components/DangerPlaceBar_2nd/DangerPlaceBar_2nd.js";

const SecondPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <DangerPlaceBar_2nd />
      </div>
    </>
  );
};

export default SecondPage;
