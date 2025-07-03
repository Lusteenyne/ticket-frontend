import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaReceipt,
  FaVenusMars,
} from "react-icons/fa";
import "./SignupNotCorper.css";
import "react-toastify/dist/ReactToastify.css";

function SignupNotCorper() {
  const [loading, setLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    receipt: "",
    gender: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10,15}$/, "Must be 10–15 digits")
      .required("Required"),
    receipt: Yup.mixed().required("Receipt is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));

    setLoading(true);
    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/event/non-corper-signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Non-Corper registration successful!");
        setTimeout(() => navigate("/non-corper-login"), 2000);
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-noncorper-wrapper">
      <h2 className="signup-noncorper-title">Non-Corper Signup</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="signup-noncorper-form">
            <label>
              <FaUser /> First Name
              <Field name="firstName" className="signup-noncorper-input" />
              <ErrorMessage name="firstName" component="div" className="signup-noncorper-error" />
            </label>

            <label>
              <FaUser /> Last Name
              <Field name="lastName" className="signup-noncorper-input" />
              <ErrorMessage name="lastName" component="div" className="signup-noncorper-error" />
            </label>

            <label>
              <FaEnvelope /> Email
              <Field name="email" className="signup-noncorper-input" />
              <ErrorMessage name="email" component="div" className="signup-noncorper-error" />
            </label>

            <label>
              <FaPhone /> Phone
              <Field name="phoneNumber" className="signup-noncorper-input" />
              <ErrorMessage name="phoneNumber" component="div" className="signup-noncorper-error" />
            </label>

            <label>
              <FaVenusMars /> Gender
              <Field as="select" name="gender" className="signup-noncorper-input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="signup-noncorper-error" />
            </label>

            <label>
              <FaReceipt /> Upload Receipt
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue("receipt", file);
                    setReceiptPreview(URL.createObjectURL(file));
                  }
                }}
                className="signup-noncorper-input"
              />
              <ErrorMessage name="receipt" component="div" className="signup-noncorper-error" />
            </label>

            {receiptPreview && (
              <img
                src={receiptPreview}
                alt="Preview"
                className="signup-noncorper-preview"
              />
            )}

            <button type="submit" className="signup-noncorper-submit" disabled={loading}>
              {loading ? <div className="spinner" /> : "Submit"}
            </button>
          </Form>
        )}
      </Formik>

       <div className="signup-corper-login-link">
              Already have an account? <Link to="/non-corper-login">Login</Link>
            </div>
      <ToastContainer />
    </div>
  );
}

export default SignupNotCorper;
