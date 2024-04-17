import React, { useState, useRef, useEffect } from "react";
import "./AdminSideNav.css";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const AdminSideNav = ({ user }) => {
  const navigate = useNavigate()

  const handleSendMessage = () =>{
    navigate('/admin/sendmess' ,{ state: {user}})
  }

  const handleHistory = () => {
    navigate('/admin/empDetail', {state : {user}})
  }

  const handleLeave = () => {
    navigate('/admin/adminLeave', {state: {user}})
  }

  const handleCreate = () => {
    navigate('/AddEmployee' , {state: {user}}, )
  }

  return (
    <div className="path-note-card">
      <div className="button-row">
        <button className="button-size" onClick={handleCreate}>
            Employee Management
        </button>
        <button className="button-size" onClick={handleSendMessage}>Send Messages</button>
      </div>
      <div className="button-row">
        <button className="button-size" onClick={handleHistory}>Employee Time Check</button>

        <button className="button-size" onClick={handleLeave}>
            Leave History
        </button>
      </div>
    </div>
  );
};

export default AdminSideNav;
