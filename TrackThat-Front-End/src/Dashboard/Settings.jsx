import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Settings.module.css"; 



function Settings(){
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");


    return (
        <div className={styles["settings-main-container"]}>
            <div className={styles["settings-header-container"]}>
                <img src={images.settingsIcon} alt="Settings Icon" className={styles["settings-icon"]} />
                <h1 className={styles["settings-title"]}>Settings</h1>
            </div>
            <div className={styles["settings-top-section"]}>
                {/* Profile Picture Section */}
                <div className={styles["settings-profile-section"]}>
                    <h2 className={styles["settings-subtitle"]}>Profile Picture</h2>
                    <img src={images.userIcon} alt="User Avatar" className={styles["settings-user-avatar"]} />
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
                        />
                        <button className={styles["settings-submit-button2"]}>Update Goal</button>
                    </div>
                </div>
            </div>

            <div className={styles["settings-info-container"]}>
                <div className={styles["settings-account-info"]}>
                    <h2 className={styles["settings-subtitle"]}>Account Info</h2>
                    <form>
                        <label>Name</label>
                        <input className={styles["settings-input-field"]} type="text" value={name} onChange={e => setName(e.target.value)} />
                        <label>Email</label>
                        <input className={styles["settings-input-field"]} type="email" value={email} onChange={e => setEmail(e.target.value)} />
                        <label>Current Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <label>New Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <label>Confirm New Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <button className={styles["settings-submit-button"]}>Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
}




export default Settings;