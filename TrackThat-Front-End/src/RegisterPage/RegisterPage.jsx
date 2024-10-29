import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './RegisterStyles.css';
import images from "../images";
import { SIGNUPURL } from '../../constants';

function RegisterPage() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate(); // Hook for navigation

    const handleCloseClick = () => {
        navigate('/'); // Navigate back to the Landing Page
    }

    async function signupRequest() {
        try {
            if (name.length < 2 || email.length < 2 || password != confirmPassword) {
                throw Error(`Invalid data provided, check email, name, and that passwords match.`)
            }
            const res = await fetch(SIGNUPURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Specify the content type as JSON
                }, body: JSON.stringify({ name, email, password })
            })
            if (res.status != 200)
                throw Error(`User with credentials already exists, status ${res.status}`)
            const user = await res.json()
            console.log(user)
            navigate("/login")
        } catch (e) {
            alert("Failed", e.message)
        }
    }


    return (
        <div className="register-container">
            <div className="header">
                <div className="close-icon" onClick={handleCloseClick}>
                    <img
                        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/df2471cce2f0458801136c5f9b4f02482638ecf298058104d86b7cf9f615f672?placeholderIfAbsent=true&apiKey=875586cce6ab4f95a1d84bf340e03a56&width=100 100w"
                        sizes="(max-width: 768px) 80px, (max-width: 1200px) 80px, 50px"
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
                <div className="spacer"></div> {/* Used to balance the space and center the logo + text */}
            </div>
            <div className="register-box">
                <h2>Register</h2>
                <input type="text" placeholder="Email" className="register-field" value={email} onChange={e => setEmail(e.target.value)} />
                <input type="text" placeholder="Full Name" className="register-field" value={name} onChange={e => setName(e.target.value)} />
                <input type="password" placeholder="Password" className="register-field" value={password} onChange={e => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" className="register-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button className="register-button" onClick={signupRequest}>Create account</button>
                <div className="register-link">Already have an account?
                    <span onClick={() => navigate("/login")}>Sign In</span>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
