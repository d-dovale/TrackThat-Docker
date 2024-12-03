import React, { useEffect } from "react";
import styles from "./SuccessToast.module.css";

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
        className={`${styles["toast-icon"]}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
      </svg>
      <span className={styles["toast-message"]}>{message}</span>
    </div>
  );
};

export default Toast;
