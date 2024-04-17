import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import LoginCard from "./LoginCard";
import { useAuth } from "../Auth/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // New state for handling errors
  const { setUser } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        console.log("Login successful");
        const userData = await response.json();

        if (userData.user.category === 'Admin') {
          navigate("/Admin", { state: { user: userData.user } } );
        } else if (userData.user.category === 'SuperAdmin') {
          navigate('/SuperAdmin' , { state: {user: userData.user}})
        } else{
          navigate("/dashboard", { state: { user: userData.user } });
        }
      } else {
        const errorMessage = await response.text(); // Extract error message from response
        setError(errorMessage); // Set error state
        console.error("Error:", errorMessage);
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again."); // Set generic error message
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="login-page">
      <LoginCard>
        <h2>Login Page!</h2>
        <input
          placeholder="Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error.replace('{"message":"','').replace('"}','')}</p>} {/* Display error message without {"message":} */}
      </LoginCard>
    </div>
  );
};

export default LoginPage;
