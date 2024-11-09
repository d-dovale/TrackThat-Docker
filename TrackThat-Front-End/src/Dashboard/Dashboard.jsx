import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Components/navbar";
import images from "../images";
import Sidebar from "../Components/sidebar";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <Navbar />
            <div className="dashboard-layout">
                <Sidebar />
                <div className="content">
                    <Outlet />
                </div>   
            </div>
        </div>
    );
}

export default Dashboard;