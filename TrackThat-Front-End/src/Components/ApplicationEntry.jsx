import React, { useEffect, useState } from "react";
import styles from "./ApplicationEntry.module.css";
import EditButton from "./EditButton";
import images from "../images";

const fetchCompanyLogo = async (companyName) => {
  try {
    const response = await fetch(`https://api.logo.dev/search?q=${encodeURIComponent(companyName)}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`, // Use the environment variable
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch the logo");
    }

    const data = await response.json();
    console.log(`API response for ${companyName}:`, data);

    // Return the first valid logo URL if available
    return data.length > 0 && data[0].logo_url ? data[0].logo_url : null;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
};


function ApplicationEntry({ application, onEditButtonClick }) {
  const [iconUrl, setIconUrl] = useState(images.Company2); // Default to Company2 image

  useEffect(() => {
    const loadLogo = async () => {
      const logoUrl = await fetchCompanyLogo(application.company);
      setIconUrl(logoUrl || images.Company2);
    };

    if (application.company) {
      loadLogo();
    }
  }, [application.company]);

  return (
    <div className={styles["application-container"]}>
      <div className={styles["company-icon"]}>
        <img
          src={iconUrl}
          alt={`${application.company} Logo`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = images.Company2;
          }}
          width="50"
          height="50"
        />
      </div>
      <p>{application.company}</p>
      <p>{application.position}</p>
      <p>{application.status}</p>
      <p>{application.date}</p>
      <p>{application.season}</p>
      <div className={styles["edit-button-container"]}>
        <EditButton
          onClick={() => onEditButtonClick(application)}
          label="Edit Application"
        />
      </div>
    </div>
  );
}

export default ApplicationEntry;
