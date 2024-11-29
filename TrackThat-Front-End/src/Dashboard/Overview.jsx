import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { APPLICATIONSURL } from "../../constants";
import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Overview.module.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

function Overview() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    interview: 0,
    rejected: 0,
  });
  const [recentApplication, setRecentApplication] = useState(null);
  const [upcomingApplication, setUpcomingApplication] = useState(null);

  useEffect(() => {
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
        calculateMetrics(data);
        setRecentApplication(data[data.length - 1]); // Get the most recently added application
        setUpcomingApplication(
          data
            .filter((app) => new Date(app.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0] // Get the earliest upcoming application
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (data) => {
    const total = data.length;
    const pending = data.filter((app) => app.status === "Pending").length;
    const interview = data.filter((app) => app.status === "Interview").length;
    const rejected = data.filter((app) => app.status === "Rejected").length;

    setMetrics({ total, pending, interview, rejected });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }; // Format: Month Day, Year
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const graphData = {
    responsive: true,
    labels: ["Pending", "Interviews", "Rejected"],
    datasets: [
      {
        label: "Applications by Status",
        data: [
          metrics.pending || 0,
          metrics.interview || 0,
          metrics.rejected || 0,
        ], //0 is shown when no data
        backgroundColor: ["#4E2A84", "#563C5C", "#493F5E"], //bars color
        barPercentage: 0.6, //bar thickness
        categoryPercentage: 0.8, //spacing between bars
        tension: 0,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff", //text color
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#ffffff", //grid line color
        },
        ticks: {
          color: "#ffffff", //tick color
          precision: 0,
          callback: (value) => Math.round(value),
        },
      },
    },
  };

  return (
    <div className={styles["overview-page"]}>
      <h1 className={styles["overview-header"]}>Dashboard Overview</h1>

      <div className={styles["layout-container"]}>
        {/* Graph Section */}
        <div className={styles["overview-graph"]}>
          <h2>Overview</h2>
          <div style={{ width: "auto", height: "100%" }}>
            <Bar data={graphData} options={graphOptions} />
          </div>
        </div>

        {/* Total Applications with Status */}
        <div className={styles["total-applications"]}>
          <h2>Total Applications</h2>
          <p className={styles["total-number"]}>{metrics.total}</p>
          <div className={styles["status-details"]}>
            <p>
              <strong>Status</strong>
            </p>
            <p>Pending: {metrics.pending}</p>
            <p>Interviews: {metrics.interview}</p>
            <p>Rejected: {metrics.rejected}</p>
            <img
              src={images.OpenBox}
              alt="Open Box"
              className={styles["open-box-image"]}
            />
          </div>
        </div>
      </div>

      {/* Information Row */}
      <div className={styles["info-row"]}>
        {/* Recently Added */}
        <div className={styles["recent-added"]}>
          <h2>Recently Added</h2>
          {recentApplication ? (
            <div>
              <p>
                <strong>Company:</strong> {recentApplication.company}
              </p>
              <p>
                <strong>Position:</strong> {recentApplication.position}
              </p>
              <p>
                <strong>Status:</strong> {recentApplication.status}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(recentApplication.date)}
              </p>
              <p>
                <strong>Season:</strong> {recentApplication.season}
              </p>
            </div>
          ) : (
            <p>No recent applications found.</p>
          )}
        </div>

        {/* Upcoming */}
        <div className={styles["upcoming"]}>
          <h2>Upcoming</h2>
          {upcomingApplication ? (
            <div>
              <p className={styles["upcoming-date"]}>
                {formatDate(upcomingApplication.date)}
              </p>
              <p>
                <strong>Company:</strong> {upcomingApplication.company}
              </p>
              <p>
                <strong>Position:</strong> {upcomingApplication.position}
              </p>
            </div>
          ) : (
            <p>No upcoming applications.</p>
          )}
        </div>

        {/* Goal */}
        <div className={styles["goal"]}>
          <h2>Goal</h2>
          <p className={styles["goal-status"]}>3/3</p>
          <p>Applications This Week</p>
        </div>
      </div>
    </div>
  );
}

export default Overview;
