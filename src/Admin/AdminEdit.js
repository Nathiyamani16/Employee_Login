import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const AdminEdit = () => {
    const location = useLocation();
    const user = location.state && location.state.user;

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);

        // Display image preview
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    const confirmChangePassword = () => {
        const confirm = window.confirm("Are you sure you want to change your password?");
        if (confirm) {
            togglePasswordForm();
        }
    };

    const updatePassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            const confirm = window.confirm("Are you sure you want to update your password?");
            if (!confirm) {
                return;
            }

            const response = await fetch(`http://localhost:3000/update-password/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            if (response.ok) {
                console.log('Password updated successfully');
                togglePasswordForm(); // Hide password form after successful update
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const updateProfilePicture = async () => {
        try {
            const formData = new FormData();
            formData.append("profileImage", profileImage);

            const confirm = window.confirm("Are you sure you want to update your profile picture?");
            if (!confirm) {
                return;
            }

            const response = await fetch(`http://localhost:3000/update-profile-picture/${user._id}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                console.log("Profile picture updated successfully");
                setProfileImage(null); // Reset profile image state
                setImagePreview(null); // Reset image preview
            } else {
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div>
            <h2>Hello {user.name}!</h2>
            <p>Your Details:</p>
            <ul>
                <li>Email : {user.email}</li>
                <li>Employee ID : {user.employeeId}</li>
                <li>Role : {user.role}</li>
                <li>Password : {user.password}</li>
            </ul>
            
            <button onClick={togglePasswordForm}>
                {showPasswordForm ? "No thanks" : "Change Password"}
            </button>
            {showPasswordForm && (
                <div>
                    <label>
                        New Password:
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter New Password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                        />
                        <button onClick={togglePasswordVisibility}>
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </label>
                    <br />
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            placeholder="Re-enter New Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                    </label>
                    <br />
                    <button onClick={updatePassword}>Submit</button>
                </div>
            )}
            <br />
            <br />
            <img src={`http://localhost:3000/${user.profileImage}`} 
             style={{
              maxWidth: "250px",
              height: "200px",
              objectFit: "contain",
              borderRadius: "5%",
              boxShadow: "0 0 10px rgba(0,0,0,0.9)",
          }}
           />
           <br />
            <br />
            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Profile"
                    style={{
                        maxWidth: "250px",
                        height: "200px",
                        objectFit: "contain",
                        borderRadius: "5%",
                        boxShadow: "0 0 10px rgba(0,0,0,0.9)",
                    }}
                />
            )}
            <br />
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
            {profileImage && (
                <button onClick={updateProfilePicture}>Update Profile Picture</button>
            )}
        </div>
    );
};

export default AdminEdit;
