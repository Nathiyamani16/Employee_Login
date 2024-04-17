import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./PathNote.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const PathNote = ({ user }) => {
  const navigate = useNavigate()


  const [adminMessage, setAdminMessage] = useState("");

  const fetchAdminMessage = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/message/latest');
      if (response.status === 200) {
        const data = await response.json();
        setAdminMessage(data.message);
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchAdminMessage();
  }, []);

  
  const [showNewsModal, setShowNewsModal] = useState(false);

  const handleNewsClick = () => {
    setShowNewsModal(true);
  };

  const handleCloseModal = () => {
    setShowNewsModal(false);
  };


  const handleAbout = () =>{
    navigate('/dashboard/about' ,{ state: {user}})
  }

  const handleHistory = () => {
    navigate('/dashboard/history', {state : {user}})
  }

  const handleLeave = () => {
    navigate('/dashboard/leavereq', {state: {user}})
  }
  return (
    <div className="path-note-card">
      <div className="button-row">
        <button className="button-size" onClick={handleNewsClick}>
          Updates
        </button>
        <button className="button-size" onClick={handleAbout}>About</button>
      </div>
      <div className="button-row">
        <button className="button-size" onClick={handleHistory}>History</button>
        <button className="button-size" onClick={handleLeave}>
          Leave Request
        </button>
      </div>

      {/* Modal for News */}
      {showNewsModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Updates</h2>
            <p>{adminMessage ? adminMessage : "No news at the moment."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathNote;
