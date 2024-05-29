import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ThirdPage.module.css";
import LineGraph_2nd from "../../components/LineGraph_2nd/LineGraph_2nd";

const ThirdPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>
        <LineGraph_2nd />
      </div>
    </>
  );
};

export default ThirdPage;
