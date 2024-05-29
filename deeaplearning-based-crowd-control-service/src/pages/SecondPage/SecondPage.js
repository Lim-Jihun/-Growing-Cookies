import styles from "./SecondPage.module.css";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import GenderAgeBar_2nd from "../../components/GenderAgeBar_2nd/GenderAgeBar_2nd";


const SecondPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <GenderAgeBar_2nd />
      </div>
    </>
  );
};

export default SecondPage;
