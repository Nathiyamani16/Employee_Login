import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment);

const History = () => {
  const location = useLocation();
  const user = location.state && location.state.user;
  const [events, setEvents] = useState([]);
  const [leaveEvents, setLeaveEvents] = useState([]);

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const timeEntriesResponse = await fetch(
          `http://localhost:3000/timesheet/${user._id}/entries`
        );
        const leaveResponse = await fetch(
          `http://localhost:3000/leave-history/${user.email}`
        );

        if (timeEntriesResponse.ok && leaveResponse.ok) {
          const timeEntriesData = await timeEntriesResponse.json();
          const leaveData = await leaveResponse.json();

          const formattedTimeEntries = timeEntriesData.reduce((accumulator, entry) => {
            if (entry.timeIn && entry.timeOut) {
              accumulator.push({
                title: "Time In",
                start: new Date(entry.timeIn),
                end: new Date(entry.timeIn),
              });
              accumulator.push({
                title: "Time Out",
                start: new Date(entry.timeOut),
                end: new Date(entry.timeOut),
              });
            }
            return accumulator;
          }, []);

          const formattedLeaveEvents = leaveData
            .filter(leave => leave.status === "Approved")
            .map(leave => ({
              start: new Date(leave.fromDate),
              end: moment(leave.toDate).add(1, 'day').toDate(),
              title: 'Leave',
            }));

          setEvents([...formattedTimeEntries, ...formattedLeaveEvents]);
          setLeaveEvents(formattedLeaveEvents);
        } else {
          console.error("Error fetching data:", timeEntriesResponse.statusText, leaveResponse.statusText);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    fetchTimeEntries();
  }, [user._id, user.email]);

  return (
    <div>
      <h1 style={{textAlign: "center"}}>History</h1>
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: "50px" }}
          eventPropGetter={event => ({
            style: {
              backgroundColor: event.title === 'Leave' ? 'red' : '',
            },
          })}
        />
      </div>
    </div>
  );
};

export default History;
