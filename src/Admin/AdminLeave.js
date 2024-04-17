import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminLeave.css";
import { useLocation } from "react-router-dom";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AdminLeaveRequests = () => {
  const location = useLocation();
  const user = location.state && location.state.user;
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [AdminLeaveMessage, setAdminLeaveMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [timeEntries, setTimeEntries] = useState("");
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/leave-requests"
        );
        const sortedData = response.data.sort((a, b) =>
          b._id.localeCompare(a._id)
        );
        setLeaveRequests(sortedData);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/leave-requests/${requestId}`,
        { status: "Approved", AdminLeaveMessage, adminName: user.name }
      );
      const updatedRequests = leaveRequests.map((request) =>
        request._id === requestId
          ? { ...request, status: "Approved", approvedBy: user.name }
          : request
      );
      setLeaveRequests(updatedRequests);
      setAdminLeaveMessage("");
    } catch (error) {
      console.error("Error approving leave request:", error);
    }
  };

  const handleSendMessage = async (requestId, AdminLeaveMessage, user) => {
    try {
      if (!AdminLeaveMessage.trim()) {
        alert("Please enter a message");
        return;
      }

      if (!user || !user.name) {
        console.error("User information is missing");
        return;
      }
      console.log("User name:", user.name);
      await axios.put(
        `http://localhost:3000/admin/leave-requests/${requestId}`,
        { AdminLeaveMessage, status: "Rejected", adminName: user.name } // Send admin's name to backend
      );
      const updatedRequests = leaveRequests.map((request) =>
        request._id === requestId
          ? {
              ...request,
              AdminLeaveMessage,
              status: "Rejected",
              approvedBy: user.name,
            }
          : request
      );
      setLeaveRequests(updatedRequests);
      setAdminLeaveMessage("");
    } catch (error) {
      console.error("Error sending message for leave request:", error);
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const filteredRequests = selectedUser
    ? leaveRequests.filter((request) => request.name === selectedUser)
    : leaveRequests;

  return (
    <div>
      <h2>Leave Requests by Employees</h2>
      <div>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">All Employee</option>
          {[...new Set(leaveRequests.map((request) => request.name))].map(
            (userName) => (
              <option key={userName} value={userName}>
                {userName}
              </option>
            )
          )}
        </select>
      </div>

      <table className="AdminLeaveTable">
        <thead className="AdminLeaveTHead">
          <tr className="AdminLeaveTR">
            <th className="name">Name</th>
            <th className="email">Email</th>
            <th className="from">From Date</th>
            <th className="to">To Date</th>
            <th className="total">Total Days</th>
            <th className="reason">Reason</th>
            <th className="status">Status</th>
            <th className="statusmessage">Status Message</th>
            <th className="approvedby">Approved By</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request, index) => (
            <tr key={index} className="AdminLeaveTR">
              <td className="AdminLeaveTD">{request.name}</td>
              <td className="AdminLeaveTD">{request.email}</td>
              <td className="AdminLeaveTD">{formatDate(request.fromDate)}</td>
              <td className="AdminLeaveTD">{formatDate(request.toDate)}</td>
              <td className="AdminLeaveTD">{request.totalDays}</td>
              <td className="AdminLeaveTD">{request.reasonLeave}</td>
              <td className="AdminLeaveTD">{request.status}</td>
              <td className="AdminLeaveTD">{request.AdminLeaveMessage}</td>
              <td className="AdminLeaveTD">{request.approvedBy}</td>
              <td className="AdminLeaveTD">
                {request.status === "Pending" && (
                  <>
                    <button onClick={() => handleApprove(request._id)}>
                      Approve
                    </button>
                    <input
                      type="text"
                      placeholder="Enter Why Reject"
                      value={AdminLeaveMessage}
                      onChange={(e) => setAdminLeaveMessage(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        handleSendMessage(request._id, AdminLeaveMessage, user)
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeaveRequests;
