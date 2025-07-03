import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./AdminSignup.css";

function AdminSignup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Admin signup successful!");
        setTimeout(() => navigate("/admin-login"), 2000);
      } else {
        toast.error(data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-wrapper">
      <h2 className="admin-signup-title">Admin Signup</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        <Form className="admin-signup-form">
          <label>
            <FaUser /> Username
            <Field name="username" className="admin-signup-input" />
            <ErrorMessage name="username" component="div" className="admin-signup-error" />
          </label>

          <label>
            <FaEnvelope /> Email
            <Field name="email" type="email" className="admin-signup-input" />
            <ErrorMessage name="email" component="div" className="admin-signup-error" />
          </label>

          <label>
            <FaLock /> Password
            <Field name="password" type="password" className="admin-signup-input" />
            <ErrorMessage name="password" component="div" className="admin-signup-error" />
          </label>

          <label>
            <FaLock /> Confirm Password
            <Field name="confirmPassword" type="password" className="admin-signup-input" />
            <ErrorMessage name="confirmPassword" component="div" className="admin-signup-error" />
          </label>

          <button type="submit" className="admin-signup-submit" disabled={loading}>
            {loading ? <div className="admin-spinner" /> : "Sign Up"}
          </button>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
}

export default AdminSignup;
