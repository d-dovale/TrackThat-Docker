import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import "./Dashboard.css";


function Settings(){
    const navigate = useNavigate();


    return (
        <div className="settings-container">
            Welcome to the Settings Page 
        </div>
    );

}




export default Settings;