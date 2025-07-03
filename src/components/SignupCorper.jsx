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
import "./SignupCorper.css";
import "react-toastify/dist/ReactToastify.css";

function SignupCorper() {
  const [loading, setLoading] = useState(false);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const navigate = useNavigate();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    stateCode: "",
    localGov: "",
    gender: "",
    receipt: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be digits only")
      .required("Required"),
    stateCode: Yup.string().required("Required"),
    localGov: Yup.string().required("Required"),
    gender: Yup.string().required("Gender is required"),
    receipt: Yup.mixed().required("Receipt is required"),
  });

  const handleSubmit = async (values) => {
    console.log("Submitted Values:", values);
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, val);
    });

    setLoading(true);

    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/event/corper-signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (res.ok) {
        toast.success("Corper registration successful!");
        setTimeout(() => navigate("/corper-login"), 2000);
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-corper-wrapper">
      <h2 className="signup-corper-title">Corper Signup</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="signup-corper-form">
            <label>
              <FaUser /> First Name
              <Field name="firstName" className="signup-corper-input" />
              <ErrorMessage
                name="firstName"
                component="div"
                className="signup-corper-error"
              />
            </label>

            <label>
              <FaUser /> Last Name
              <Field name="lastName" className="signup-corper-input" />
              <ErrorMessage
                name="lastName"
                component="div"
                className="signup-corper-error"
              />
            </label>

            <label>
              <FaEnvelope /> Email
              <Field name="email" className="signup-corper-input" />
              <ErrorMessage
                name="email"
                component="div"
                className="signup-corper-error"
              />
            </label>

            <label>
              <FaPhone /> Phone
              <Field name="phoneNumber" className="signup-corper-input" />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="signup-corper-error"
              />
            </label>

            <label>
              State Code
              <Field name="stateCode" className="signup-corper-input" />
              <ErrorMessage
                name="stateCode"
                component="div"
                className="signup-corper-error"
              />
            </label>

 <label>
              Local Goverment
              <Field name="localGov" className="signup-corper-input" />
              <ErrorMessage
                name="localGov"
                component="div"
                className="signup-corper-error"
              />
            </label>


            <label>
              <FaVenusMars /> Gender
              <Field as="select" name="gender" className="signup-corper-input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Field>
              <ErrorMessage
                name="gender"
                component="div"
                className="signup-corper-error"
              />
            </label>

            <label>
              <FaReceipt /> Upload Receipt
              <input
                type="file"
                name="receipt"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  if (file) {
                    setFieldValue("receipt", file);
                    setReceiptPreview(URL.createObjectURL(file));
                  }
                }}
                className="signup-corper-input"
                accept="image/*"
              />
              <ErrorMessage
                name="receipt"
                component="div"
                className="signup-corper-error"
              />
            </label>

            {receiptPreview && (
              <img
                src={receiptPreview}
                alt="Receipt Preview"
                className="signup-corper-preview"
              />
            )}

            <button
              type="submit"
              className="signup-corper-submit"
              disabled={loading}
            >
              {loading ? <div className="spinner" /> : "Submit"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="signup-corper-login-link">
        Already have an account? <Link to="/corper-login">Login</Link>
      </div>

      <ToastContainer />
    </div>
  );
}

export default SignupCorper;
