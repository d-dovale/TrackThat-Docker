import React, { useState } from "react";
import styles from "./LoginPage.module.css"; // Updated import for CSS Modules
import Logo from "../Components/logo";
import images from "../images"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { LOGINURL } from "../../constants";
import ErrorToast from "../Components/ErrorToast";
import SuccessToast from "../Components/SuccessToast";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate("/"); // Navigate back to the Landing Page
  };

  const loginRequest = async () => {
    if (email.length < 1) {
      setErrorMessage("Email field is empty.");
      setShowErrorToast(true);
      return;
    }
    if (password.length < 1) {
      setErrorMessage("Password field is empty.");
      setShowErrorToast(true);
      return;
    }
    try {
      const res = await fetch(LOGINURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status !== 200) {
        if (res.status == 422) {
          const error = await res.json()
          setErrorMessage(error.detail[0].msg);
          setShowErrorToast(true);
          return;
        }
        setErrorMessage("Password or email are incorrect.");
        setShowErrorToast(true);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("weekly_goal", data.weekly_goal);
      setShowErrorToast(false);
      setSuccessMessage("Login successful.");
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate("/dashboard/overview");
      }, 1000);
    } catch (e) {
      setErrorMessage(e.message);
      setShowErrorToast(true);
      return;
    }
  };

  return (
    <div className={styles.signinContainer}>
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
      <div className={styles.signinBox}>
        <div className={styles.signinForm}>
          <h2 className={styles.signinHeader}>Sign In</h2>
          <input
            type="text"
            placeholder="Email"
            className={`${styles.inputField} ${styles.emailInput}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.passwordContainer}>
            <input
              type="password"
              placeholder="Password"
              className={`${styles.inputField} ${styles.passwordInput}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.forgotLink}>
              Forgot?
            </a>
          </div>
          <button className={styles.signinButton} onClick={loginRequest}>
            Sign In
          </button>
          <div className={styles.orSection}>OR</div>
          <button className={styles.googleSigninButton}>
            <img src={images.googleIcon} alt="Sign in with Google" />
            Sign in with Google
          </button>
        </div>
        <div className={styles.registerBoxWrapper}>
          <div className={styles.registerBox}>
            New to TrackThat?{" "}
            <span
              className={styles.createAccountLink}
              onClick={() => navigate("/register")}
            >
              Create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
