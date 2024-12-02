import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import images from "../images";
import Logo from "./logo";
import styles from "./navbar.module.css";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles["logo-container"]} onClick={handleLogoClick}>
        <Logo />
      </div>
      <div className={styles.nav}>
        <button
          className={styles["nav-button1"]}
          onClick={handleDashboardClick}
        >
          <img src={images.dashboardIcon} alt="Dashboard Icon" />
          Dashboard
        </button>
        {isLoggedIn ? (
          <button
            className={styles["logout-button"]}
            onClick={handleLogoutClick}
          >
            <img src={images.Logout} alt="Log Out Icon" />
            Log Out
          </button>
        ) : (
          <button className={styles["nav-button2"]} onClick={handleLoginClick}>
            <img src={images.login} alt="Log In Icon" />
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
