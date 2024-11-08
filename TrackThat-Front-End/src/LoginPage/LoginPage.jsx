import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Reusing the same CSS file for simplicity
import images from "../images";
import { useState } from 'react';
import { LOGINURL } from '../../constants';

function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate(); // Hook for navigation

    const handleCloseClick = () => {
        navigate('/'); // Navigate back to the Landing Page
    };

    async function loginRequest() {
        try {
            const res = await fetch(LOGINURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Specify the content type as JSON
                }, body: JSON.stringify({ email, password })
            })
            if(res.status != 200)
                throw Error(`Invalid login credentials, status ${res.status}`)
            const data = await res.json()
            localStorage.setItem("token", data.access_token)
            navigate("/dashboard")
        } catch (e) {
            alert("Failed", e.message)
        }
    }
    return (
        <div className="login-container">
            <div className="header">
                <div className="close-icon" onClick={handleCloseClick}>
                    <img
                        src={images.close}
                        alt="Close Icon"
                        className="close-icon-image"
                    />
                </div>
                <div className="logo-and-title">
                    <img
                        src={images.logo}
                        alt="TrackThat Logo"
                        className="logo"
                    />
                    <span className="logo-text">trackthat</span>
                </div>
            </div>
            <div className="login-box">
                <h2>Sign In</h2>
                <input type="text" placeholder="Email" className="login-field" value={email} onChange={e => setEmail(e.target.value)} />
                <div className="password-container">
                    <input type="password" placeholder="Password" className="login-field password-input" value={password} onChange={e => setPassword(e.target.value)} />
                    <a className="forgot-link">Forgot?</a>
                </div>
                <button className="login-button" onClick={loginRequest}>Sign In</button>
                <div className="or-section">OR</div>
                <button className="google-signin-button">
                    <img src={images.googleIcon} alt="Sign in with Google" />
                    Sign in with Google
                </button>
                <div className="register-link">New to trackthat? <span onClick={() => navigate("/register")}>Create an account</span>
                </div>
            </div>
        </div>
    );
}


export default LoginPage;
