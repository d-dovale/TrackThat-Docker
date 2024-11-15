import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import AddAppWindows from "../Components/AddAppWindows"; // Import the component, not the CSS file
import images from "../images";
import styles from "./Dashboard.module.css";

function Viewapp() {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddApplicationClick = () => {
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSubmitForm = (event) => {
        event.preventDefault();
        console.log("Form data submitted");
        handleCloseModal();
    };

    return (
        <div className={styles["viewapp-container"]}>
            <div className={styles["viewapp-buttons"]}>
                <div className={styles["search-bar"]}>
                    <img src={images.searchIcon} alt="Search Icon" className={styles["search-icon"]} />
                    <input
                        type="text"
                        placeholder="Search"
                        className={styles["search-input"]}
                        onChange={(e) => console.log('Searching for:', e.target.value)}
                    />
                </div>
                <button className={styles["add-button"]} onClick={handleAddApplicationClick}>
                    <img src={images.plusIcon} alt="Add Icon" className={styles["add-app-icon"]} />
                    Add Application
                </button>
            </div>
            <AddAppWindows show={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitForm} />
        </div>
    );
}

export default Viewapp;
