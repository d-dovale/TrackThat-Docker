import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { APPLICATIONSURL } from "../../constants";
import styles from "./Overview.module.css";
import { Bar, Pie } from "react-chartjs-2";
import images from "../images.js";
import { motion } from "framer-motion";
import "chart.js/auto";

import ErrorToast from "../Components/ErrorToast.jsx";

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
  const [applicationsPerWeek, setApplicationsPerWeek] = useState([]);
  const [weekLabels, setWeekLabels] = useState([]);
  const [recentApplication, setRecentApplication] = useState(null);
  const [upcomingApplication, setUpcomingApplication] = useState(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(0);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const goal = localStorage.getItem("weekly_goal");

    if (!Number.isNaN(Number(goal))) {
      setWeeklyGoal(goal);
    }

    if (!token) {
      if (!token) {
        navigate("/login");
        return;
      }
    }

    const fetchData = async () => {
      try {
        const res = await fetch(APPLICATIONSURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401 && res.statusText === "Unauthorized") {
          navigate("/login");
          return;
        }
        const data = await res.json();
        setApplications(data);
        calculateMetrics(data);

        const { applicationsPerWeek, weekLabels, currentWeekIndex } =
          calculateApplicationsPerWeek(data);
        setApplicationsPerWeek(applicationsPerWeek);
        setWeekLabels(weekLabels);
        setCurrentWeekIndex(currentWeekIndex);

        setRecentApplication(data[data.length - 1]);
        setUpcomingApplication(
          data
            .filter((app) => new Date(app.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
        );
      } catch (e) {
        setErrorMessage(e.message);
        setShowErrorToast(true);
        return;
      }
    };

    fetchData();
  }, [navigate]);

  const calculateMetrics = (data) => {
    const total = data.length;
    const pending = data.filter((app) => app.status === "Pending").length;
    const interviewing = data.filter(
      (app) => app.status === "Interviewing"
    ).length;
    const rejected = data.filter((app) => app.status === "Rejected").length;
    const offers = data.filter((app) => app.status === "Offer").length;

    setMetrics({ total, pending, interviewing, rejected, offers });
  };

  const calculateApplicationsPerWeek = (data) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    const weeks = [];
    const weekLabels = [];

    // Get the first day of the current month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Adjust weekStart to the Sunday on or before the first day of the month
    let weekStart = new Date(firstDayOfMonth);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Move back to Sunday

    // Loop until weekStart exceeds the last day of the month
    while (weekStart <= lastDayOfMonth) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Set times to include the entire day
      weekStart.setHours(0, 0, 0, 0);
      weekEnd.setHours(23, 59, 59, 999);

      // Format week label
      const startLabel = weekStart.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
      const endLabel = weekEnd.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
      weekLabels.push(`${startLabel}-${endLabel}`);

      // Push week object
      weeks.push({
        start: new Date(weekStart),
        end: new Date(weekEnd),
        count: 0,
      });

      // Move to next week
      weekStart.setDate(weekStart.getDate() + 7);
    }

    // Initialize applicationsPerWeek array
    const applicationsPerWeek = new Array(weeks.length).fill(0);

    // Count applications per week
    data.forEach((app) => {
      const appDate = new Date(app.date);
      if (
        appDate.getFullYear() === currentYear &&
        appDate.getMonth() === currentMonth
      ) {
        for (let i = 0; i < weeks.length; i++) {
          if (appDate >= weeks[i].start && appDate <= weeks[i].end) {
            applicationsPerWeek[i] += 1;
            break;
          }
        }
      }
    });

    const currentWeekIndex = weeks.findIndex(
      (week) => currentDate >= week.start && currentDate <= week.end
    );

    return { applicationsPerWeek, weekLabels, currentWeekIndex };
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get current month name
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  // Colors used in charts
  const chartColors = ["#2F4F4F", "#556B2F", "#8B0000", "#191970"]; // Matte darker colors

  // Updated colors for the charts
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
        backgroundColor: chartColors, // Matte darker colors
        hoverOffset: 10,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 30,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  // Generate bar colors for each week by cycling through chartColors
  const barColors = weekLabels.map(
    (_, index) => chartColors[index % chartColors.length]
  );

  const barChartData = {
    labels: weekLabels,
    datasets: [
      {
        label: `Applications in ${currentMonthName}`,
        data: applicationsPerWeek,
        backgroundColor: barColors, // Use array of colors
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        bottom: 30,
        left: 10,
        right: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 10,
          },
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
    <motion.div
      className={styles["overview-page"]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorToast
        isVisible={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
      <h1 className={styles["overview-header"]}>Overview</h1>

      {/* Information Row */}
      <div className={styles["info-row"]}>
        {/* Recently Added */}
        <motion.div
          className={`${styles["recent-added"]} ${styles["card"]}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className={styles["section-title"]}>
            <img
              src={images.Replay}
              alt="Replay Icon"
              className={styles["icon-placeholder"]}
            />
            Recently Added
          </h2>
          {recentApplication ? (
            <div>
              <p className={styles["company-text"]}>
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
        </motion.div>

        {/* Total Applications */}
        <motion.div
          className={`${styles["total-applications"]} ${styles["card"]}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={styles["section-title"]}>
            <img
              src={images.TotalSales}
              alt="Total Sales Icon"
              className={styles["icon-placeholder"]}
            />
            Total Applications
          </h2>
          <p className={styles["total-number"]}>{metrics.total}</p>
          <div className={styles["status-details"]}>
            <p>
              <strong>Pending:</strong> {metrics.pending}
            </p>
            <p>
              <strong>Interviewing:</strong> {metrics.interviewing}
            </p>
            <p>
              <strong>Rejected:</strong> {metrics.rejected}
            </p>
            <p>
              <strong>Offers:</strong> {metrics.offers}
            </p>
          </div>
        </motion.div>

        {/* Goal */}
        <motion.div
          className={`${styles["goal"]} ${styles["card"]}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className={styles["section-title"]}>
            <img
              src={images.Goal}
              alt="Goal Icon"
              className={styles["icon-placeholder"]}
            />
            Goal
          </h2>
          <p className={styles["total-number"]}>
            {applicationsPerWeek[currentWeekIndex]}/{weeklyGoal}
          </p>
          <p>Applications This Week</p>
        </motion.div>
      </div>

      {/* Charts Container */}
      <div className={styles["layout-container"]}>
        {/* Pie Chart Section */}
        <motion.div
          className={`${styles["overview-graph"]} ${styles["card"]}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className={styles["section-title"]}>Applications by Status</h2>
          <Pie data={graphData} options={graphOptions} />
        </motion.div>

        {/* Bar Chart Section */}
        <motion.div
          className={`${styles["overview-graph"]} ${styles["card"]}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className={styles["section-title"]}>
            Applications in {currentMonthName}
          </h2>
          <Bar data={barChartData} options={barChartOptions} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Overview;
