import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import ApplicationEntry from "../Components/ApplicationEntry";
import AddAppWindows from "../Components/AddAppWindows";
import EditAppWindows from "../Components/EditAppWindows";
import EditButton from "../Components/EditButton";
import images from "../images";
import styles from "./Dashboard.module.css";
import { APPLICATIONSURL } from "../../constants";

function Viewapp() {
  const navigate = useNavigate();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newAppAdded, setNewAppAdded] = useState(true);
  const [applications, setApplications] = useState([]);
  const [editApplication, setEditApplication] = useState(null);

  const handleAddApplicationClick = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSubmitForm = () => {
    handleCloseAddModal();
    setNewAppAdded(true);
  };

  const handleEditButtonClick = (application) => {
    setEditApplication(application)
    setEditModalOpen(true);
  };

  const handleSubmitEditForm = () => {
    handleCloseEditModal();
    setNewAppAdded(true);
  };

  const onEdit = (app) => {};

  useEffect(() => {
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
          if (res.status == 401 && res.statusText == "Unauthorized") {
            localStorage.removeItem("token");
            navigate("/login");
          }
          const data = await res.json();
          console.log("User's Applications: ", data);
          setApplications(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      setNewAppAdded(false);
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

        {/* testing right now */}
        {/* <EditButton onClick={handleEditButtonClick} label="Edit Application" /> */}

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
      <div className={styles["viewapp-table-container"]}>
        <div className={styles["viewapp-table-lines"]}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={styles["viewapp-table"]}>
          <span></span>{" "}
          {/* Here goes the logo of the company, can add filler. */}
          <p>Company</p>
          <p>Position</p>
          <p>Status</p>
          <p>Date Applied</p>
          <p>Season</p>
          <span></span>
          {applications.map((app) => {
            return <ApplicationEntry key={app.id} application={app} onEditButtonClick={handleEditButtonClick} onEdit={onEdit} />;
          })}
        </div>
      </div>

      <AddAppWindows
        show={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccessfulSubmit={handleSubmitForm}
      />

      <EditAppWindows show={isEditModalOpen} onClose={handleCloseEditModal} onSuccessfulEdit={handleSubmitEditForm} application={editApplication} />
    </div>
  );
}

export default Viewapp;
