import React, { useState } from 'react';
import './LoginPage.css';
import Logo from '../Components/logo';
import images from '../images'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate('/'); // Navigate back to the Landing Page
  };

  const loginRequest = async () => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      navigate('/dashboard/overview');
    } catch (e) {
      alert(`Failed: ${e.message}`);
    }
  };

  return (
    <div className="signin-container">
      <Logo />
      <div className="close-icon" onClick={handleCloseClick}>
        <img src={images.close} alt="Close Icon" className="close-icon-image"/>
      </div>
      <div className="signin-box">
        <div className="signin-form">
          <h2 className="signin-header">Sign In</h2>
            <input
              type="text"
              placeholder="Email"
              className="input-field email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-container">
              <input
                type="password"
                placeholder="Password"
                className="input-field password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className="forgot-link">Forgot?</a>
            </div>
            <button className="signin-button" onClick={loginRequest}>Sign In</button>
            <div className="or-section">OR</div>
            <button className="google-signin-button">
              <img src={images.googleIcon} alt="Sign in with Google" />
              Sign in with Google
            </button>
        </div>
        <div className='signin-register-box-wrapper'>
          <div className="register-box">
            New to trackthat? <span className="create-account-link" onClick={() => navigate("/register")}>Create an account</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;