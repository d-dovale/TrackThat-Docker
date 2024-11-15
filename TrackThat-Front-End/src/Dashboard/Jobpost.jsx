import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import styles from "./Dashboard.module.css";


function Jobpost(){
    const navigate = useNavigate();


    return (
        <div className="jobpost-container">
            Welcome to the Job Posting Page 
        </div>
    );

}




export default Jobpost;