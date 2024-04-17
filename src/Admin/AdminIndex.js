import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
const AdminIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state && location.state.user;

  useEffect(() => {
    if (!user || !user.category || user.category !== "Admin") {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div>
      <AdminDashboard user={user} />
      <AdminLogin user={user} />
    </div>
  );
};

export default AdminIndex;
