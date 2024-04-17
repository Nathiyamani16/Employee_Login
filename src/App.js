import React from "react";
import LoginPage from "./LoginPage/LoginPage";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from "./Dashboard/Dashboard";
import SuperAdmin from "./SuperAdmin/SuperAdmin";
import About from "./Dashboard/About";
import AdminIndex from "./Admin/AdminIndex";
import Admin from "./Admin/Admin";
import History from "./Dashboard/History";
import LeaveRequest from "./Dashboard/LeaveRequest";
import SendAdminMessage from "./Admin/SendAdminMessage";
import AdminLeaveRequests from "./Admin/AdminLeave";
import EmpDetail from "./Admin/EmpDetail ";


const App = () => {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Admin" element={<AdminIndex />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/SuperAdmin" element={<SuperAdmin />} />
      <Route path="/dashboard/about" element={<About />} />
      <Route path="/dashboard/history" element={<History /> } />
      <Route path="/dashboard/leavereq" element={<LeaveRequest />} />
      <Route path="/AddEmployee" element={<Admin />} />
      <Route path="/admin/sendmess" element={<SendAdminMessage />} />
      <Route path="/admin/adminLeave" element={<AdminLeaveRequests />} />
      <Route path="/admin/empDetail" element={<EmpDetail />} />
    </Routes>
    </BrowserRouter>
    
  )
}

export default App