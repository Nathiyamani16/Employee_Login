import React, { useState } from "react";

const SendAdminMessage = () => {
  const [adminMessage, setAdminMessage] = useState("");

  const handleAdminMessageChange = (event) => {
    setAdminMessage(event.target.value);
  };

  const handleSendAdminMessage = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: adminMessage }),
      });

      if (response.status === 201) {
        console.log("Admin message sent successfully");
        setAdminMessage("");
      } else {
        console.log("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <div>
        <h2>Send Admin Message</h2>
        <textarea
          value={adminMessage}
          onChange={handleAdminMessageChange}
          rows="4"
          cols="50"
          placeholder="Enter admin message..."
        />
        <br />
        <button onClick={handleSendAdminMessage}>Send Message</button>
      </div>
    </div>
  );
};

export default SendAdminMessage;
