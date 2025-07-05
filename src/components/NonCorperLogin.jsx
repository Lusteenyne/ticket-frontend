import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "./NonCorperLogin.css";

function NonCorperLogin() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("[NON-CORPER LOGIN] Attempt:", values.email);

    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/event/non-corper-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log("[NON-CORPER LOGIN] Response:", data);

      if (res.ok) {
        const userStatus = data?.user?.status;

        if (!userStatus || userStatus !== "approved") {
          console.log("[NON-CORPER LOGIN] Unapproved user:", values.email, "Status:", userStatus);
          toast.info("Login successful, but your account hasn't been approved yet.");
          localStorage.setItem("token", data.token); 
          localStorage.setItem("type", "non-corper");
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/pending-approval");
          return;
        }

        // Approved user
        localStorage.setItem("token", data.token);
        localStorage.setItem("type", "non-corper");
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        console.error("[NON-CORPER LOGIN FAILED]:", data.error || data.message || "Unknown error");

        // Show specific error messages based on backend
        const errorMsg = data.error || data.message || "Login failed.";
        if (errorMsg.toLowerCase().includes("email")) {
          toast.error("Email not found. Please check and try again.");
        } else if (errorMsg.toLowerCase().includes("password")) {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error("[NON-CORPER LOGIN] Server error:", error);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="noncorper-login-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="noncorper-login-title">Non-Corper Login</h2>
      <p className="noncorper-login-note">Enter your email and password. (AQUAXXX)</p>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {() => (
          <Form className="noncorper-login-form">
            <label>
              <FaEnvelope className="noncorper-login-icon" /> Email
              <Field name="email" type="email" className="noncorper-login-input" />
              <ErrorMessage name="email" component="div" className="noncorper-login-error" />
            </label>
            <label>
              <FaLock className="noncorper-login-icon" /> Password
              <div className="noncorper-login-password-wrapper">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="noncorper-login-input"
                />
                <span
                  className="noncorper-login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage name="password" component="div" className="noncorper-login-error" />
            </label>
            <button type="submit" className="noncorper-login-button" disabled={loading}>
              {loading ? <div className="noncorper-login-spinner" /> : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default NonCorperLogin;
