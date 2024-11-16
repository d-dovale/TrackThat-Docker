import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Settings.module.css"; 



function Settings(){
    const navigate = useNavigate();


    return (
        <div className={styles["settings-main-container"]}>
            <div className={styles["settings-header-container"]}>
                <img src={images.settingsIcon} alt="Settings Icon" className={styles["settings-icon"]} />
                <h1 className={styles["settings-title"]}>Settings</h1>
            </div>
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
            <div className={styles["settings-info-container"]}>
                <div className={styles["settings-account-info"]}>
                    <h2 className={styles["settings-subtitle"]}>Account Info</h2>
                    <form>
                        <label>Name</label>
                        <input className={styles["settings-input-field"]} type="text" value="John Doe" readOnly />
                        <label>Email</label>
                        <input className={styles["settings-input-field"]} type="email" value="johndoe@gmail.com" readOnly />
                        <label>Current Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <label>New Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <label>Confirm New Password</label>
                        <input className={styles["settings-input-field"]} type="password" />
                        <button className={styles["settings-submit-button"]}>Update</button>
                    </form>
                </div>
                <div className={styles["settings-preferences"]}>
                    <h2 className={styles["settings-subtitle"]}>Preferences</h2>
                    <label>Career Stage</label>
                    <input className={styles["settings-input-field"]} />
                    <label>Preferred Job Type</label>
                    <input className={styles["settings-input-field"]} />
                    <label>Location Preferences</label>
                    <input className={styles["settings-input-field"]} />
                    <label>Fields of Interest</label>
                    <input className={styles["settings-input-field"]} />
                    <label>Skills/Technologies</label>
                    <input className={styles["settings-input-field"]} />
                    <button className={styles["settings-submit-button"]}>Update</button>
                </div>
            </div>
        </div>
    );
}




export default Settings;