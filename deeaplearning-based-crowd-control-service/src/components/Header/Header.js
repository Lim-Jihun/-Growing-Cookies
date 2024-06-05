import React from "react";
import styles from "./Header.module.css";

const Header = (props) => {
  const { paddingRight = "0px", style } = props;
  const headerStyle = {
    paddingRight: paddingRight,
    ...style
  };
  return <h1 className={styles.subject} style={headerStyle} >{props.children} </h1>;
};

export default Header;
