import React from "react";
import './UserCard.css'; 

const USerprofileCard = ({ children }) => {
    return (
        <div className="USer-profile">
            {children}
        </div>
    );
}

export default USerprofileCard;
