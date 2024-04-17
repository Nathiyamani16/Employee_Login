import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const LeaveCalendar = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [leaveEvents, setLeaveEvents] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:3000/employees");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.log("Error:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error.message);
            }
        };
        fetchUsers();
    }, []);

    const fetchLeave = async (email) => {
        try {
            console.log("Fetching leave for user:", email);
            const response = await fetch(`http://localhost:3000/leave-history/${email}`);
            if (response.ok) {
                const leaveHistory = await response.json();
                setLeaveEvents(leaveHistory.map(leave => ({
                    start: new Date(leave.fromDate),
                    end: moment(leave.toDate).add(1, 'day').toDate(),
                    title: 'Leave',
                })));
            } else {
                console.log("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            fetchLeave(selectedUser.email);
        }
    }, [selectedUser]);

    const handleUserChange = (user) => {
        console.log("Selected user:", user);
        setSelectedUser(user);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        if (event.title === 'Leave') {
            return {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            };
        }
        return {};
    };

    return (
        <div className="leave-calendar">
            <div>
                <h3>Select User:</h3>
                {users.map(user => (
                    <div key={user._id}>
                        <button onClick={() => handleUserChange(user)}>
                            {user.name}
                        </button>
                    </div>
                ))}
            </div>
            {selectedUser && (
                <Calendar
                    localizer={localizer}
                    events={leaveEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    eventPropGetter={eventStyleGetter} // Apply custom event styles
                />
            )}
        </div>
    );
};

export default LeaveCalendar;
