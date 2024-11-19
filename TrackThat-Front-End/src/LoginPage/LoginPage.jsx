import React, { useState } from "react";
import styles from "./LoginPage.module.css"; // Updated import for CSS Modules
import Logo from "../Components/logo";
import images from "../images"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { LOGINURL } from "../../constants";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate("/"); // Navigate back to the Landing Page
  };

  const loginRequest = async () => {
    try {
      const res = await fetch(LOGINURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.status !== 200) {
        throw new Error(
          `Login Unsuccessful: password or email are incorrect. Status ${res.status}`
        );
      }
      const data = await res.json();
      console.log(data);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard/overview");
    } catch (e) {
      alert(`Failed: ${e.message}`);
    }
  };

  return (
    <div className={styles.signinContainer}>
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
            New to trackthat?{" "}
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
