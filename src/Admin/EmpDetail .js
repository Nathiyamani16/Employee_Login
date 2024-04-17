import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './EmpDetail.css';
import AdminEdit from "./AdminEdit";
import RecentEntries from "./RecentEntries";
import * as XLSX from 'xlsx';

const localizer = momentLocalizer(moment);

const EmpDetail = ({ user }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [timings, setTimings] = useState(null);
    const [leaveEvents, setLeaveEvents] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:3000/employees");
                if (response.ok) {
                    const data = await response.json();
                    setEmployees(data);
                } else {
                    console.log("Error:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error.message);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchTimings(selectedUser._id);
            fetchLeave(selectedUser.email);
        }
    }, [selectedUser]);

    const fetchTimings = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/timesheet/${userId}/entries`);
            if (response.ok) {
                const data = await response.json();
                setTimings(data);
                setShowCalendar(true);
            } else {
                console.log("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const fetchLeave = async (email) => {
        try {
            const response = await fetch(`http://localhost:3000/leave-history/${email}`);
            if (response.ok) {
                const leaveHistory = await response.json();
                // Filter leave events to only include those with the status "Approved"
                const approvedLeaveEvents = leaveHistory
                    .filter(leave => leave.status === "Approved")
                    .map(leave => ({
                        start: new Date(leave.fromDate),
                        end: moment(leave.toDate).add(1, 'day').toDate(),
                        title: 'Leave',
                    }));
                setLeaveEvents(approvedLeaveEvents);
            } else {
                console.log("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        setSelectedUser(null);
        setTimings(null);
        setShowCalendar(false);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const renderRoleButtons = () => {
        const rolesWithUsers = employees.reduce((roles, employee) => {
            if (employee.category === 'User' && !roles.includes(employee.role)) {
                roles.push(employee.role);
            }
            return roles;
        }, []);

        return rolesWithUsers.map((role, index) => (
            <button key={index} onClick={() => handleRoleClick(role)}>
                {role}
            </button>
        ));
    };

    const renderUsers = () => {
        if (!selectedRole) return null;
        const users = employees.filter((employee) => employee.role === selectedRole);
        return users.map((user, index) => (
            <div key={index}>
                <button onClick={() => handleUserClick(user)}>
                    {user.name}
                </button>
                {user === selectedUser && (
                    <button onClick={() => downloadExcel(user)}>Download Excel</button>
                )}
            </div>
        ));
    };

    const renderEvents = () => {
        const events = [];
        if (timings) {
            timings.forEach(timing => {
                events.push({
                    start: new Date(timing.timeIn),
                    end: new Date(timing.timeOut || new Date()),
                    title: 'Login',
                    className: 'login-event'
                });
                if (timing.timeOut) {
                    events.push({
                        start: new Date(timing.timeOut),
                        end: new Date(timing.timeOut),
                        title: 'Logout',
                        className: 'logout-event'
                    });
                }
            });
        }
        return [...events, ...leaveEvents];
    };

    const downloadExcel = (user) => {
        const fileName = `${user.name} download ${moment().format('MMMM YYYY')}.xlsx`;
        const data = generateExcelData(user);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Time Entries");
        XLSX.writeFile(wb, fileName);
    };

    const generateExcelData = (user) => {
        const data = [];

        const addEntry = (date, login, logout) => {
            data.push({
                "Date": date,
                "Login": login || "",
                "Logout": logout || "",
            });
        };

        const startDate = moment().startOf('month');
        const endDate = moment().endOf('month');
        let currentDate = startDate.clone();
        while (currentDate.isSameOrBefore(endDate)) {
            const date = currentDate.format("DD/MM/YYYY");
            const dayOfWeek = currentDate.day();

            if (dayOfWeek === 6 || dayOfWeek === 0) { // Saturday or Sunday
                addEntry(date, dayOfWeek === 6 ? "Saturday" : "Sunday", dayOfWeek === 6 ? "Saturday" : "Sunday");
            } else {
                const timing = timings.find(timing => moment(timing.timeIn).format("DD/MM/YYYY") === date);
                if (timing) {
                    addEntry(date, moment(timing.timeIn).format("h:mm A"), timing.timeOut ? moment(timing.timeOut).format("h:mm A") : "");
                } else {
                    const leaveEvent = leaveEvents.find(event => moment(event.start).format("DD/MM/YYYY") === date);
                    if (leaveEvent) {
                        addEntry(date, "Leave", "Leave");
                    } else {
                        addEntry(date, "", "");
                    }
                }
            }
            currentDate.add(1, 'day');
        }
        return data
    };

    return (
        <>
            <h1 className="EmployeeH1">Employee Time Management</h1>
            <br />
            <RecentEntries />
            <div>
                <h2>Employee Details:</h2>
                <div className="role-buttons">
                    {renderRoleButtons()}
                </div>
                <div className="users">
                    {renderUsers()}
                </div>
                {showCalendar && (
                    <div className="calendar">
                        <Calendar
                            localizer={localizer}
                            events={renderEvents()}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            eventPropGetter={event => ({
                                className: event.className,
                                style: {
                                    backgroundColor: event.title === 'Leave' ? 'red' : '',
                                },
                            })}
                        />
                    </div>
                )}
                <AdminEdit user={user} />
            </div>
        </>
    );
};

export default EmpDetail;
