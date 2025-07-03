import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import "./CorperLogin.css";

function CorperLogin() {
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
    console.log("[LOGIN ATTEMPT] Email:", values.email);

    try {
      const res = await fetch(
        "https://ibnw-pop-party-ticket.onrender.com/event/corper-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      console.log("[RESPONSE STATUS]:", res.status);

      const data = await res.json();
      console.log("[RESPONSE DATA]:", data);

      if (res.ok) {
        if (data.user.status !== "approved") {
          toast.info(
            "Login successful, but your account is not yet approved."
          );
          localStorage.setItem("pendingUser", JSON.stringify(data.user));
          navigate("/pending-approval");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("type", "corper");
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        console.error("[LOGIN FAILED]:", data.error || "Unknown error");
        toast.error(data.error || "Login failed.");
      }
    } catch (err) {
      console.error("[SERVER ERROR]:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="corper-login-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="corper-login-title">Corper Login</h2>
      <p className="corper-login-note">
        Please enter your email and password (CORPXXX).
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="corper-login-form">
            <label>
              <FaEnvelope className="corper-login-icon" /> Email
              <Field name="email" type="email" className="corper-login-input" />
              <ErrorMessage
                name="email"
                component="div"
                className="corper-login-error"
              />
            </label>
            <label>
              <FaLock className="corper-login-icon" /> Password
              <div className="corper-login-password-wrapper">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="corper-login-input"
                />
                <span
                  className="corper-login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="corper-login-error"
              />
            </label>
            <button type="submit" className="corper-login-button" disabled={loading}>
              {loading ? <div className="corper-login-spinner" /> : "Login"}
            </button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}

export default CorperLogin;
