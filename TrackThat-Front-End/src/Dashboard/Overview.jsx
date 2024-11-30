import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { APPLICATIONSURL } from "../../constants";
import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Overview.module.css";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

function Overview() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    interviewing: 0,
    rejected: 0,
    offers: 0,
  });
  const [applicationsPerWeek, setApplicationsPerWeek] = useState([0, 0, 0, 0, 0]);
  const [recentApplication, setRecentApplication] = useState(null);
  const [upcomingApplication, setUpcomingApplication] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
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
        calculateApplicationsPerWeek(data);
        setRecentApplication(data[data.length - 1]);
        setUpcomingApplication(
          data
            .filter((app) => new Date(app.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
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
    const interviewing = data.filter((app) => app.status === "Interviewing").length;
    const rejected = data.filter((app) => app.status === "Rejected").length;
    const offers = data.filter((app) => app.status === "Offers").length;

    setMetrics({ total, pending, interviewing, rejected, offers });
  };

  const calculateApplicationsPerWeek = (data) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const weeks = [0, 0, 0, 0, 0];

    data.forEach((app) => {
      const appDate = new Date(app.date);
      const appMonth = appDate.getMonth();
      const appYear = appDate.getFullYear();

      if (appMonth === currentMonth && appYear === currentYear) {
        const day = appDate.getDate();
        let weekNumber = Math.floor((day - 1) / 7);
        if (weekNumber > 4) weekNumber = 4;
        weeks[weekNumber] += 1;
      }
    });

    setApplicationsPerWeek(weeks);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const graphData = {
    labels: ["Pending", "Interviewing", "Rejected", "Offers"],
    datasets: [
      {
        label: "Applications by Status",
        data: [
          metrics.pending || 0,
          metrics.interviewing || 0,
          metrics.rejected || 0,
          metrics.offers || 0,
        ],
        backgroundColor: ["#4E2A84", "#563C5C", "#493F5E", "#6C5B7B"],
        hoverOffset: 10,
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
          color: "#ffffff",
        },
      },
    },
  };

  const barChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Applications per Week",
        data: applicationsPerWeek,
        backgroundColor: "#4E2A84",
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
          stepSize: 1,
        },
        grid: {
          display: true,
          color: "#cccccc",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className={styles["overview-page"]}>
      <h1 className={styles["overview-header"]}>Dashboard Overview</h1>

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

        {/* Total Applications */}
        <div className={styles["total-applications"]}>
          <h2>Total Applications</h2>
          <p className={styles["total-number"]}>{metrics.total}</p>
          <div className={styles["status-details"]}>
            <p>Pending: {metrics.pending}</p>
            <p>Interviewing: {metrics.interviewing}</p>
            <p>Rejected: {metrics.rejected}</p>
            <p>Offers: {metrics.offers}</p>
          </div>
        </div>

        {/* Goal */}
        <div className={styles["goal"]}>
          <h2>Goal</h2>
          <p className={styles["goal-status"]}>3/3</p>
          <p>Applications This Week</p>
        </div>
      </div>

      {/* Charts Container */}
      <div className={styles["layout-container"]}>
        {/* Pie Chart Section */}
        <div className={styles["overview-graph"]}>
          <h2>Applications by Status</h2>
          <Pie data={graphData} options={graphOptions} />
        </div>

        {/* Bar Chart Section */}
        <div className={styles["overview-graph"]}>
          <h2>Applications per Week</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Overview;
