import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PATCHUSERURL, SETGOALURL } from "../../constants";

import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Settings.module.css";

function Settings() {
  const navigate = useNavigate();

  const [weeklyGoal, setWeeklyGoal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const goal = Number(localStorage.getItem("weekly_goal"));

    if (username && email && Number.isInteger(goal)) {
      setName(username);
      setEmail(email);
      if (!Number.isNaN(goal)) {
        setWeeklyGoal(goal);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("weekly_goal");
      navigate("/login");
    }
  }, []);

  const setGoalRequest = async () => {
    const goal = localStorage.getItem("weekly_goal");
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Need to be logged in to view this page.");
      navigate("/login");
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
          throw new Error(`Set Goal Unsuccessful.`);
        }
        localStorage.setItem("weekly_goal", weeklyGoal);
      } catch (e) {
        alert(`Failed: ${e.message}`);
      }
    }
  };

  const patchUserRequest = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Need to be logged in to view this page.");
      navigate("/login");
      return;
    }

    const body = {};

    let success = false;

    if (password.length < 5) {
      alert("Must enter password to perform any changes to user data.");
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
      alert("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length > 0 && newPassword == confirmNewPassword) {
      body["new_password"] = newPassword;
      success = true;
    }
    if (!success) {
      return; // No op, no body to be changed.
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
          throw new Error(
            `Patch Unsuccessful: User with same email already exists. Status ${res.status}`
          );
        }
        if (res.status == 400) {
          throw new Error(
            `Patch Unsuccessful: Passwords must be at least 5 characters in length. Status ${res.status}`
          );
        }
        throw new Error(
          `Patch Unsuccessful: Password is incorrect. Status ${res.status}`
        );
      }
      const data = await res.json();
      localStorage.removeItem("token")
      localStorage.removeItem("email")
      localStorage.removeItem("username")
      localStorage.removeItem("weekly_goal")
      navigate("/login");
    } catch (e) {
      alert(`Failed: ${e.message}`);
    }
  };

  return (
    <div className={styles["settings-main-container"]}>
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
