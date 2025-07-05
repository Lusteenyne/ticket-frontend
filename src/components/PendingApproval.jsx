import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHourglassHalf } from "react-icons/fa";
import "./PendingApproval.css";

function PendingApproval() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pendingUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // If parsedUser is a string (like "non-corper"), wrap it in an object
        if (typeof parsedUser === "string") {
          setUser({ firstName: parsedUser });
        } else {
          setUser(parsedUser);
        }
      }
    } catch (err) {
      console.error("Error parsing pendingUser from localStorage", err);
    }
  }, []);

  const firstName = user?.firstName || "there";

  return (
    <div className="pending-approval-container">
      <FaHourglassHalf className="pending-icon" />
      <h2>Account Pending Approval</h2>
      <p>
        Hi <strong>{firstName}</strong>, your account is currently under review.
        Once approved, you'll be able to access your dashboard.
      </p>
      <button onClick={() => navigate("/")}>Return to Home</button>
    </div>
  );
}

export default PendingApproval;
