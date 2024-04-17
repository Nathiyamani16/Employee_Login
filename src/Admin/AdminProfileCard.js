import React from "react";
import './AdminProfileCardd.css'; 

const AdminProfileCard = ({ children }) => {
    return (
        <div className="USer-profile">
            {children}
        </div>
    );
}

export default AdminProfileCard;
