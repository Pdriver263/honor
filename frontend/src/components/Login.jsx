// ✅ Login.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Login.css"; // CSS ফাইল

const Login = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "2025") {
            setAuth(true);
            navigate("/customer-form");
        } else if (username === "scsexp" && password === "scsexp000") {
            localStorage.setItem("loggedIn", "true");
            navigate("/bill-submit");
        } else {
            alert("❌ Invalid username or password");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="input-container">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
