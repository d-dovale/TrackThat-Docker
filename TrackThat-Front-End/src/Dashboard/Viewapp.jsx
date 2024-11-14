import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/navbar";
import AddAppWindows from "../Components/addAppWindows";
import images from "../images";
import "./Dashboard.css";


function Viewapp(){
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleAddApplicationClick = () => {
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSubmitForm = (event) => {  // Defining the form submission handler
        event.preventDefault();
        console.log("Form data submitted");
        handleCloseModal();
    };


    return (
        <div className="viewapp-container">
            <div className="viewapp-buttons">
                <div className="search-bar">
                    <img src={images.searchIcon} alt="Search Icon" className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        onChange={(e) => console.log('Searching for:', e.target.value)} // Log search text for now
                    />
                    <div className="search-icon"></div>
                </div>
                
                <button className="add-button" onClick={handleAddApplicationClick}>
                    <img src={images.plusIcon} alt="Add Icon" className="add-app-icon" />
                    Add Application
                </button>
            </div>
            <AddAppWindows show={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitForm} />
        </div>
    );

}




export default Viewapp;