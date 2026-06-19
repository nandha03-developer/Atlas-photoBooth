"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { contactData } from "../../data/contactLinks";
import axios from "axios";
import { toast } from "react-toastify";
import Recaptcha from "../../components/Recaptcha/Recaptcha";
import { Controller, useForm } from "react-hook-form";
import { Button, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
 
export default function ContactOne() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [recaptcha, setRecaptcha] = useState("");

  const [capKey, setCapKey] = useState(null); // Google reCAPTCHA key
  const recaptchaRef = useRef(null);


  // const onSubmit = async (data) => {
  //   recaptchaRef.current?.execute();
  //   setLoading(true);
  //   const currentDate = new Date();
  //   const loginDateTime = currentDate.toLocaleString("en-IN", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //     hour12: true,
  //   });

  //   const mutation = `mutation create{
  //     createContactUs(input:{
  //       Datetime: "${loginDateTime}", 
  //       CompanyName: "${data.CompanyName}", 
  //       EmailAddress: "${data.email}", 
  //       Message:"${data.message}", 
  //       Name:"${data.name}", 
  //       PhoneNo:"${data.PhoneNo}"
  //     }) {
  //       Datetime
  //       CompanyName
  //       EmailAddress
  //       Id
  //       Message
  //       Name
  //       PhoneNo
  //     }
  //   }`;

  //   const requestBody = {
  //     query: mutation,
  //   };

  //   const headers = {
  //     "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
  //     "Content-Type": "application/json",
  //   };
  //   const endPoint = process.env.NEXT_PUBLIC_API_URL;
  //   try {
  //     const res = await axios.post(endPoint, requestBody, { headers });
  //     if (res.data.errors) {
  //       const errorMessage = res.data.errors[0].message;
  //       toast.error(errorMessage);
  //     } else {
  //       toast.success("Message sent successfully!");

  //       setLoading(false);
  //       reset();  
  //     }
   
  //   } catch (err) {
  //     console.error("Error saving data:", err);
  //     setLoading(false);
  //     toast.error("Error sending message. Please try again later.");
  //   }
  // };
  const commonStyles = {
    "& .MuiInputLabel-root": {
      color: "purple", // Set the label color to purple
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "purple", // Change the label color to purple when focused
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "&.Mui-focused fieldset": {
        borderColor: "purple", // Change the border color to purple when focused
      },
      "& input": {
        color: "black", // Change input text color to purple
      },
      "& textarea": {
        color: "black", // Change textarea text color to purple
      },
    },
    borderRadius: "8px", // Adjust the value as needed for your desired border radius
  };
  

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Start loading spinner
      // Trigger reCAPTCHA
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        toast.error("ReCAPTCHA verification failed. Please try again.");
        setLoading(false);
        return;
      }
  
      // ReCAPTCHA verified, proceed with API call
      const currentDate = new Date();
      const loginDateTime = currentDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
  
      const mutation = `mutation create {
        createContactUs(input: {
          Datetime: "${loginDateTime}",
          CompanyName: "${data.CompanyName}",
          EmailAddress: "${data.email}",
          Message: "${data.message}",
          Name: "${data.name}",
          PhoneNo: "${data.PhoneNo}"
        }) {
          Datetime
          CompanyName
          EmailAddress
          Id
          Message
          Name
          PhoneNo
        }
      }`;
  
      const requestBody = {
        query: mutation,
      };
  
      const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "Content-Type": "application/json",
      };
  
      const endPoint = process.env.NEXT_PUBLIC_API_URL;
  
      const res = await axios.post(endPoint, requestBody, { headers });
  
      if (res.data.errors) {
        const errorMessage = res.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Message sent successfully!");
        reset(); // Reset form
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Error sending message. Please try again later.");
    } finally {
      setLoading(false); // Stop loading spinner
      recaptchaRef.current?.reset(); // Reset reCAPTCHA for reuse
    }
  };
  

  return (
    <>
      <section
        className="layout-pt-md layout-pb-lg"
        style={{ marginTop: "100px" }}
      >
        <div className="container">
          <div className="row y-gap-50 justify-between">
            <div className="col-lg-4">
              <p className="heading fw-600" style={{fontSize: "25px"}}> Keep In Touch With Us.</p>
              <p className="para mt-25" style={{fontSize:"17px"}}>
                Reach out for inquiries, support, or to share your fotobooth
                moments. We're here to help anytime!
              </p>

              <div className="y-gap-30 pt-40 lg:pt-40">
                {contactData.map((elm, i) => (
                  <div key={i} className="d-flex items-center">
                    <div className="d-flex justify-center items-center size-60 rounded-full bg-light-7">
                      <Image width={30} height={30} src={elm.icon} alt="icon" />
                    </div>
                    <div className="para ml-20" style={{fontSize:"15px"}}>
                      {elm.address
                        ? `${elm.address
                            .split(" ")
                            .slice(0, 4)
                            .join(" ")} \n ${elm.address
                            .split(" ")
                            .slice(4, -1)
                            .join(" ")}`
                        : elm.email || elm.phoneNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-7">
              <p className="heading fw-600" style={{fontSize: "25px"}}>Send a Message.</p>
              <p className="para mt-25" style={{fontSize:"17px",marginBottom:"20px"}}>
                Send us a message anytime for inquiries, support, or to share
                your fotobooth experiences. We’re here to assist!
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
  <Grid container spacing={2}>
    {/* Name Field */}
    <Grid item xs={12} md={6}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        rules={{
          required: "Name is required",
          pattern: {
            value: /^[a-zA-Z\s]{3,}$/,
            message:
              "Name must be at least 3 characters long and contain only letters and spaces",
          },
        }}
        render={({ field }) => (
          <TextField
            fullWidth
            label="Name"
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...field}
            size="small"
            sx={commonStyles}
          />
        )}
      />
    </Grid>

    {/* Phone Number Field */}
    <Grid item xs={12} md={6}>
      <Controller
        name="PhoneNo"
        control={control}
        defaultValue=""
        rules={{
          required: "Phone number is required",
          pattern: {
            value: /^\d{10}$/,
            message: "Phone Number must be 10 digits long",
          },
        }}
        render={({ field }) => (
          <TextField
            fullWidth
            label="Phone Number"
            error={Boolean(errors.PhoneNo)}
            helperText={errors.PhoneNo?.message}
            {...field}
            size="small"
            sx={commonStyles}
          />
        )}
      />
    </Grid>

    {/* Email Field */}
    <Grid item xs={6}>
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        }}
        render={({ field }) => (
          <TextField
            fullWidth
            label="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...field}
            size="small"
            sx={commonStyles}
          />
        )}
      />
    </Grid>

    {/* Company Name Field */}
    <Grid item xs={12} md={6}>
      <Controller
        name="CompanyName"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            fullWidth
            label="Company Name"
            error={Boolean(errors.CompanyName)}
            helperText={errors.CompanyName?.message}
            {...field}
            size="small"
            sx={commonStyles}
          />
        )}
      />
    </Grid>

    {/* Message Field */}
    <Grid item xs={12}>
  <Controller
    name="message"
    control={control}
    defaultValue=""
    rules={{
      required: "Message is required",
      minLength: {
        value: 10,
        message: "Message must be at least 10 characters long",
      },
    }}
    render={({ field }) => (
      <TextField
        fullWidth
        label="Message"
        multiline
        rows={4}
        error={Boolean(errors.message)}
        helperText={errors.message?.message}
        {...field}
        sx={{
          ...(typeof commonStyles === "function" ? commonStyles() : commonStyles), // Ensure function-based styles are resolved
          "& .MuiOutlinedInput-root": {
            ...(commonStyles?.["& .MuiOutlinedInput-root"] || {}), // Merge existing styles for MuiOutlinedInput-root
            alignItems: "flex-start", // Add/override alignItems
            height: "auto",          // Add/override height
          },
          "& textarea": {
            ...(commonStyles?.["& textarea"] || {}), // Merge existing styles for textarea
            padding: "10px", // Add/override padding
          },
        }}
      />
    )}
  />
</Grid>


    {/* ReCAPTCHA */}
    <Grid item xs={12}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey="6LdgfAcqAAAAAPo3Hcv2mwn8HitRV7Sp6fZLqh3U"
        size="invisible"
        onChange={(value) => setCapKey(value)}
      />
    </Grid>

    {/* Submit Button */}
    <Grid item xs={3}>
      <Button
        type="submit"
        className="button-font"
        variant="contained"
        fullWidth
        sx={{
          borderRadius: "12px",
          py: 1,
          backgroundColor: loading ? "#4B0082" : "#800080",
          "&:hover": {
            backgroundColor: loading ? "#4B0082" : "#4B0082",
          },
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Send Message"}
      </Button>
    </Grid>
  </Grid>
</form>

            </div>
          </div>
        </div>
      </section>
      {/* <ToastContainer /> */}
    </>
  );
}
