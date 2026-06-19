import React, { useState } from "react";
import Image from "next/image";
import Atlass from "../../../public/assets/img/about/Atlass2.svg";

const Step1 = ({ nextStep, handleChange, values }) => {
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const validatePhoneNumber = (number) => {
    const phoneNumberPattern = /^[0-9]{8,10}$/;
    if (number.length === 0) {
      return "Phone number must be entered";
    } else if (!phoneNumberPattern.test(number)) {
      return "Phone number must be between 8 to 10 digits";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Invalid email address";
    }
    return "";
  };

  const validateFirstName = (firstName) => {
    const re = /^[a-zA-Z ]+$/;
    if (firstName.trim() === "") {
      return "First name is required";
    } else if (!re.test(firstName)) {
      return "First name must contain only letters";
    }
    return "";
  };
  const validateLastName = (lastName) => {
    const re = /^[a-zA-Z ]+$/;
    if (lastName.trim() === "") {
      return "Last name is required";
    } else if (!re.test(lastName)) {
      return "Last name must contain only letters";
    }
    return "";
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    setPhoneNumberError(validatePhoneNumber(value));
    handleChange(e);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailError(validateEmail(value));
    handleChange(e);
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstNameError(validateFirstName(value));
    handleChange(e);
  };
  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastNameError(validateLastName(value));
    handleChange(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, phone, email } = e.target.elements;
    const firstNameError = validateFirstName(firstName.value);
    const phoneError = validatePhoneNumber(phone.value);
    const emailError = validateEmail(email.value);

    setFirstNameError(firstNameError);
    setPhoneNumberError(phoneError);
    setEmailError(emailError);

    if (!firstNameError && !phoneError && !emailError) {
      nextStep();
    }
  };

  return (
    <div className="container" style={{ paddingBottom: "30px" }} id="StepForm">
      <div className="row">
        <div
          className="col-lg-8"
          style={{ padding: "0", paddingLeft: "-100px" }}
        >
          <Image
            src={Atlass}
            height={100}
            width={100}
            alt="vfvbg"
            style={{ height: "90vh", width: "100%" }}
          />
        </div>
        <div
          className="col-lg-4"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "0",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", padding: "20px" }}
          >
            <h2
              className="form-title"
              style={{ color: "purple", textAlign: "center" }}
            >
              Request a Quote
            </h2>
            <p className="form-subtitle" style={{ textAlign: "center" }}>
              * indicates required fields
            </p>
            <div className="form-group">
              <label className="form-label">First Name*</label>
              <input
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleFirstNameChange}
                className={`form-input ${firstNameError ? "error" : ""}`}
                style={{ width: "100%" }}
                required
              />
              {firstNameError && (
                <div className="error-message" style={{ color: "red" }}>
                  {firstNameError}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name*</label>

              <input
                id="LastName"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleLastNameChange}
                className={`form-input ${lastNameError ? "error" : ""}`}
                style={{
                  height: "30px",
                  padding: "5px",
                  fontSize: "14px",
                  width: "100%",
                }}
                required
              />
              {lastNameError && (
                <div className="error-message" style={{ color: "red" }}>
                  {lastNameError}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number*</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handlePhoneNumberChange}
                className={`form-input ${phoneNumberError ? "error" : ""}`}
                style={{
                  height: "30px",
                  padding: "5px",
                  fontSize: "14px",
                  width: "100%",
                }}
                required
              />
              {phoneNumberError && (
                <div className="error-message" style={{ color: "red" }}>
                  {phoneNumberError}
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Email*</label>
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleEmailChange}
                className={`form-input ${emailError ? "error" : ""}`}
                style={{
                  height: "30px",
                  padding: "5px",
                  fontSize: "14px",
                  width: "100%",
                }}
                required
              />
              {emailError && (
                <div className="error-message" style={{ color: "red" }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* <div className="form-group">
  <label className="form-label">Email*</label>
  <input
    name="email"
    type="email"
    value={values.email}
    onChange={handleEmailChange}
    className={`form-input ${emailError ? "error" : ""}`}
    style={{
      height: "30px",
      padding: "5px",
      fontSize: "14px",
      width: "100%",
      border: "1px solid #ccc", // Default border style
      transition: "border-color 0.3s ease", // Smooth transition for border color change
    }}
    onFocus={(e) => { e.target.style.borderColor = "#800080"; }} // Purple border on focus
    onBlur={(e) => { e.target.style.borderColor = "#ccc"; }} // Back to default border color on blur
    required
  />
  {emailError && (
    <div className="error-message" style={{ color: "red" }}>
      {emailError}
    </div>
  )}
</div> */}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="form-nav-button">
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step1;
