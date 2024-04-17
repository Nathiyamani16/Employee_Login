import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  const location = useLocation();
  const user = location.state && location.state.user;
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [category , SetCategory] = useState('User')
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [profileImage, setProfileImage] = useState(null);


  const handleCreateEmployee = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('employeeId', employeeId);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('profileImage', profileImage);
      formData.append('category',category)

      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 201) {
        console.log("User created successfully");
        navigate("/");
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  return (
    <div>
      <h1>Create a Employee</h1>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
      <br />
      <input placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br />
      <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
      <br />
      <label>Select Category</label>
      <select value={category} onChange={(e) => SetCategory(e.target.value)}>
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>
      <br />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      <label>
        Upload Profile Image:
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleProfileImageChange}
        />
      </label>
      <br />
      <br />
      <button onClick={handleCreateEmployee}>Create an Employee</button> 
      <br />
    </div>
  );
}

export default Admin;
