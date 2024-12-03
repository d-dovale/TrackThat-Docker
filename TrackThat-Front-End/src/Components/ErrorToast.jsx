import React, { useEffect } from "react";
import styles from "./ErrorToast.module.css";

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`${styles["toast-container"]} ${
        isVisible ? styles["show"] : ""
      }`}
    >
      <svg
        className={styles["toast-icon"]}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <span className={styles["toast-message"]}>{message}</span>
    </div>
  );
};

export default Toast;
