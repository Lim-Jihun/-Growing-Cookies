import Sidebar from "../../components/Sidebar/Sidebar.js";
import styles from "./ForthPage.module.css";

const ForthPage = () => {
  return (
    <>
      <Sidebar />
      <div className={styles.content}>ForthPage</div>
    </>
  );
};

export default ForthPage;
