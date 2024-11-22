import React, { useState, useEffect } from "react";
import styles from "./EditAppWindows.module.css";
import images from "../images";
import { APPLICATIONSURL } from "../../constants";

function EditAppWindows({ show, onClose }) {
  if (!show) return null; // Do not render the modal if 'show' is false

  return (
    <div className={styles["edit-modal-backdrop"]}>
      <div className={styles.editModal}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={styles["edit-modal-close-btn"]}
          aria-label="Close Edit Application Modal"
        >
          <img src={images.close} alt="Close" className={styles.editIcon} />
        </button>

        <div className={styles["edit-modal-header"]}>
          <img src={images.Edit} alt="Edit" className={styles.editIcon} />
          <span>Edit Application</span>
        </div>

        <form className={styles["edit-form"]}>
          <div className={styles["edit-form-group"]}>
            <label htmlFor="edit-company">
              <img
                src={images.Company}
                alt="Company"
                className={styles["edit-icon-small"]}
              />
              Company
            </label>
            <input
              id="edit-company"
              name="company"
              required
              placeholder="Company Name"
            />
          </div>
          <div className={styles["edit-form-group"]}>
            <label htmlFor="edit-position">
              <img
                src={images.Position}
                alt="Position"
                className={styles["edit-icon-small"]}
              />
              Position
            </label>
            <input
              id="edit-position"
              name="position"
              required
              placeholder="Job Position"
            />
          </div>
          <div className={styles["edit-form-group"]}>
            <label htmlFor="edit-date">
              <img
                src={images.Calendar}
                alt="Date Applied"
                className={styles["edit-icon-small"]}
              />
              Date Applied
            </label>
            <input
              id="edit-date"
              type="date"
              name="date"
              required
            />
          </div>
          <div className={styles["edit-form-group"]}>
            <label htmlFor="edit-season">
              <img
                src={images.Season}
                alt="Season"
                className={styles["edit-icon-small"]}
              />
              Season
            </label>
            <select
              id="edit-season"
              name="season"
              defaultValue="Summer"
            >
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
            </select>
          </div>
          <div className={styles["edit-form-group"]}>
            <label htmlFor="edit-status">
              <img
                src={images.Status}
                alt="Status"
                className={styles["edit-icon-small"]}
              />
              Status
            </label>
            <select
              id="edit-status"
              name="status"
              defaultValue="Pending"
            >
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          {/* Action Buttons */}
          <div className={styles["edit-button-container"]}>
            <button type="button" className={styles["edit-save-button"]}>
              Save
            </button>
            <button type="button" className={styles["edit-delete-button"]}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAppWindows;