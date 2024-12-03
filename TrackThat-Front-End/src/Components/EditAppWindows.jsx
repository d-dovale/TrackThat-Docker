import React, { useState } from "react";
import styles from "./EditAppWindows.module.css";
import images from "../images";
import { APPLICATIONSURL } from "../../constants";

function EditAppWindows({ show, onClose, onSuccessfulEdit, application }) {
  if (!show) return null; // Do not render the modal if 'show' is false

  const [company, setCompany] = useState(application.company);
  const [position, setPosition] = useState(application.position);
  const [date, setDate] = useState(application.date);
  const [season, setSeason] = useState(application.season);
  const [status, setStatus] = useState(application.status);

  const editApplicationRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Need to be logged in to edit.");
      return;
    }
    const res = await fetch(`${APPLICATIONSURL}/${application.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, position, season, status, date }),
    });
    if (res.status !== 201) {
      throw new Error(`Error, edit application unsuccessful ${res.status}`);
    }
    const data = await res.json();
    console.log("Edit Application: ", data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (company && position && date && season && status) {
      try {
        await editApplicationRequest();
        onSuccessfulEdit();
      } catch (e) {
        console.log(e);
        alert("Unsuccessful edit.");
      }
    } else {
      alert("Need to provide all required values to edit.");
    }
  };

  const deleteApplicationRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Need to be logged in to delete.");
      return;
    }
    const res = await fetch(`${APPLICATIONSURL}/${application.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status !== 200) {
      throw new Error(`Error, delete application unsuccessful ${res.status}`);
    }
    const data = await res.json();
    console.log("Delete Application: ", data);
  };

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      await deleteApplicationRequest();
      onSuccessfulEdit(true);
    } catch (e) {
      console.log(e);
      alert("Unsuccessful delete.");
    }
  };

  return (
    <div className={styles["edit-modal-backdrop"]}>
      <div className={styles.editModal}>
        {/* Modal Header */}
        <div className={styles["edit-modal-header"]}>
          <div className={styles["edit-modal-title"]}>
            <img src={images.Edit} alt="Edit" className={styles.editIcon} />
            <span>Edit Application</span>
          </div>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={styles["edit-modal-close-btn"]}
            aria-label="Close Edit Application Modal"
          >
            <img src={images.close} alt="Close" className={styles.editIcon} />
          </button>
        </div>

        {/* Modal Content */}
        <div className={styles["edit-modal-content"]}>
          <form onSubmit={onSubmit} className={styles["edit-form"]}>
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
                value={company}
                onChange={(e) => setCompany(e.target.value)}
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
                value={position}
                onChange={(e) => setPosition(e.target.value)}
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                required
                value={season}
                onChange={(e) => setSeason(e.target.value)}
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
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Interview">Interview</option>
                <option value="Rejected">Rejected</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
            {/* Action Buttons */}
            <div className={styles["edit-button-container"]}>
              <button type="submit" className={styles["edit-save-button"]}>
                Save
              </button>
              <button
                type="button"
                className={styles["edit-delete-button"]}
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAppWindows;
