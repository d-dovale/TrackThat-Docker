import React from "react";
import { useNavigate } from "react-router-dom";
import './LandingStyles.css';
import Navbar from "../Components/navbar";
import images from "../images";

function LandingPage() {
  const navigate = useNavigate();  // Hook for navigation

  const handleTryNowClick = () => {
    navigate("/register");  // Navigate to Register page on button click
  };
  const handleLoginClick = () => {
    navigate("/login");  // Navigate to Login page on button click
  };

  return (
    <div className="landing-page">
      <Navbar/>
      <div className="content-container">
        <h1 className="main-title">Track Your Path to Success</h1>
        <p className="subtitle">Stay on top of your job applications with TrackThat, the ultimate tool for organizing and tracking your job search progress.</p>
        <button className="try-now-button" onClick={handleTryNowClick}>Try Now</button>
      </div>

      <div className="icon-container mt-20 grid grid-cols-3 md:grid-cols-6 gap-10 justify-items-center">
        <img
          src={images.googleIcon}
          alt="Google Icon"
          className="icon"
        />
        <img
          src={images.chatGPTIcon}
          alt="ChatGPT Icon"
          className="icon"
        />
        <img
          src={images.youtubeIcon}
          alt="YouTube Icon"
          className="icon"
        />
        <img
          src={images.instagramIcon}
          alt="Instagram Icon"
          className="icon"
        />
        <img
          src={images.twitterIcon}
          alt="Twitter Icon"
          className="icon"
        />
        <img
          src={images.facebookIcon}
          alt="Facebook Icon"
          className="icon"
        />
      </div>
    </div>
  );
}


export default LandingPage;
