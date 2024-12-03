import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATCHUSERURL, SETGOALURL } from "../../constants";

import images from "../images";
import styles from "./Settings.module.css";

import ErrorToast from "../Components/ErrorToast";
import SuccessToast from "../Components/SuccessToast";

function Settings() {
  const navigate = useNavigate();

  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const goal = Number(localStorage.getItem("weekly_goal"));

    if (username && email && Number.isInteger(goal)) {
      setName(username);
      setEmail(email);
      if (!Number.isNaN(goal) && goal >= 0) {
        setWeeklyGoal(goal);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("weekly_goal");
      navigate("/login");
      return;
    }
  }, []);

  const setGoalRequest = async () => {
    const goal = Number(localStorage.getItem("weekly_goal"));
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (weeklyGoal < 0) {
      setErrorMessage("Goal cannot be negative.");
      setShowErrorToast(true);
      return;
    }

    if (weeklyGoal != goal && !Number.isNaN(goal)) {
      try {
        const res = await fetch(SETGOALURL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ weekly_goal: weeklyGoal }),
        });
        if (res.status !== 200) {
          setErrorMessage("Set Goal Unsuccesful");
          setShowErrorToast(true);
          return;
        }
        setShowErrorToast(false);
        setSuccessMessage("Weekly goal updated.");
        setShowSuccessToast(true);
        localStorage.setItem("weekly_goal", weeklyGoal);
      } catch (e) {
        setErrorMessage(e.message);
        setShowToast(true);
        return;
      }
    }
  };

  const patchUserRequest = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const body = {};

    let success = false;

    if (password.length < 5) {
      setErrorMessage("Password must be at least 5 characters long.");
      setShowToast(true);
      return;
    }

    body["password"] = password;

    if (name.length > 0) {
      const username = localStorage.getItem("username");
      if (name != username) {
        body["name"] = name;
        success = true;
      }
    }
    if (email.length > 0) {
      const localemail = localStorage.getItem("email");
      if (email != localemail) {
        body["email"] = email;
        success = true;
      }
    }
    if (newPassword.length > 0 && newPassword != confirmNewPassword) {
      setErrorMessage("Passwords do not match.");
      setShowToast(true);
      return;
    }
    if (newPassword.length > 0 && newPassword == confirmNewPassword) {
      body["new_password"] = newPassword;
      success = true;
    }
    if (!success) {
      return;
    }

    try {
      const res = await fetch(PATCHUSERURL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.status !== 200) {
        if (res.status == 409) {
          setErrorMessage("User with same email already exists.");
          setShowToast(true);
          return;
        }
        if (res.status == 400) {
          setErrorMessage("Passwords must be at least 5 characters in length.");
          setShowToast(true);
          return;
        }
        setErrorMessage("Password is incorrect.");
        setShowToast(true);
        return;
      }
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("username");
      localStorage.removeItem("weekly_goal");
      setShowErrorToast(false);
      setSuccessMessage("User updated.");
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e) {
      setErrorMessage(e.message);
      setShowToast(true);
      return;
    }
  };

  return (
    <div className={styles["settings-main-container"]}>
      <ErrorToast
        isVisible={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
      <div className={styles["settings-header-container"]}>
        <img
          src={images.settingsIcon}
          alt="Settings Icon"
          className={styles["settings-icon"]}
        />
        <h1 className={styles["settings-title"]}>Settings</h1>
      </div>
      <div className={styles["settings-top-section"]}>
        {/* Profile Picture Section */}
        <div className={styles["settings-profile-section"]}>
          <h2 className={styles["settings-subtitle"]}>Profile Picture</h2>
          <img
            src={images.userIcon}
            alt="User Avatar"
            className={styles["settings-user-avatar"]}
          />
          <div className={styles["settings-button-container"]}>
            <button className={styles["settings-upload-button"]}>
              <img src={images.Upload} alt="Upload Avatar" /> Upload Avatar
            </button>
            <button className={styles["settings-remove-button"]}>
              <img src={images.Delete} alt="Remove Avatar" /> Remove Avatar
            </button>
          </div>
        </div>

        {/* Goal Per Week Section */}
        <div className={styles["settings-goal-section"]}>
          <h2 className={styles["settings-subtitle"]}>Goal Per Week</h2>
          <div className={styles["settings-goal-content"]}>
            <label htmlFor="weekly-goal">Weekly Goal</label>
            <input
              id="weekly-goal"
              className={styles["settings-input-field"]}
              type="number"
              placeholder="Enter your weekly goal"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(e.target.value)}
            />
            <button
              className={styles["settings-submit-button2"]}
              onClick={setGoalRequest}
            >
              Update Goal
            </button>
          </div>
        </div>
      </div>

      <div className={styles["settings-info-container"]}>
        <div className={styles["settings-account-info"]}>
          <h2 className={styles["settings-subtitle"]}>Account Info</h2>
          <form>
            <label>Name</label>
            <input
              className={styles["settings-input-field"]}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Email</label>
            <input
              className={styles["settings-input-field"]}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Current Password</label>
            <input
              className={styles["settings-input-field"]}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>New Password</label>
            <input
              className={styles["settings-input-field"]}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm New Password</label>
            <input
              className={styles["settings-input-field"]}
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              className={styles["settings-submit-button"]}
              onClick={patchUserRequest}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
