import React from 'react';
import './logo.css';
import images from "../images";

function Logo() {
  return (
    <div className="logo-container">
      <img src={images.logo} alt="TrackThat Logo" className="logo" />
      <span className="site-title">trackthat</span>
    </div>
  );
}

export default Logo;