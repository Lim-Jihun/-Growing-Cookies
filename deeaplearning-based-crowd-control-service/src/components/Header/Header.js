import React from "react";
import styles from "./Header.module.css";

const Header = (props) => {
  return <h1 className={styles.subject}>{props.children}</h1>;
};

export default Header;
