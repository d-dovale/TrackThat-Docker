import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../images";
import Logo from "./logo";
import styles from './navbar.module.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.nav}>
        <button className={styles["nav-button1"]}>
          <img src={images.dashboardIcon} alt="Dashboard Icon" />
          Dashboard
        </button>
        <button className={styles["nav-button2"]} onClick={handleLoginClick}>
          <img src={images.login} alt="Log In Icon" />
          Sign In
        </button>
      </div>
    </header>
  );
}



export default Navbar;
