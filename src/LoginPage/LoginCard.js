import React from "react";
import './LoginCard.css'; // Import the CSS file

const LoginCard = ({ children }) => {
    return (
        <div className="login-card">
            {children}
        </div>
    );
}

export default LoginCard;
