"use client";

import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";


const StepForm = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    phone: "",
    email: "",
    eventDate: "",
    rentalDuration: "",
    package: "",
    occasion: "",
    startTime: "",
    endTime: "",
  });

  const nextStep = () => {
    setStep(step + 1);
  }

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;

  const mutation = `mutation create {
  createGetQuotes(input: {Duration: "${formData.rentalDuration}", Email: "${formData.email}", EventDate: "${formattedDate}", EventEndTime: "${formData.startTime}", EventStartTime: "${formData.endTime}", FirstName: "${formData.firstName}", LastName: "${formData.lastName}", Occasion: "${formData.occasion}", TypeOfRental: "${formData.packageName}"}) {
   Duration
   Email
   EventDate
   EventEndTime
   EventStartTime
   FirstName
   Id
   LastName
   Occasion
   TypeOfRental
 }
};
`; 
    const requestBody = {
      query: mutation,
    };

    const headers = {
      "x-api-key":  process.env.NEXT_PUBLIC_X_API_KEY, // Replace with your actual API key
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    try {
      const res = await axios.post(endPoint, requestBody, { headers });
      if (res.data.errors) {
        const errorMessage = res.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Saved successfully");

        setFormData({ name: "", email: "", message: "" });
        router.push("/thankyou");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Error saving data");
    }
  };

  switch (step) {
    case 1:
      return (
        <Step1
          nextStep={nextStep}
          handleChange={handleChange}
          values={formData}
        />
      );
    case 2:
      return (
        <Step2
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          values={formData}
        />
      );
    case 3:
      return (
        <Step3
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
        />
      );
    case 4:
      return (
        <Step4
          prevStep={prevStep}
          handleChange={handleChange}
          handleSubmit={(e) => handleSubmit(e)}
        />
      );
    default:
      return <div />;
  }
};

export default StepForm;
