import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../images";
import Logo from "./logo";
import styles from './navbarLogin.module.css';

function NavbarLogin() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleDashboardClick = () => {
      navigate("/dashboard");
  }

  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.nav}>
        <button className={styles["nav-button1-login"]} onClick={handleDashboardClick}>
          <img src={images.dashboardIcon} alt="Dashboard Icon" />
          Dashboard
        </button>
        <button className={styles["logout-button"]} onClick={handleLoginClick}>
          <img src={images.Logout} alt="Log Out Icon" />
          Log out
        </button>
      </div>
    </header>
  );
}



export default NavbarLogin;
