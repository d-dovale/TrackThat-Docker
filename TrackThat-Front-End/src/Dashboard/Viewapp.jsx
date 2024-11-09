import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import images from "../images";
import "./Dashboard.css";


function Viewapp(){
    const navigate = useNavigate();


    return (
        <div className="viewapp-container">
            Welcome to the View Application Page 
        </div>
    );

}




export default Viewapp;