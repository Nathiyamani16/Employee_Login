import React from "react";
import AdminProfile from "./AdminProfile";
import AdminSideNav from "./AdminSideNav";

const AdminDashboard = ({user}) => {

    let names = user
    return(
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <AdminProfile user={names}/>
            <AdminSideNav user={names} />
        </div>
    )
}

export default AdminDashboard