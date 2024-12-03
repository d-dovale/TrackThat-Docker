import React, { useState } from 'react';
import styles from './RegisterPage.module.css'; // Use CSS Modules
import Logo from '../Components/logo';
import images from '../images'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { SIGNUPURL } from '../../constants';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate('/'); // Navigate back to the Landing Page
  };

  const signupRequest = async () => {
    try {
      if (name.length < 2 || email.length < 5 || password.length < 5 || password !== confirmPassword) {
        throw new Error('Invalid data provided: Check email, name, and that passwords match. Passwords must be at least 5 characters long.');
      }
      const res = await fetch(SIGNUPURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status !== 200) {
        throw new Error(`User with credentials already exists, status ${res.status}`);
      }
      const user = await res.json();
      console.log(user);
      navigate('/login');
    } catch (e) {
      alert(`Failed: ${e.message}`);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <Logo />
      <div className={styles.closeIcon} onClick={handleCloseClick}>
        <img src={images.close} alt="Close Icon" className={styles.closeIconImage} />
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
            Already have an account?{' '}
            <span className={styles.loginLink} onClick={() => navigate('/login')}>
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
