import React from "react";
import styles from "./EditButton.module.css";
import images from "../images";



function EditButton({ onClick, label = "Edit", className = "" }) {
    return (
      <button 
        onClick={onClick} 
        className={`${styles["edit-button"]} ${className}`}
      >
        <img src={images.Edit} alt="" className={styles["edit-icon"]} />
      </button>
    );
  }
  
  export default EditButton;