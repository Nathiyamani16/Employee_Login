import React, { useState, useEffect } from 'react';

const TimeSheet = ({ userId }) => {
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const response = await fetch(`http://localhost:3000/timesheet/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setTimeEntries(data.timeEntries);
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    };

    fetchTimeEntries();
  }, [userId]);

  return (
    <div className="timesheet">
      <h2>Time Sheet</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {timeEntries.map((entry) => (
            <tr key={entry._id}>
              <td>{new Date(entry.timeIn).toLocaleDateString()}</td>
              <td>{new Date(entry.timeIn).toLocaleTimeString()}</td>
              <td>{entry.timeOut ? new Date(entry.timeOut).toLocaleTimeString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeSheet;
