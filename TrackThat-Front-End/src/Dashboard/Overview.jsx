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
  const [applicationsPerWeek, setApplicationsPerWeek] = useState([]);
  const [weekLabels, setWeekLabels] = useState([]);
  const [recentApplication, setRecentApplication] = useState(null);
  const [upcomingApplication, setUpcomingApplication] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Need to be logged in to view this page.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(APPLICATIONSURL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401 && res.statusText === "Unauthorized") {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await res.json();
        console.log("User's Applications: ", data);
        setApplications(data);
        calculateMetrics(data);

        const { applicationsPerWeek, weekLabels } = calculateApplicationsPerWeek(data);
        setApplicationsPerWeek(applicationsPerWeek);
        setWeekLabels(weekLabels);

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
      const startLabel = weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      const endLabel = weekEnd.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
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
      if (appDate.getFullYear() === currentYear && appDate.getMonth() === currentMonth) {
        for (let i = 0; i < weeks.length; i++) {
          if (appDate >= weeks[i].start && appDate <= weeks[i].end) {
            applicationsPerWeek[i] += 1;
            break;
          }
        }
      }
    });

    return { applicationsPerWeek, weekLabels };
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get current month name
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

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
  const barColors = weekLabels.map((_, index) => chartColors[index % chartColors.length]);

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
          maxRotation: 0, // Set to 0 for horizontal labels
          minRotation: 0, // Set to 0 for horizontal labels
          font: {
            size: 10, // Adjust font size if needed
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
    <div className={styles["overview-page"]}>
      <h1 className={styles["overview-header"]}>Overview</h1>

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
          <h2>Applications in {currentMonthName}</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Overview;
