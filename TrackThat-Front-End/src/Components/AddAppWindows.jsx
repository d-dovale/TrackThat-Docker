import React, { useState, useEffect } from "react";
import styles from "./AddAppWindows.module.css";
import images from "../images";
import { APPLICATIONSURL } from "../../constants";

function AddAppWindows({ show, onClose, onSuccessfulSubmit }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [date, setDate] = useState(null);
  const [season, setSeason] = useState("Summer");
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    console.log({ company, position, date, season, status });
  }, [company, position, date, season, status]);

  if (!show) return null;

  const addApplicationRequest = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // User not authenticated. Show toast and navigate to sign up.
      alert("Need to be logged in to post.");
    }
    const res = await fetch(APPLICATIONSURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ company, position, season, status, date, "link" : "", "description" : "" }),
    });
    if (res.status !== 201) {
      throw new Error(
        `User with credentials already exists, status ${res.status}`
      );
    }
    const data = await res.json();
    console.log(data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (company && position && date && season && season) {
      try {
        await addApplicationRequest();
        onSuccessfulSubmit();
      } catch (e) {
        alert("Unsuccesful add.");
      }
    } else {
      alert("Need to provide all required values to post.");
    }
  };

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles.modal}>
        <button onClick={onClose} className={styles["modal-close-btn"]}>
          <img src={images.close} alt="Close" className={styles.icon} />
        </button>
        <div className={styles["modal-header"]}>
          <img src={images.plusIcon} alt="Add" className={styles.icon} />
          <span>Add Application</span>
        </div>
        <form onSubmit={onSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="company">
              <img
                src={images.Company}
                alt="Company"
                className={styles["icon-small"]}
              />
              Company
            </label>
            <input
              id="company"
              name="company"
              required
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="position">
              <img
                src={images.Position}
                alt="Position"
                className={styles["icon-small"]}
              />
              Position
            </label>
            <input
              id="position"
              name="position"
              required
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="date">
              <img
                src={images.Calendar}
                alt="Date Applied"
                className={styles["icon-small"]}
              />
              Date Applied
            </label>
            <input
              id="date"
              type="date"
              name="date"
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="season">
              <img
                src={images.Season}
                alt="Season"
                className={styles["icon-small"]}
              />
              Season
            </label>
            <select
              id="season"
              name="season"
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
            </select>
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="status">
              <img
                src={images.Status}
                alt="Status"
                className={styles["icon-small"]}
              />
              Status
            </label>
            <select
              id="status"
              name="status"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className={styles["submit-btn"]}>
            ADD
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAppWindows;
