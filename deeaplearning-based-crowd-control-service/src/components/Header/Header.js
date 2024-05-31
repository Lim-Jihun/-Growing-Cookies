import React from "react";
import styles from "./Header.module.css";

const Header = (props) => {
  return <div className={styles.subject}>{props.children}</div>;
};

export default Header;
