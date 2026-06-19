import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Stack,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import toast from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Select, FormControl, InputLabel } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"; // For using Dayjs

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "purple", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "purple", // Focused border color
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "purple", // Focused text color
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          "&.Mui-focused": {
            borderColor: "purple", // Focused border color for Select
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        outlined: {
          "&.Mui-focused": {
            borderColor: "purple", // Focused border color for Select
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "purple", // Submit button background color
          "&:hover": {
            backgroundColor: "purple", // Adjust hover color if needed
          },
        },
      },
    },
  },
});

const QuoteModal = ({ open, handleClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [packageName, setPackageName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [date, setDate] = useState("");
  const [additionalHours, setAdditionalHours] = React.useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [packageList, setPackageList] = useState([]);
  const [occasions, setOccasions] = useState([]);

  const router = useRouter();
  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!email) newErrors.email = "Email is required";
    if (!occasion) newErrors.occasion = "Occasion is required";
    // if (!startTime) newErrors.startTime = "Start time is required";
    // if (!endTime) newErrors.endTime = "End time is required";
    // if (!date) newErrors.date = "Date is required";
    // if (!selectedDate) newErrors.selectedDate = "Date is required";

    // if (!packageName) newErrors.packageName = "packageName is required";
    // if (!rentalDuration)
    //   newErrors.rentalDuration = "RentalDuration is required";
    // if (!additionalHours)
    //   newErrors.additionalHours = "AdditionalHours is required";

    return newErrors;
  };
  const handleSubmit = async () => {
    // alert("hi");
    // alert(selectedDate)
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setLoading(true); // Start loading
    setSuccessOpen(false); // Close success message

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
    const today = `${months}-${days}-${years}${" "}${time}`;

    // const dateObj = new Date(date);
    const dateObj = new Date(selectedDate);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    // const formattedDate = `${month}-${day}-${year}`;
    const formattedDate = dateObj ? `${month}-${day}-${year}` : "";

    const mutation = `
      mutation create {
        createGetQuotes(input: {
          Duration: "${rentalDuration}",
          Email: "${email}",
          EventDate: "${formattedDate}",
          EventEndTime: "${endTime}",
          EventStartTime: "${startTime}",
          FirstName: "${firstName}",
          LastName: "${lastName}",
          Occasion: "${occasion}",
          TypeOfRental: "${packageName}",
          OrderDate: "${today}",
          PhoneNumber: "${phone}",
          AdditionalHours: "${additionalHours}"
        }) {
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
          OrderDate
          PhoneNumber
          AdditionalHours
        }
      }
    `;
    const requestBody = { query: mutation };

    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };

    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await axios.post(endPoint, requestBody, { headers });
      if (res.data.errors) {
        const errorMessage = res.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Saved successfully");
        setSuccessMessage("Quote submitted successfully!");
        setSuccessOpen(true);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setOccasion("");
        setRentalDuration("");
        setPackageName("");
        setStartTime("");
        setEndTime("");
        setAdditionalHours("");
        setSelectedDate("");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      toast.error("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const currentDay = new Date().getDate();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const [year, setYear] = useState(currentYear);

  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);

  const getDaysInMonth = (monthIndex, year) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const daysInSelectedMonth = month ? getDaysInMonth(month - 1, year) : 0;

  const days =
    year === currentYear && month === currentMonthIndex + 1
      ? Array.from(
          { length: daysInSelectedMonth - (currentDay - 1) },
          (_, i) => i + currentDay
        )
      : Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (day > daysInSelectedMonth) {
      setDay(daysInSelectedMonth);
    }
  }, [month, year, daysInSelectedMonth]);

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
    { hours: "1 hours", value: 1 },
    { hours: "2 hours", value: 2 },
    { hours: "3 hours", value: 3 },
    { hours: "4 hours", value: 4 },
    { hours: "5 hours", value: 5 },
    { hours: "6 hours", value: 6 },
    { hours: "7 hours", value: 7 },
    { hours: "8 hours", value: 8 },
    { hours: "9 hours", value: 9 },
    { hours: "10 hours", value: 10 },
    { hours: "11 hours", value: 11 },
    { hours: "12 hours", value: 12 },
    { hours: "13 hours", value: 13 },
    { hours: "14 hours", value: 14 },
    { hours: "15 hours", value: 15 },
    { hours: "16 hours", value: 16 },
    { hours: "17 hours", value: 17 },
    { hours: "18 hours", value: 18 },
    { hours: "19 hours", value: 19 },
    { hours: "20 hours", value: 20 },
    { hours: "21 hours", value: 21 },
    { hours: "22 hours", value: 22 },
    { hours: "23 hours", value: 23 },
    { hours: "24 hours", value: 24 },
  ];

  // useEffect(() => {
  //   if (startTime && rentalDuration && typeof additionalHours !== "undefined") {
  //     const endTime = calculateEndTime(
  //       startTime,
  //       rentalDuration,
  //       additionalHours
  //     );
  //     setEndTime(endTime);
  //   }
  // }, [startTime, rentalDuration, setEndTime, additionalHours]);
  //   useEffect(() => {
  //     let baseDuration = "";
  // // alert(packageName)
  // // if(packageName.replace(/\s+/g, '') === "Atlantis" || packageName.replace(/\s+/g, '') === "Tourist" || packageName.replace(/\s+/g, '') === "Celestial"){
  // //   alert("1")
  // // }
  // const packageInitials = packageName.replace(/\s+/g, '').slice(0, 2).toLowerCase();
  //     switch (packageInitials) {
  //       case "at":
  //         baseDuration = "4 hours";
  //         break;
  //       case "to":
  //         baseDuration = "3 hours";
  //         break;
  //       case "ce":
  //         baseDuration = "5 hours";
  //         break;
  //       default:
  //         baseDuration = "";
  //     }
  //     if(baseDuration){

  //     }
  //     if (additionalHours) {

  //       const totalHours = parseInt(baseDuration, 10);
  //       setRentalDuration(`${totalHours}`);
  //     } else {
  //       setRentalDuration(baseDuration);
  //     }
  //   }, [packageName, additionalHours]);

  const commonStyle = {
    // "& .MuiInputLabel-root": { color: "purple", fontSize: "12px", fontWeight: 600 },
    // "& .MuiInputBase-root": {
    //   "& fieldset": { borderColor: "purple" },
    // },
    // "& .MuiInputBase-root.Mui-focused": {
    //   "& fieldset": { borderColor: "purple" },
    // },
    // "& .MuiInputBase-input": {
    //   color: "purple",
    // },
    // "& .MuiInputBase-input:focus": {
    //   color: "purple",
    // },
    // "& .MuiInputLabel-root.Mui-focused": {
    //   color: "purple",
    // },
    // "& .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "purple",
    // },
    // "&:hover .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "purple",
    // },
    // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //   borderColor: "purple",
    // },
    // "& .MuiSelect-icon": {
    //   color: "purple",
    // },
    // "& .MuiInputBase-input": {
    //   color: "purple",
    // },
  };
  const today = dayjs();
  const minDate = today.format("YYYY-MM-DD");
  const formatDateToMMDDYYYY = (date) => {
    return dayjs(date).format("MM/DD/YYYY");
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

        setOccasions(userDetails);
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
      // fetchAddOns();
      fetchPackages();
      fetchOccasions();
      hasSubmitted.current = true;
    }
  }, []);
  const formatToMMDDYYYY = (date) => {
    const parsedDate = dayjs(date);
    return parsedDate.isValid() ? parsedDate.format("MM/DD/YYYY") : "";
  };

  // Handle date change when selected from DatePicker
  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = formatToMMDDYYYY(newValue);
      setSelectedDate(formattedDate);
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedDate: "",
      }));
    } else {
      setSelectedDate("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedDate: "Invalid date",
      }));
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setSuccessMessage("");
            setFirstName("");
            setLastName("");
            setPhone("");
            setEmail("");
            setOccasion("");
            setRentalDuration("");
            setMonth("");
            setDay("");
            setYear("");
            setStartTime("");
            setEndTime("");
            setPackageName("");
            setAdditionalHours("");
            setSelectedDate("");
            setErrors({
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              occasion: "",
              rentalDuration: "",
              month: "",
              day: "",
              year: "",
              startTime: "",
              endTime: "",
              packageName: "",
            });
            handleClose();
          }
        }}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "60vw",
            maxHeight: "90vh",
            paddingX: 3,
            backgroundColor: "#ebe8fc",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DialogTitle style={{ color: "purple", textAlign: "center" }}>
            Request a Quote
          </DialogTitle>
          <DialogActions>
            <IconButton
              style={{ color: "purple" }}
              onClick={() => {
                setSuccessMessage("");
                setFirstName("");
                setLastName("");
                setPhone("");
                setEmail("");
                setOccasion("");
                setRentalDuration("");
                setMonth("");
                setDay("");
                setYear("");
                setStartTime("");
                setEndTime("");
                setPackageName("");
                setAdditionalHours("");
                setSelectedDate("");
                setErrors({
                  firstName: "",
                  lastName: "",
                  phone: "",
                  email: "",
                  occasion: "",
                  rentalDuration: "",
                  month: "",
                  day: "",
                  year: "",
                  startTime: "",
                  endTime: "",
                  packageName: "",
                });
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </Stack>
        <DialogContent sx={{ backgroundColor: "primary" }}>
          {loading ? (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <CircularProgress />
              <Typography>Submitting your request...</Typography>
            </Stack>
          ) : successMessage ? (
            <Stack
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Typography variant="h6" color="green">
                {successMessage}
              </Typography>
            </Stack>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    fullWidth
                    margin="dense"
                    label="First Name"
                    required
                    size="small"
                    value={firstName}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Regex to allow only letters (both lowercase and uppercase)
                      const lettersOnly = value.replace(/[^a-zA-Z]/g, "");

                      // Capitalize the first letter
                      const capitalizedValue =
                        lettersOnly.charAt(0).toUpperCase() +
                        lettersOnly.slice(1);

                      setFirstName(capitalizedValue);

                      // Clear the error if the user starts typing
                      if (errors.firstName) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          firstName: "",
                        }));
                      }
                    }}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    fullWidth
                    margin="dense"
                    label="Last Name"
                    required
                    size="small"
                    value={lastName}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Regex to allow only letters (both lowercase and uppercase)
                      const lettersOnly = value.replace(/[^a-zA-Z]/g, "");

                      // Capitalize the first letter
                      const capitalizedValue =
                        lettersOnly.charAt(0).toUpperCase() +
                        lettersOnly.slice(1);

                      setLastName(capitalizedValue);

                      if (errors.lastName) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          lastName: "",
                        }));
                      }
                    }}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    fullWidth
                    margin="dense"
                    label="Phone"
                    required
                    size="small"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;

                      const numericValue = value.replace(/\D/g, "");

                      if (numericValue.length <= 10) {
                        setPhone(numericValue);
                        if (numericValue.length === 10) {
                          setErrors((prevErrors) => ({
                            ...prevErrors,
                            phone: "",
                          }));
                        }
                      }
                    }}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    fullWidth
                    margin="dense"
                    label="Email"
                    required
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEmail(value);

                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          email: "Invalid email format",
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          email: "",
                        }));
                      }
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    select
                    fullWidth
                    margin="dense"
                    label="What's the occasion?"
                    required
                    size="small"
                    value={occasion}
                    onChange={(e) => {
                      setOccasion(e.target.value);
                      if (e.target.value) {
                        setErrors({ ...errors, occasion: "" });
                      }
                    }}
                    error={!!errors.occasion}
                    helperText={errors.occasion}
                  >
                    {/* <MenuItem value="Birthday">Birthday</MenuItem>
                    <MenuItem value="Wedding">Wedding</MenuItem>
                    <MenuItem value="Corporate Event">Corporate Event</MenuItem>
                    <MenuItem value="School">School</MenuItem>
                    <MenuItem value=" Holidays">Holidays</MenuItem> */}
                    {/* <MenuItem value="">None</MenuItem> */}

                    {occasions.map((item, index) => (
                      <MenuItem key={index} value={item.Occation}>
                        {item.Occation}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    sx={commonStyle}
                    select
                    fullWidth
                    margin="dense"
                    label="Package"
                    size="small"
                    value={packageName}
                    onChange={(e) => {
                      setPackageName(e.target.value);
                      if (e.target.value) {
                        setErrors({ ...errors, packageName: "" });
                      }
                    }}
                    error={!!errors.packageName}
                    helperText={errors.packageName}
                  >
                    {/* <MenuItem value="Tourist">Tourist</MenuItem>
                    <MenuItem value="Atlantis">Atlantis</MenuItem>
                    <MenuItem value="Celestial">Celestial</MenuItem> */}
                    {/* <MenuItem value="">None</MenuItem> */}
                    {packageList.map((item, index) => (
                      <MenuItem key={index} value={item.PackageName}>
                        {item.PackageName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <FormControl
                  fullWidth
                  size="small"
                  error={!!errors.rentalDuration}
                >
                  <InputLabel id="rental-duration-label">
                    Rental Duration
                  </InputLabel>
                  <Select
                    labelId="rental-duration-label"
                    label="Rental Duration"
                    sx={commonStyle}
                    value={rentalDuration}
                    onChange={(e) => setRentalDuration(e.target.value)}
                  >
                    <MenuItem value={3}>3 hrs</MenuItem>
                    <MenuItem value={4}>4 hrs</MenuItem>
                    <MenuItem value={5}>5 hrs</MenuItem>
                    <MenuItem value={6}>6 hrs</MenuItem>
                  </Select>
                  {errors.rentalDuration && (
                    <FormHelperText>{errors.rentalDuration}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  // disabled={rentalDuration === ""}
                  InputProps={{
                    readOnly: rentalDuration === "" ? true : false,
                  }}
                  sx={commonStyle}
                  label="Additional Hours"
                  select
                  size="small"
                  fullWidth
                  value={additionalHours}
                  error={!!errors.additionalHours}
                  helperText={
                    errors.additionalHours ? errors.additionalHours.message : ""
                  }
                  onChange={(e) => {
                    setAdditionalHours(e.target.value);
                  }}
                >
                  {addditonalhours.map((item, index) => (
                    <MenuItem key={index} value={item.value}>
                      {item.hours}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* <DatePicker
                      label="Event Date"
                      value={
                        selectedDate ? dayjs(selectedDate, "MM/DD/YYYY") : null
                      }
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            ...commonStyle,
                            "& .MuiInputBase-input": {
                              padding: "4px", // Reduce the padding
                              fontSize: "12px", // Adjust the font size
                              height: "10px", // Adjust the height if needed
                            },
                            "& .MuiOutlinedInput-root": {
                              minHeight: "30px", // Adjust the overall height
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "12px", // Reduce the label font size
                            },
                          }}
                          fullWidth
                          error={!!errors.selectedDate}
                          helperText={
                            errors.selectedDate ? errors.selectedDate : ""
                          }
                        />
                      )}
                    /> */}
                    <DatePicker
                      label="Event Date"
                      value={
                        selectedDate ? dayjs(selectedDate, "MM/DD/YYYY") : null
                      }
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.selectedDate,
                          helperText: errors.selectedDate
                            ? errors.selectedDate
                            : "",
                          sx: {
                            ...commonStyle,
                            "& .MuiInputBase-input": {
                              padding: "4px", // Reduce the padding
                              fontSize: "12px", // Adjust the font size
                              height: "10px", // Adjust the height if needed
                            },
                            "& .MuiOutlinedInput-root": {
                              minHeight: "30px", // Adjust the overall height
                            },
                            "& .MuiInputLabel-root": {
                              fontSize: "12px", // Reduce the label font size
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          {successMessage ? (
            <></>
          ) : (
            <Button onClick={handleSubmit} color="primary" variant="contained">
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default QuoteModal;
