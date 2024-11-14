import React from 'react';
import './AddAppWindows.css';
import images from "../images";

function AddAppWindows({ show, onClose, onSubmit }){
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
            <button onClick={onClose} className="modal-close-btn">
                    <img src={images.close} alt="Close" className="icon" />
                </button>
                <div className="modal-header">
                    <img src={images.plusIcon} alt="Add" className="icon" />
                    <span>Add Application</span>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="company">
                        <img src={images.Company} alt="Company" className="icon-small" />
                        Company
                    </label>
                    <input id="company" name="company" required />
                </div>
                <div className="form-group">
                    <label htmlFor="position">
                        <img src={images.Position} alt="Position" className="icon-small" />
                        Position
                    </label>
                    <input id="position" name="position" required />
                </div>
                <div className="form-group">
                    <label htmlFor="dateApplied">
                        <img src={images.Calendar} alt="Date Applied" className="icon-small" />
                        Date Applied
                    </label>
                    <input id="dateApplied" type="date" name="dateApplied" required />
                </div>
                <div className="form-group">
                    <label htmlFor="season">
                        <img src={images.Season} alt="Season" className="icon-small" />
                        Season
                    </label>
                    <select id="season" name="season">
                        <option value="Summer">Summer</option>
                        <option value="Fall">Fall</option>
                        <option value="Winter">Winter</option>
                        <option value="Spring">Spring</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="status">
                        <img src={images.Status} alt="Status" className="icon-small" />
                        Status
                    </label>
                    <select id="status" name="status">
                        <option value="Pending">Pending</option>
                        <option value="Interview">Interview</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button type="submit" className="submit-btn">ADD</button>
            </form>
            </div>
        </div>
    );

}

export default AddAppWindows;