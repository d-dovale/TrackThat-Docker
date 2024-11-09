import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./sidebar.css";
import images from "../images";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location to determine active link

    // Function to check if the current path is the path provided
    const isActive = (path) => {
        return location.pathname.includes(path);
    }
    

    return (
        <div className="sidebar">
            <div className="profile-section">
                <img src={images.userIcon} alt="User" className="profile-pic" />
                <span>Name</span>
            </div>
            <div className="sidebar-links">
                <div className={`sidebar-link ${isActive("/dashboard/overview") ? "active" : ""}`}
                     onClick={() => navigate("/dashboard/overview")}>
                    <img src={images.graphIcon} alt="Overview Icon" className="icon" /> Overview
                </div>
                <div className={`sidebar-link ${isActive("/dashboard/viewapp") ? "active" : ""}`}
                     onClick={() => navigate("/dashboard/viewapp")}>
                    <img src={images.searchIcon} alt="View Applications Icon" className="icon" /> View Applications
                </div>
                <div className={`sidebar-link ${isActive("/dashboard/jobpost") ? "active" : ""}`}
                     onClick={() => navigate("/dashboard/jobpost")}>
                    <img src={images.jobIcon} alt="Job Postings Icon" className="icon" /> Job Postings
                </div>
                <div className={`sidebar-link ${isActive("/dashboard/settings") ? "active" : ""}`}
                     onClick={() => navigate("/dashboard/settings")}>
                    <img src={images.settingsIcon} alt="Settings Icon" className="icon" /> Settings
                </div>
            </div>
        </div>
    );
}

export default Sidebar;