import React from "react";
import "./AdminProfile.css";
import AdminProfileCard from "./AdminProfileCard";

const AdminProfile = ({ user }) => {
  return (
    <div className="row">
      <AdminProfileCard>
      <div className="left">
          {user.profileImage && (
            <img
              src={`http://localhost:3000/${user.profileImage}`}
              alt={user.name}
              className="images"
            />
          )}
        </div>
        <div className="right">
            <div className="content">
          <p className="Userp1">Hello {user.name}! </p>
          <p className="userp2">Email: {user.email}</p>
          <p className="userp2">EmployeeID : {user.employeeId}</p>
          <p className="userp2">Role: {user.role}</p>
          </div>

        </div>
      </AdminProfileCard>
    </div>
  );
};

export default AdminProfile;
