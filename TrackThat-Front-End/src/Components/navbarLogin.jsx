import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../images";
import Logo from "./logo";
import styles from './navbarLogin.module.css';

function NavbarLogin() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    navigate("/login");
  };

  const handleDashboardClick = () => {
      navigate("/dashboard");
  }

  const handleLogoClick = () => {
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles["logo-container"]} onClick={handleLogoClick}>
        <Logo />
      </div>
      <div className={styles.nav}>
        <button className={styles["nav-button1-login"]} onClick={handleDashboardClick}>
          <img src={images.dashboardIcon} alt="Dashboard Icon" />
          Dashboard
        </button>
        <button className={styles["logout-button"]} onClick={handleLogoutClick}>
          <img src={images.Logout} alt="Log Out Icon" />
          Log Out
        </button>
      </div>
    </header>
  );
}



export default NavbarLogin;
