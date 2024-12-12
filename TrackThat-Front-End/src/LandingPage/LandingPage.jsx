import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./LandingStyles.css";
import Navbar from "../Components/navbar";
import images from "../images";
import { BASEURL } from "../../constants";

function LandingPage() {
  useEffect(() => {
    fetch(BASEURL); // Wake up the backend. Temp solution.
  }, []);

  const navigate = useNavigate();

  const handleTryNowClick = () => {
    navigate("/register");
  };

  const springingWords = {
    hidden: { opacity: 0, y: 50 }, // Start off invisible and below
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between each word animation
      },
    },
  };

  return (
    <motion.div
      className="landing-page"
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
    >
      <Navbar />

      <motion.div className="content-container" variants={staggerContainer}>
        <motion.h1 className="main-title" variants={springingWords}>
          Track Your Path to Success
        </motion.h1>
        <motion.p className="subtitle" variants={springingWords}>
          Stay on top of your job applications with TrackThat, the ultimate tool
          for organizing and tracking your job search progress.
        </motion.p>
        <motion.button
          className="try-now-button"
          onClick={handleTryNowClick}
          whileHover={{ scale: 1.1 }}
        >
          Try Now
        </motion.button>
      </motion.div>

      <motion.div
        className="icon-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <img src={images.googleIcon} alt="Google Icon" className="icon" />
        <img src={images.chatGPTIcon} alt="ChatGPT Icon" className="icon" />
        <img src={images.youtubeIcon} alt="YouTube Icon" className="icon" />
        <img src={images.twitterIcon} alt="Twitter Icon" className="icon" />
        <img src={images.facebookIcon} alt="Facebook Icon" className="icon" />
      </motion.div>
    </motion.div>
  );
}

export default LandingPage;
