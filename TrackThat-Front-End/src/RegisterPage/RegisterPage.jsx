import React, { useState } from "react";
import styles from "./RegisterPage.module.css"; // Use CSS Modules
import Logo from "../Components/logo";
import images from "../images"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { SIGNUPURL } from "../../constants";
import ErrorToast from "../Components/ErrorToast";
import SuccessToast from "../Components/SuccessToast";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate("/"); // Navigate back to the Landing Page
  };

  const signupRequest = async () => {
    try {
      if (password.length < 5) {
        setErrorMessage("Password must be at least 5 characters long.");
        setShowErrorToast(true);
        return;
      }
      if (name.length < 2) {
        setErrorMessage("Name must be at least 2 characters long.");
        setShowErrorToast(true);
        return;
      }
      if (email.length < 5) {
        setErrorMessage("Email must be at least 5 characters long.");
        setShowErrorToast(true);
        return;
      }
      if (password != confirmPassword) {
        setErrorMessage("Passwords do not match.");
        setShowErrorToast(true);
        return;
      }
      const res = await fetch(SIGNUPURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status !== 200) {
        if (res.status == 422) {
          const error = await res.json()
          setErrorMessage(error.detail[0].msg);
          setShowErrorToast(true);
          return;
        }
        setErrorMessage("User with credentials already exists");
        setShowErrorToast(true);
        return;
      }
      const user = await res.json();
      setShowErrorToast(false);
      setSuccessMessage("User created.");
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (e) {
      setErrorMessage(e.message);
      setShowErrorToast(true);
      return;
    }
  };

  return (
    <div className={styles.registerContainer}>
      <ErrorToast
        isVisible={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
      <SuccessToast
        isVisible={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
      <Logo />
      <div className={styles.closeIcon} onClick={handleCloseClick}>
        <img
          src={images.close}
          alt="Close Icon"
          className={styles.closeIconImage}
        />
      </div>
      <div className={styles.registerBox}>
        <div className={styles.registerForm}>
          <h2 className={styles.registerHeader}>Create Account</h2>
          <input
            type="text"
            placeholder="Full Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={styles.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className={styles.registerButton} onClick={signupRequest}>
            Create Account
          </button>
        </div>
        <div className={styles.loginBoxWrapper}>
          <div className={styles.loginBox}>
            Already have an account?{" "}
            <span
              className={styles.loginLink}
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
