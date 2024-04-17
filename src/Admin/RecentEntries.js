// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./RecentEntries.css";
// import{useNavigate, useLocation} from 'react-router-dom'

// const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB"); // Adjust the locale as per your requirement
//   };

  
// const RecentTimeEntriesTable = () => {
//   const location = useLocation()
//   const user = location.state && location.state.user
//     const navigate = useNavigate()

//   const [recentEntries, setRecentEntries] = useState([]);
//   const [leaveRequests, setLeaveRequests] = useState([]);

//   useEffect(() => {
//     const fetchRecentEntries = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/recent-time-entries");
//         if (response.status === 200) {
//             const datas = response.data.slice(-6)

//           setRecentEntries(datas.reverse());
//         } else {
//           console.log("Error fetching recent entries:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching recent entries:", error.message);
//       }
//     };

//     const fetchLeaveRequests = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/admin/leave-requests");
//         if (response.status === 200) {
//             const leaves = response.data.slice(-6).reverse();
//           setLeaveRequests(leaves);
//         } else {
//           console.log("Error fetching leave requests:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching leave requests:", error.message);
//       }
//     };

//     fetchRecentEntries();
//     fetchLeaveRequests();
//   }, []);

//   const HandleViewAll = () => {
//     navigate('/admin/adminLeave', {state: {user}})
//   }

//   return (
//     <div>
//       <h2>Last 6 Recent Time Entries</h2>
//       <table className="table-container custom-table">
//         <thead>
//           <tr>
//             <th>Employee</th>
//             <th>Login Time</th>
//             <th>Logout Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {recentEntries.map((entry, index) => (
//             <tr key={index}>
//               <td>{entry.userId.name}</td>
//               <td>{new Date(entry.timeIn).toLocaleString()}</td>
//               <td>{entry.timeOut ? new Date(entry.timeOut).toLocaleString() : "Not recorded"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h2>Last 6 Leave Requests</h2>
//       <table className="table-container custom-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>From Date</th>
//             <th>To Date</th>
//             <th>Total Days</th>
//             <th>Reason</th>
//             <th>Status</th>
//             <th>Approved/Rejected By</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaveRequests.map((request, index) => (
//             <tr key={index}>
//               <td>{request.name}</td>
//               <td>{request.email}</td>
//               <td>{formatDate(request.fromDate)}</td>
//               <td>{formatDate(request.toDate)}</td>
//               <td>{request.totalDays}</td>
//               <td>{request.reasonLeave}</td>
//               <td>{request.status}</td>
//               <td>{request.approvedBy}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button className="SeeAllButton" onClick={HandleViewAll}>View All</button>
//     </div>
//   );
// };

// export default RecentTimeEntriesTable;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecentEntries.css";
import { useNavigate, useLocation } from 'react-router-dom'

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB"); // Adjust the locale as per your requirement
};

const formatTime = (milliseconds) => {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  return `${hours}hrs ${minutes}m`;
};

const RecentTimeEntriesTable = () => {
  const location = useLocation()
  const user = location.state && location.state.user
  const navigate = useNavigate()

  const [recentEntries, setRecentEntries] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchRecentEntries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recent-time-entries");
        if (response.status === 200) {
          const datas = response.data.slice(-6)
          setRecentEntries(datas.reverse());
        } else {
          console.log("Error fetching recent entries:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching recent entries:", error.message);
      }
    };

    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/leave-requests");
        if (response.status === 200) {
          const leaves = response.data.slice(-6).reverse();
          setLeaveRequests(leaves);
        } else {
          console.log("Error fetching leave requests:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error.message);
      }
    };

    fetchRecentEntries();
    fetchLeaveRequests();
  }, []);

  const calculateWorkedHours = (entry) => {
    if (entry.timeOut) {
      const workedTime = new Date(entry.timeOut).getTime() - new Date(entry.timeIn).getTime();
      return formatTime(workedTime);
    } else {
      return "Working...";
    }
  };

  const HandleViewAll = () => {
    navigate('/admin/adminLeave', { state: { user } })
  }

  return (
    <div>
      <h2>Last 6 Recent Time Entries</h2>
      <table className="table-container custom-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Worked Hours</th>
          </tr>
        </thead>
        <tbody>
          {recentEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.userId.name}</td>
              <td>{new Date(entry.timeIn).toLocaleString()}</td>
              <td>{entry.timeOut ? new Date(entry.timeOut).toLocaleString() : "Not recorded"}</td>
              <td>{calculateWorkedHours(entry)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Last 6 Leave Requests</h2>
      <table className="table-container custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Total Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Approved/Rejected By</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.name}</td>
              <td>{request.email}</td>
              <td>{formatDate(request.fromDate)}</td>
              <td>{formatDate(request.toDate)}</td>
              <td>{request.totalDays}</td>
              <td>{request.reasonLeave}</td>
              <td>{request.status}</td>
              <td>{request.approvedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="SeeAllButton" onClick={HandleViewAll}>View All</button>
    </div>
  );
};

export default RecentTimeEntriesTable;
