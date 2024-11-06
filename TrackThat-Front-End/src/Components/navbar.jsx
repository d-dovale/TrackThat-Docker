import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../images";
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={images.logo} alt="TrackThat Logo" className="logo" />
        <span className="site-title">trackthat</span>
      </div>
      <div className="nav">
        <button className="nav-button1">
          <img src={images.dashboardIcon} alt="Dashboard Icon" />
          Dashboard
        </button>
        <button className="nav-button2" onClick={handleLoginClick}>
          <img src={images.logInIcon} alt="Log In Icon" />
          Sign In
        </button>
      </div>
    </header>
  );
}

export default Navbar;