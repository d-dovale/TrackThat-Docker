import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/navbar";
import images from "../images";
import Sidebar from "../Components/sidebar";
import styles from "./Dashboard.module.css";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className={styles["dashboard-container"]}>
            <Navbar />
            <div className={styles["dashboard-layout"]}>
                <Sidebar />
                <div className={styles.content}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
