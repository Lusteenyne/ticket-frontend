import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import SignupCorper from "./components/SignupCorper";
import SignupNotCorper from "./components/SignupNotCorper";
import CorperLogin from "./components/CorperLogin";
import NonCorperLogin from "./components/NonCorperLogin";
import AdminLogin from "./components/AdminLogin";
import AdminSignup from "./components/AdminSignup";
import AdminDashboard from "./components/AdminDashboard";
import Dashboard from "./components/Dashboard";
import PendingApproval from "./components/PendingApproval";
import { ToastContainer } from "react-toastify"; // ✅ IMPORT
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/signup-corper" element={<SignupCorper />} />
        <Route path="/signup-non-corper" element={<SignupNotCorper />} />
        <Route path="/corper-login" element={<CorperLogin />} />
        <Route path="/non-corper-login" element={<NonCorperLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
      </Routes>

      {/* ✅ REQUIRED TO SHOW TOASTS */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // or "light" or "dark"
      />
    </>
  );
};

export default App;
