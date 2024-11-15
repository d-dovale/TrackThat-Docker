import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Dashboard.module.css";


function Overview(){
    const navigate = useNavigate();


    return (
        <div className="overview-container">
            Welcome to the Overview Page 
        </div>
    );

}




export default Overview;