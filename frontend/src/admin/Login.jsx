import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// CSS and Assets
import Logo from "../assets/login/logo-light.png";
import "./styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Using useNavigate for navigation

    const handleLogin = async () => {
        try {
            const response = await fetch(
                "https://ccmps-server-node.vercel.app/api/auth/admin-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to login");
            } else {
                const userData = await response.json();
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("role", userData.role); // Store role in session storage
                // Redirect to welcome page after successful login
                navigate("/Admin/Welcome");
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Failed to login. Please try again later.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="adminContainer">
            <div className="adminPanel">
                {/* 
        <div className="adminLogoPanel">
          <img src={Logo} alt="Logo" className="adminLogo" /> 
        </div>
        */}
                <div className="adminLoginPanel">
                    <div className="adminLoginPanelHeader">
                        <h1>ADMIN LOGIN</h1>
                    </div>
                    <div className="adminLoginPanelInputs">
                        <div className="admin-panel-inp">
                            <label htmlFor="email">Email Address</label>
                            <input
                                className="input-box"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="admin-panel-inp">
                            <label htmlFor="password">Password</label>
                            <input
                                className="input-box"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </div>
                    <div className="adminLoginPanelLogin">
                        <button className="adminLoginButton" onClick={handleLogin}>
                            Log In
                        </button>
                        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;