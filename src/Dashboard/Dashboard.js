import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS file
import UserProfile from "./UserProfile";
import PathNote from "./PathNote";

const Dashboard = () => {
  const location = useLocation();
  const user = location.state && location.state.user;
  const [timeIn, setTimeIn] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [timeEntries, setTimeEntries] = useState([]);
  const [timeOutClicked, setTimeOutClicked] = useState(false); // New state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (countdown === 0) {
      timeoutId = setTimeout(() => {
        navigate("/");
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [countdown, navigate]);

  useEffect(() => {
    const checkPreviousTimeEntry = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/timesheet/${user._id}/latest-entry`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.timeIn && !data.timeOut) {
            setTimeIn(new Date(data.timeIn));
            setTimeOut(null); // Reset time out when time in is clicked
          } else if (data && data.timeOut) {
            setTimeOut(new Date(data.timeOut));
          }
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    checkPreviousTimeEntry();
  }, [user._id]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/timesheet/${user._id}/entries`
        );
        if (response.ok) {
          const data = await response.json();
          setTimeEntries(data);
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchTimeEntries();
  }, [user._id]);

  const handleTimeIn = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/timesheet/timein/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeIn: new Date() }),
        }
      );
      if (response.ok) {
      setTimeIn(new Date());
      setTimeEntries(prevTimeEntries => [
        ...prevTimeEntries,
        { timeIn: new Date() }
      ]);
      setTimeOut(null);  
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleTimeOut = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/timesheet/timeout/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeOut: new Date() }),
        }
      );
      if (response.ok) {
        setTimeOut(new Date());
        setTimeOutClicked(true); // Set timeOutClicked to true
        const interval = setInterval(() => {
          setCountdown((prevCount) => prevCount - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
        }, 5000);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const convertToIST = (utcTimestamp) => {
    return new Date(utcTimestamp).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
  };


  // Function to format date and time as "DD/MM/YYYY - hh:mm A"
  const formatDateTime = (dateTime) => {
    const formattedDate = new Date(dateTime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} - ${formattedTime}`;
  };

  // Calculate the index of the first and last item of the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Slice the timeEntries array to get the items for the current page
  const currentItems = timeEntries.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <UserProfile user= {user} />
        <PathNote user = {user}/>
      </div>

      <div className="dashboard-container">
        {timeIn && <p>Time In: {convertToIST(timeIn)}</p>}
        {!timeOutClicked && timeOut && (
          <p>Previous Time Out: {convertToIST(timeOut)}</p>
        )}
        {timeOutClicked && timeOut && <p>Time Out: {convertToIST(timeOut)}</p>}
        {(!timeIn || (timeIn && timeOut)) && (
          <button onClick={handleTimeIn}>Time In</button>
        )}
        {!timeOut && <button onClick={handleTimeOut}>Time Out</button>}
        {timeOutClicked && countdown > 0 && timeOut && (
          <p>Redirecting in {countdown} seconds...</p>
        )}

        <h2>Recent Logins</h2>
        <table className="time-table">
          <thead>
            <tr>
              <th>Time In</th>
              <th>Time Out</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((entry, index) => (
              <tr key={index}>
                <td>{entry.timeIn ? formatDateTime(entry.timeIn) : ""}</td>
                <td>{entry.timeOut ? formatDateTime(entry.timeOut) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="pagination">
          { [1, 5, 10, 20].map((perPage, index) => (
            <button key={index} onClick={() => setItemsPerPage(perPage)}>
              {perPage}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
