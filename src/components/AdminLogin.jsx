import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("adminToken", data.token);
         localStorage.setItem("adminData", JSON.stringify(data.admin));
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminlogin-wrapper">
      <h2 className="adminlogin-title">Admin Login</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="adminlogin-form">
          <label className="adminlogin-label">
            Email
            <Field name="email" className="adminlogin-input" />
            <ErrorMessage name="email" component="div" className="adminlogin-error" />
          </label>

          <label className="adminlogin-label password-label">
            Password
            <div className="adminlogin-password-wrapper">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                className="adminlogin-input adminlogin-password-input"
              />
              <button
                type="button"
                className="adminlogin-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <ErrorMessage name="password" component="div" className="adminlogin-error" />
          </label>

          <button type="submit" className="adminlogin-submit" disabled={loading}>
            {loading ? <div className="adminlogin-spinner" /> : "Login"}
          </button>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
