import React from "react";
import styles from "./ApplicationEntry.module.css";
import images from "../images";
import EditButton from "./EditButton";

function ApplicationEntry({ application, onEditButtonClick }) {
  return (
    <div className={styles["application-container"]}>
      <div className={styles["company-icon"]}>
        <img src={images.Company2} />
      </div>
      <p>{application.company}</p>
      <p>{application.position}</p>
      <p>{application.status}</p>
      <p>{application.date}</p>
      <p>{application.season}</p>
      <div className={styles["edit-button-container"]}>
        <EditButton onClick={() => onEditButtonClick(application)} label="Edit Application" />
      </div>
    </div>
  );
}

export default ApplicationEntry;
