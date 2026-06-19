"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useKeyDown } from "../../hook/useKeyDown";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { DataContext } from "../../context/useOrderDetails";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // For using Dayjs

const steps = ["Personal Details", "Event Details", "Address & Payment"];
export default function QuoteForm() {
  const searchParams = useSearchParams();
  const { setSharedData } = useContext(DataContext);
  const title = searchParams.get("title");
  const duration = searchParams.get("rentalDuration");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [packageName, setPackageName] = useState(`${title}` || "");
  const [additionalHours, setAdditionalHours] = useState("");
  const [startTime, setStartTime] = useState("");
  const [rentalDuration, setRentalDuration] = useState(`${duration}` || "");
  const [addOns, setAddOns] = useState([]);
  const [addOnsName, setAddOnsName] = useState([]);

  const [packageList, setPackageList] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [estimateAmount, setEstimateAmount] = useState(0);
  // const [email, setEmail] = useState(null);
  const [occasion, setOccasion] = useState("");
  // const [date, setDate] = useState(dayjs().format("MM-DD-YYYY"));
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      PhoneNo: "",
      email: "",
      packageName: title || "",
      occasion: "",
      rentalDuration: duration || "",
      day: "",
      month: "",
      year: "",
      startTime: "",
      endTime: "",
      address: "",
      doorNo: "",
      countryName: "",
      cityname: "",
      postalCode: "",
      pricing: "",
      state: "",
      billAmount: "",
      additionalHours: "",
    },
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail =
        typeof window !== undefined && localStorage.getItem("userEmail");
      setValue("email", userEmail);
    }
  }, []);

  const fetchAddOns = () => {
    const query = `
      query list {
  listAddOns {
    Totalcount
    items {
      Description
      Image
      Name
      Status
      id
      Price
    }
  }
}
    `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listAddOns?.items || [];

        setAddOns(userDetails);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const fetchOccasions = () => {
    const query = `
      query MyQuery {
  listOccations {
    items {
      Occation
      Status
      UID
    }
  }
}
    `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listOccations?.items || [];

        setOccasion(userDetails);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const fetchPackages = () => {
    const query = `
      query MyQuery {
  listPackages {
    items {
      Content
      Hours
      PackageName
      Price
      Status
      UID
    }
  }
}
    `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listPackages?.items || [];
        setPackageList(userDetails);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // Check if the function has already been called
    if (!hasSubmitted.current) {
      fetchAddOns();
      fetchPackages();
      fetchOccasions();
      hasSubmitted.current = true;
    }
  }, []);

  useKeyDown(() => {
    handleSubmit(onSubmit)();
  }, ["Enter"]);
  function calculateTotalCost(packageName, additionalHours) {
    const prices = packageList.find(
      (item) => item?.PackageName === packageName
    );
    const basePrice = prices?.Price;

    const additionalHourCost = 100;
    // const basePrice = basePrices[packageName] || 0;
    const totalCost =
      basePrice + (parseInt(additionalHours) || 0) * additionalHourCost;
    return totalCost;
  }
  // 29-09-2024
  const onSubmit = async (data) => {
    setLoading(true);
    if (activeStep === steps.length - 1) {
      const {
        firstName,
        lastName,
        PhoneNo,
        startTime,
        endTime,
        address,
        pricing,
        postalCode,
        countryName,
        state,
        cityname,
        doorNo,
        billAmount,
        packageName,
        email,
        occasion,
        additionalHours,
        date,
      } = data;
      const durationNumber = rentalDuration.match(/\d+/);

      // Convert the extracted value to a number
      const number = durationNumber ? Number(durationNumber[0]) : null;
      const duration = Number(number) + Number(additionalHours);
      // const [year, month, day] = date.split("-");
      // const formattedDate = `${month}-${day}-${year}`;
      const formattedDate = date;
      const currentDate = new Date();
      const days = String(currentDate.getDate()).padStart(2, "0");
      const months = String(currentDate.getMonth() + 1).padStart(2, "0");
      const years = currentDate.getFullYear();
      let hours = currentDate.getHours();
      const minutes = String(currentDate.getMinutes()).padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";

      hours = hours % 12 || 12;
      const formattedHours = String(hours).padStart(2, "0");
      const time = `${formattedHours}:${minutes} ${period}`;
      const today = `${months}-${days}-${years}${" "} ${time}`;

      try {
        // const amount = calculateTotalCost(packageName, additionalHours);
        const orderDetails = {
          firstName,
          lastName,
          PhoneNo,
          startTime,
          endTime,
          address,
          pricing: estimateAmount,
          postalCode,
          countryName,
          state,
          cityname,
          doorNo,
          billAmount,
          packageName,
          email,
          occasion,
          additionalHours,
          date,
          duration,
          today,
          formattedDate,
          addOns: addOnsName,
        };
        setSharedData(orderDetails);
        setLoading(false);
        router.push(`/payment`);
      } catch (err) {
        console.error("Error processing payment:", err);
        toast.error("Error processing payment.");
      } finally {
        // setLoading(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateEndTime = (startTime, rentalDuration, additionalHours) => {
    if (!startTime || !rentalDuration) return "";

    const [hours, minutes] = startTime.split(":").map(Number);
    const baseDurationHours = parseInt(rentalDuration.split(" ")[0], 10);
    const totalHours = baseDurationHours + (parseInt(additionalHours, 10) || 0);
    const endTime = new Date();

    endTime.setHours(hours + totalHours, minutes);

    return endTime.toTimeString().slice(0, 5);
  };
  const addditonalhours = [
    { hours: "1hours", value: 1 },
    { hours: "2hours", value: 2 },
    { hours: "3hours", value: 3 },
    { hours: "4hours", value: 4 },
    { hours: "5hours", value: 5 },
    { hours: "6hours", value: 6 },
    { hours: "7hours", value: 7 },
    { hours: "8hours", value: 8 },
    { hours: "9hours", value: 9 },
    { hours: "10hours", value: 10 },
    { hours: "11hours", value: 11 },
    { hours: "12hours", value: 12 },
    { hours: "13hours", value: 13 },
    { hours: "14hours", value: 14 },
    { hours: "15hours", value: 15 },
    { hours: "16hours", value: 16 },
    { hours: "17hours", value: 17 },
    { hours: "18hours", value: 18 },
    { hours: "19hours", value: 19 },
    { hours: "20hours", value: 20 },
    { hours: "21hours", value: 21 },
    { hours: "22hours", value: 22 },
    { hours: "23hours", value: 23 },
    { hours: "24hours", value: 24 },
  ];

  useEffect(() => {
    if (startTime && rentalDuration && typeof additionalHours !== "undefined") {
      const endTime = calculateEndTime(
        startTime,
        rentalDuration,
        additionalHours
      );
      setValue("endTime", endTime);
    }
  }, [startTime, rentalDuration, setValue, additionalHours]);

  useEffect(() => {
    const selectedPackage = packageList.find(
      (pkg) => pkg.PackageName === packageName
    );
    const baseDuration = selectedPackage ? selectedPackage.Hours : "";
    if (additionalHours) {
      const totalHours = parseInt(baseDuration, 10) + additionalHours;
      setRentalDuration(`${totalHours} hours`);
    } else {
      setRentalDuration(baseDuration ? `${baseDuration} hours` : "");
    }
  }, [packageName, additionalHours, packageList]);

  const today = dayjs();
  const minDates = today.format("YYYY-MM-DD");
  // const commonStyle = {
  //   // "& .MuiInputLabel-root": { color: "purple", fontSize: "12px", fontWeight: 600 },
  //   "& .MuiInputBase-root": {
  //     "& fieldset": { borderColor: "purple" },
  //   },
  //   "& .MuiInputBase-root.Mui-focused": {
  //     "& fieldset": { borderColor: "purple" },
  //   },
  //   "& .MuiInputBase-input": {
  //     color: "purple",
  //   },
  //   "& .MuiInputBase-input:focus": {
  //     color: "purple",
  //   },
  //   "& .MuiInputLabel-root.Mui-focused": {
  //     color: "purple",
  //   },
  //   "& .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple",
  //   },
  //   "&:hover .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple",
  //   },
  //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple",
  //   },
  //   "& .MuiSelect-icon": {
  //     color: "purple",
  //   },
  //   "& .MuiInputBase-input": {
  //     color: "purple",
  //   },
  // };
  const commonStyles = {
    "& .MuiInputLabel-root": {
      color: "purple", // Set the label color to purple
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "purple", // Ensure the label stays purple when focused
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px", // Adjust the border radius
      "&.Mui-focused fieldset": {
        borderColor: "purple", // Change the border color to purple when focused
      },
    },
  };

  useEffect(() => {
    // Calculate the base cost from the package and additional hours
    const baseCost = calculateTotalCost(packageName, additionalHours);

    // Calculate the total add-on cost
    const addOnCost = selectedAddOns.reduce(
      (total, addOn) => total + Number(addOn.Price),
      0
    );

    // Ensure baseCost is a number, and then sum it with the addOnCost
    const totalEstimate = Number(baseCost) + addOnCost;

    // Update the state with the total estimate amount
    if (totalEstimate) {
      setEstimateAmount(totalEstimate);
    }
  }, [packageName, additionalHours, selectedAddOns]);

  // const handleAddOnChange = (addOnItem) => {
  //   setSelectedAddOns((prev) => {
  //     const isAlreadySelected = prev.some((item) => item.id === addOnItem.id);
  //     if (isAlreadySelected) {
  //       return prev.filter((item) => item.id !== addOnItem.id);
  //     } else {
  //       return [...prev, addOnItem];
  //     }
  //   });
  // };
  const handleAddOnChange = (addOnItem) => {
    setSelectedAddOns((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === addOnItem.id);
      const updatedAddOns = isAlreadySelected
        ? prev.filter((item) => item.id !== addOnItem.id)
        : [...prev, addOnItem];

      // Extracting Names and joining them into a string
      const selectedNames = updatedAddOns.map((item) => item.Name).join(", ");

      // Storing the selected names in another state (setAddOns)
      setAddOnsName(selectedNames);

      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== addOnItem.id);
      } else {
        return [...prev, addOnItem];
      }
    });
  };

  return (
    <div className="form-page__content">
      <div
        className="container"
        style={{
          marginTop: "150px",
          height: activeStep === 1 ? "130vh" : "100vh",
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepIcon-root": {
              color: "purple",
            },
            "& .MuiStepIcon-active": {
              color: "white !important",
            },
            "& .MuiStepIcon-completed": {
              color: "white !important",
            },
            "& .MuiStepIcon-text": {
              fill: "white !important",
            },
            "& .MuiStepIcon-root": {
              color: "purple !important",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            marginTop: "30px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <h5 style={{ textAlign: "center" }}>Reserve Your Spot Now</h5>
            <p style={{ textAlign: "center" }}>
              {" "}
              Claim your spot today and be sure you don't miss out!{" "}
            </p>
            {activeStep === 0 && (
              <div className="step-content">
                <div
                  className="form-group"
                  style={{ display: "flex", gap: "16px" }}
                >
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{
                      required: "First Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "First Name should only contain letters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        size="small"
                        error={!!errors.firstName}
                        helperText={
                          errors.firstName ? errors.firstName.message : ""
                        }
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(e);

                          if (!/^[a-zA-Z\s]*$/.test(value)) {
                            setError("firstName", {
                              type: "manual",
                              message: "First Name should only contain letters",
                            });
                          } else {
                            clearErrors("firstName");
                          }

                          e.target.value = value
                            .split(" ")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ");
                        }}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.firstName ? "red" : "inherit",
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="lastName"
                    control={control}
                    rules={{
                      required: "Last Name is required",
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Last Name should only contain letters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        size="small"
                        error={!!errors.lastName}
                        helperText={
                          errors.lastName ? errors.lastName.message : ""
                        }
                        required
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(e);

                          if (!/^[a-zA-Z\s]*$/.test(value)) {
                            setError("lastName", {
                              type: "manual",
                              message: "Last Name should only contain letters",
                            });
                          } else {
                            clearErrors("lastName");
                          }

                          e.target.value = value
                            .split(" ")
                            .map((word) =>
                              word
                                ? word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                                : ""
                            )
                            .join(" ");
                        }}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.lastName ? "red" : "inherit",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="form-group">
                  <Controller
                    name="PhoneNo"
                    control={control}
                    rules={{
                      required: "Phone Number is required",
                      validate: {
                        isValidPhoneNumber: (value) => {
                          const cleanedValue = value.replace(/-/g, "");
                          if (/\D/.test(cleanedValue)) {
                            return "Phone Number should only contain numbers";
                          }
                          if (cleanedValue.length !== 10) {
                            return "Phone Number must be exactly 10 digits";
                          }
                          return true;
                        },
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        size="small"
                        error={!!errors.PhoneNo}
                        helperText={
                          errors.PhoneNo ? errors.PhoneNo.message : ""
                        }
                        required
                        onChange={(e) => {
                          field.onChange(e);
                          const cleanedValue = e.target.value.replace(/-/g, "");
                          if (/\D/.test(cleanedValue)) {
                            setError("PhoneNo", {
                              type: "manual",
                              message:
                                "Phone Number should only contain numbers",
                            });
                          } else if (cleanedValue.length > 10) {
                            setError("PhoneNo", {
                              type: "manual",
                              message: "Phone Number must be exactly 10 digits",
                            });
                          } else {
                            clearErrors("PhoneNo");
                          }
                        }}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.PhoneNo ? "red" : "inherit",
                          },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="form-group">
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      validate: {
                        isValidEmail: (value) => {
                          // if (/^[0-9]/.test(value)) {
                          //   return "Email should not start with a number";
                          // }

                          if (
                            !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
                              value
                            )
                          ) {
                            return "Invalid email format";
                          }

                          return true;
                        },
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                        required
                        InputProps={{
                          readOnly: true,
                        }}
                        onChange={(e) => {
                          const formattedValue = e.target.value.replace(
                            /[^a-zA-Z0-9@._%+-]/g,
                            ""
                          );
                          field.onChange(formattedValue);

                          // if (/^[0-9]/.test(formattedValue)) {
                          //   setError("email", {
                          //     type: "manual",
                          //     message: "Email should not start with a number",
                          //   });
                          // }
                          if (
                            !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(
                              formattedValue
                            )
                          ) {
                            setError("email", {
                              type: "manual",
                              message: "Invalid email format",
                            });
                          } else {
                            clearErrors("email");
                          }
                        }}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.email ? "red" : "inherit",
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="step-content">
                <div style={{ display: "flex", gap: "16px" }}>
                  <Controller
                    name="packageName"
                    control={control}
                    rules={{ required: "Package Name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.packageName ? "red" : "inherit",
                          },
                        }}
                        label="Package Name"
                        select
                        size="small"
                        fullWidth
                        error={!!errors.packageName}
                        helperText={
                          errors.packageName ? errors.packageName.message : ""
                        }
                        required
                        onChange={(e) => {
                          field.onChange(e);
                          setPackageName(e.target.value);
                        }}
                      >
                        {packageList.map((item, index) => (
                          <MenuItem key={index} value={item.PackageName}>
                            {item.PackageName}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                  <Controller
                    name="occasion"
                    control={control}
                    rules={{ required: "Occasion is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        sx={{
                          ...commonStyles,
                          "& .MuiFormHelperText-root": {
                            color: errors.occasion ? "red" : "inherit",
                          },
                        }}
                        label="Occasion"
                        select
                        size="small"
                        fullWidth
                        error={!!errors.occasion}
                        helperText={
                          errors.occasion ? errors.occasion.message : ""
                        }
                        required
                      >
                        {occasion.map((item, index) => (
                          <MenuItem key={index} value={item.Occation}>
                            {item.Occation}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <TextField
                    value={rentalDuration}
                    label="Rental Duration"
                    sx={{
                      ...commonStyles,
                    }}
                    size="small"
                    fullWidth
                    disabled
                  />
                  <Controller
                    name="additionalHours"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        disabled={rentalDuration === ""}
                        {...field}
                        sx={{
                          "& .MuiInputLabel-root": { color: "purple" },
                          "& .MuiInputBase-root": {
                            "& fieldset": { borderColor: "purple" },
                          },
                          "& .MuiInputBase-root.Mui-focused": {
                            "& fieldset": { borderColor: "purple" },
                          },
                          "& .MuiInputBase-input": {
                            color: "purple",
                          },
                          "& .MuiInputBase-input:focus": {
                            color: "black",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "purple",
                          },
                        }}
                        label="AdditionalHours"
                        select
                        size="small"
                        fullWidth
                        value={additionalHours}
                        error={!!errors.additionalHours}
                        helperText={
                          errors.additionalHours
                            ? errors.additionalHours.message
                            : ""
                        }
                        onChange={(e) => {
                          field.onChange(e);
                          setAdditionalHours(e.target.value);
                        }}
                        required
                      >
                        {addditonalhours.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.hours}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} marginTop={0.75}>
                    <Controller
                      name="startTime"
                      control={control}
                      rules={{ required: "Start Time is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Start Time"
                          type="time"
                          fullWidth
                          size="small"
                          error={!!errors.startTime}
                          helperText={
                            errors.startTime ? errors.startTime.message : ""
                          }
                          required
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            setStartTime(e.target.value);
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} marginTop={0.75}>
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="End Time"
                          type="time"
                          fullWidth
                          size="small"
                          error={!!errors.endTime}
                          helperText={
                            errors.endTime ? errors.endTime.message : ""
                          }
                          required
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ readOnly: true }} // Makes the end time field read-only
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Controller
                      name="date"
                      control={control}
                      defaultValue={null}
                      rules={{ required: "Event Date is required" }}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Event Date"
                            value={value ? dayjs(value, "MM-DD-YYYY") : null}
                            onChange={(newValue) => {
                              onChange(
                                newValue ? newValue.format("MM-DD-YYYY") : null
                              ); // Set the value in the required format
                            }}
                            onBlur={onBlur}
                            minDate={dayjs()} // Restrict the dates to today and future
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!error,
                                helperText: error ? error.message : "",
                                sx: {
                                  ...commonStyles,
                                  "& .MuiInputBase-input": {
                                    padding: "4px", // Reduce the padding
                                    fontSize: "12px", // Adjust the font size
                                    height: "10px", // Adjust the height if needed
                                    color: "black",
                                  },
                                  "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                                  
                                  "& .MuiOutlinedInput-root": {
                                    minHeight: "30px", // Adjust the overall height
                                  },
                                  "& .MuiInputLabel-root": {
                                    fontSize: "12px", // Reduce the label font size
                                    color: "purple",
                                  },
                                },
                              },
                            }}
                          />
                        </LocalizationProvider>
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <label>Add-Ons</label>
                  <FormControl component="fieldset">
                    <FormGroup>
                      <Box
                        sx={{
                          maxHeight: 200,
                          overflowY: "auto",
                          border: "1px solid #ddd",
                          padding: 2,
                        }}
                      >
                        <Grid container spacing={1}>
                          {addOns.map((addOnItem) => (
                            <Grid item xs={12} key={addOnItem.id}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={() =>
                                      handleAddOnChange(addOnItem)
                                    }
                                    checked={selectedAddOns.some(
                                      (item) => item.id === addOnItem.id
                                    )}
                                  />
                                }
                                label={
                                  <span
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={addOnItem.Image}
                                      alt=""
                                      style={{
                                        marginRight: 8,
                                        width: 50,
                                        height: 50,
                                      }}
                                    />{" "}
                                    {addOnItem.Name} - {"$"}
                                    {addOnItem.Price}
                                  </span>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </FormGroup>
                  </FormControl>
                </Grid>
              </div>
            )}

            {activeStep === 2 && (
              <div className="step-content">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="doorNo"
                      control={control}
                      rules={{ required: "Door No is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Door No"
                          type="text"
                          fullWidth
                          size="small"
                          error={!!errors.doorNo}
                          helperText={
                            errors.doorNo ? errors.doorNo.message : ""
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            ...commonStyles,
                            "& .MuiFormHelperText-root": {
                              color: errors.doorNo ? "red" : "inherit",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <Controller
                      name="address"
                      control={control}
                      rules={{
                        required: "Address is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Address"
                          fullWidth
                          size="small"
                          error={!!errors.address}
                          helperText={
                            errors.address ? errors.address.message : ""
                          }
                          sx={{
                            ...commonStyles,
                            "& .MuiFormHelperText-root": {
                              color: errors.address ? "red" : "inherit",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="state"
                      control={control}
                      rules={{
                        required: "State is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="State"
                          fullWidth
                          size="small"
                          error={!!errors.state}
                          helperText={errors.state ? errors.state.message : ""}
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="cityname"
                      control={control}
                      rules={{
                        required: "City Name is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="City Name"
                          fullWidth
                          size="small"
                          error={!!errors.cityname}
                          helperText={
                            errors.cityname ? errors.cityname.message : ""
                          }
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="countryName"
                      control={control}
                      rules={{
                        required: "Country Name is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Country Name"
                          fullWidth
                          size="small"
                          error={!!errors.countryName}
                          helperText={
                            errors.countryName ? errors.countryName.message : ""
                          }
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="postalCode"
                      control={control}
                      rules={{
                        required: "Postal Code is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Postal Code"
                          fullWidth
                          size="small"
                          error={!!errors.postalCode}
                          helperText={
                            errors.postalCode ? errors.postalCode.message : ""
                          }
                          onInput={(e) => {
                            // Allow only numbers
                            e.target.value = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                          sx={{
                            "& .MuiInputLabel-root": { color: "purple" },
                            "& .MuiInputBase-root": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-root.Mui-focused": {
                              "& fieldset": { borderColor: "purple" },
                            },
                            "& .MuiInputBase-input": {
                              color: "black",
                            },
                            "& .MuiInputBase-input:focus": {
                              color: "purple",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                              color: "purple",
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </div>
            )}

            <div className="button-group">
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "purple",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#E0E0E0",
                      color: "purple",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Back
                </Button>
              )}
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={async () => {
                    const isStepValid = await trigger(); // Trigger validation for all fields

                    if (isStepValid) {
                      handleNext(); // Proceed to next step if validation passes
                    }
                  }}
                  variant="contained"
                  sx={{
                    mt: 3,
                    backgroundColor: "purple",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#E0E0E0",
                      color: "purple",
                      fontWeight: "bold",
                    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 3,
                      ml: 2,
                      backgroundColor: "purple",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#E0E0E0",
                        color: "purple",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {loading ? <CircularProgress /> : "Book Now"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
        <div
          style={{
            backgroundColor: "#800080",
            display: "flex",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <div style={{ color: "white", fontSize: "18px" }}>
            Estimated Amount: {"$"} {estimateAmount}.00
          </div>
        </div>
        {/* <ToastContainer /> */}
      </div>
    </div>
  );
}
