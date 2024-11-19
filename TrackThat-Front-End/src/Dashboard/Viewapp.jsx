import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import AddAppWindows from "../Components/AddAppWindows"; // Import the component, not the CSS file
import images from "../images";
import styles from "./Dashboard.module.css";
import { APPLICATIONSURL } from "../../constants";

function Viewapp() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAppAdded, setNewAppAdded] = useState(true);
  const [applications, setApplications] = useState([]);

  const handleAddApplicationClick = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleSubmitForm = () => {
    handleCloseModal();
    setNewAppAdded(true);
  };

  useEffect(() => {
    console.log("Effect")
    if (newAppAdded) {
      const token = localStorage.getItem("token");

      if (!token) {
        // User not authenticated. Show toast and navigate to sign up.
        alert("Need to be logged in to post.");
      }

      const fetchData = async () => {
        try {
          const res = await fetch(APPLICATIONSURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          console.log(data);
          setApplications(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      setNewAppAdded((curr) => !curr);
      // Call the async function
      fetchData();
    }
  }, [newAppAdded]);

  return (
    <div className={styles["viewapp-container"]}>
      <div className={styles["viewapp-buttons"]}>
        <div className={styles["search-bar"]}>
          <img
            src={images.searchIcon}
            alt="Search Icon"
            className={styles["search-icon"]}
          />
          <input
            type="text"
            placeholder="Search"
            className={styles["search-input"]}
            onChange={(e) => console.log("Searching for:", e.target.value)}
          />
        </div>
        <button
          className={styles["add-button"]}
          onClick={handleAddApplicationClick}
        >
          <img
            src={images.plusIcon}
            alt="Add Icon"
            className={styles["add-app-icon"]}
          />
          Add Application
        </button>
      </div>
      <AddAppWindows
        show={isModalOpen}
        onClose={handleCloseModal}
        onSuccessfulSubmit={handleSubmitForm}
      />
    </div>
  );
}

export default Viewapp;
