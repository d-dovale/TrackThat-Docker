import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ApplicationEntry from "../Components/ApplicationEntry";
import AddAppWindows from "../Components/AddAppWindows";
import EditAppWindows from "../Components/EditAppWindows";
import images from "../images";
import styles from "./Dashboard.module.css";
import { APPLICATIONSURL } from "../../constants";

import ErrorToast from "../Components/ErrorToast";
import SuccessToast from "../Components/SuccessToast";

function Viewapp() {
  const navigate = useNavigate();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newAppAdded, setNewAppAdded] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [editApplication, setEditApplication] = useState(null);
  const [search, setSearch] = useState("");
  const [season, setSeason] = useState(0); // Ordering
  const [status, setStatus] = useState(0); // Ordering
  const [date, setDate] = useState(true); // Ordering

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAddApplicationClick = () => {
    setAddModalOpen(true);
  };
  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSubmitFormSuccess = () => {
    handleCloseAddModal();
    setShowErrorToast(false);
    setSuccessMessage("New Application Created.");
    setShowSuccessToast(true);
    setNewAppAdded(true);
  };

  const handleEditButtonClick = (application) => {
    setEditApplication(application);
    setEditModalOpen(true);
  };

  const handleSubmitEditFormSuccess = (deleted) => {
    if (deleted) {
      handleCloseEditModal();
      setErrorMessage(false);
      setSuccessMessage("Application Deleted");
      setShowSuccessToast(true);
      setNewAppAdded(true);
    } else {
      handleCloseEditModal();
      setErrorMessage(false);
      setSuccessMessage("Application Edited");
      setShowSuccessToast(true);
      setNewAppAdded(true);
    }
  };

  const filterBySearch = (search) => {
    const filtered = applications.filter(
      (app) => app.company.toUpperCase().search(search.toUpperCase()) !== -1
    );
    setFilteredApplications(filtered);
  };

  useEffect(() => {
    filterBySearch(search);
  }, [search, applications]);

  const sortByDate = (date) => {
    const sorted = [...applications].sort((a, b) => {
      // Convert the date strings to Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Sort in ascending order (earliest to latest)
      return date ? dateA - dateB : dateB - dateA;
    });

    setApplications(sorted);
  };

  useEffect(() => {
    sortByDate(date);
  }, [date]);

  const sortBySeason = (season) => {
    const seasonOrder = new Map([
      ["Summer", season % 4],
      ["Winter", (season + 1) % 4],
      ["Fall", (season + 2) % 4],
      ["Spring", (season + 3) % 4],
    ]);

    const sorted = [...applications].sort((a, b) => {
      return seasonOrder.get(a.season) - seasonOrder.get(b.season);
    });

    setApplications(sorted);
  };

  useEffect(() => {
    sortBySeason(season);
  }, [season]);

  const sortByStatus = (status) => {
    const statusOrder = new Map([
      ["Pending", status % 3],
      ["Interview", (status + 1) % 3],
      ["Rejected", (status + 2) % 3],
    ]);

    const sorted = [...applications].sort((a, b) => {
      return statusOrder.get(a.status) - statusOrder.get(b.status);
    });

    setApplications(sorted);
  };

  useEffect(() => {
    sortByStatus(status);
  }, [status]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (newAppAdded) {
      const fetchData = async () => {
        try {
          const res = await fetch(APPLICATIONSURL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.status == 401 && res.statusText == "Unauthorized") {
            navigate("/login");
            return;
          }
          const data = await res.json();
          setApplications(data);
        } catch (e) {
          setErrorMessage(e.message);
          setShowErrorToast(true);
          return;
        }
      };

      setNewAppAdded(false);
      // Call the async function
      fetchData();
    }
  }, [newAppAdded]);

  return (
    <div className={styles["viewapp-container"]}>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          <span></span>
          <p>COMPANY</p>
          <p>POSITION</p>
          <p onClick={() => setStatus((curr) => curr + 1)}>STATUS</p>
          <p onClick={() => setDate((curr) => !curr)}>DATE APPLIED</p>
          <p onClick={() => setSeason((curr) => curr + 1)}>SEASON</p>
          <span></span>
          {filteredApplications.map((app) => {
            return (
              <ApplicationEntry
                key={app.id}
                application={app}
                onEditButtonClick={handleEditButtonClick}
              />
            );
          })}
        </div>
      </div>

      <AddAppWindows
        show={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccessfulSubmit={handleSubmitFormSuccess}
      />

      <EditAppWindows
        show={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccessfulEdit={handleSubmitEditFormSuccess}
        application={editApplication}
      />
    </div>
  );
}

export default Viewapp;
