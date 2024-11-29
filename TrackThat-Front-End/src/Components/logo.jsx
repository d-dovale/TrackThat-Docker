import React from 'react';
import styles from './logo.module.css';
import images from "../images";

function Logo() {
  return (
    <div className={styles["logo-container"]}>
      <img src={images.logo} alt="TrackThat Logo" className={styles.logo} />
      <span className={styles["site-title"]}>TrackThat</span>
    </div>
  );
}

export default Logo;
