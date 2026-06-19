"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useUser } from "../../context/UserDataContext";
// import dayjs from 'dayjs';
export const metadata = {
  title:
    "Sign up || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Page() {
  const [customer, setCustomer] = useState();
  const { fetchUser, customer: cus, setCustomer: setCus } = useUser();
  const { control, handleSubmit, setValue } = useForm();
  const [imagesrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [removeImage, setRemoveImage] = useState(true);

  const handleDelete = () => {
    setImageSrc("");
    setRemoveImage(false)
  };

  useEffect(() => {
    if (customer) {
      setCustomer(customer);
    }
  }, [customer]);

  const fetchData = () => {
    const query = `
      query list {
        listCustomers {
          Totalcount
          items {
            CognitoId
            DOB
            Email
            FirstName
            Gender
            Id
            LastName
            ProfileImg
            Role
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
        const userDetails = res.data?.data?.listCustomers?.items || [];
        // Get email from localStorage if available
        const userEmail =
          typeof window !== "undefined" && localStorage.getItem("userEmail");

        if (userDetails && userEmail) {
          // Find user data by email
          const getUserDataByEmail = (email) =>
            userDetails.find((item) => item.Email === email);
          const userData = getUserDataByEmail(userEmail);

          // If user data is found, update state and form fields
          if (userData) {
            setCustomer(userData);
            setValue("FirstName", userData.FirstName);
            setValue("LastName", userData.LastName);

            // If DOB is present and needs to be formatted (if required)
            if (userData.DOB) {
              // Example format: "YYYY-MM-DD" (Adjust according to actual DOB format)
              const [year, month, day] = userData.DOB.split("-");
              const formattedDate = `${year}-${month}-${day}`;
              setValue("DOB", formattedDate);
            }

            setValue("Email", userData.Email);
            setImageSrc(userData.ProfileImg);
            setValue("Gender", userData.Gender);
          } else {
            console.log("No user Data found by email.");
          }
        } else {
          console.log("No user data or email not found in localStorage.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    // Call fetchData once when the component mounts
    fetchData();
  }, []);

  const saveChanges = (data) => {
    // Compare new data with existing customer data to detect changes
    const hasChanges = 
      data.DOB !== customer.DOB ||
      data.FirstName !== customer.FirstName ||
      data.LastName !== customer.LastName ||
      data.Gender !== customer.Gender ||
      imagesrc !== customer.ProfileImg;
  
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }
  
    const mutation = `
        mutation update {
          updateCustomer(input: {
            CognitoId: "${customer.CognitoId}",
            DOB: "${data?.DOB}",
            Email: "${customer.Email}",
            FirstName: "${data.FirstName}",
            Id: ${customer.Id},
            LastName: "${data.LastName}",
            ProfileImg: "${imagesrc}",
            Gender: "${data.Gender}",
            Role: ${customer.Role}
          }) {
            CognitoId
            DOB
            Email
            FirstName
            Gender
            Id
            LastName
            ProfileImg
            Role
          }
        }
      `;
  
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
  
    axios
      .post(endPoint, { query: mutation }, { headers })
      .then((res) => {
        toast.success("Profile updated successfully");
        fetchData();
        fetchUser();
        setCus(res.data.data.updateCustomer);
      })
      .catch((err) => {
        console.error("Error saving data:", err);
      });
  };
  
  const dateObj = new Date(selectedDate);

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const formattedDate = `${month}-${day}-${year}`;

  const handleDropMain = async (acceptedFiles) => {
    setLoading(true);
    const file = acceptedFiles[0];
    if (!file) {
      toast.error("No file selected for upload");
      setLoading(false);
      return;
    }

    try {
      const apiUrl =
        "https://g7p7gx7okzuqmrbcoohenvca5q0ommgm.lambda-url.ap-south-1.on.aws/upload";
      const formData = new FormData();
      formData.append("files", file);
      formData.append("subfolder", "photobooth");

      const response = await axios.post(apiUrl, formData);
      const image = response.data?.imageUrl || URL.createObjectURL(file);
      setImageSrc(image);
      setValue("profileimage", image);
      toast.success("File selected successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  const today = dayjs();
  const minAgeDate = today.subtract(18, "years").format("YYYY-MM-DD");

  const handleDateChange = (newValue) => {
    if (newValue) {
      const formattedDate = dayjs(newValue).format("MM/DD/YYYY");
      setSelectedDate(formattedDate);
      setErrors((prevErrors) => ({ ...prevErrors, selectedDate: "" }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedDate: "Invalid date",
      }));
    }
  };
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          // mt: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "60px",
          }}
        >
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Paper
              sx={{
                pb: 7,
                // mt: 10,
                mt: { md: 10, lg: 10 },
                // pt: 3,
                position: "relative",
                borderRadius: "35px",
                boxShadow: "0 4px 8px rgba(128, 0, 128, 0.4)",
              }}
            >
              <Grid container justifyContent="center" alignItems="center">
                <Grid item>
                  <Box
                    sx={{
                      position: "relative",
                      width: 150,
                      "&:hover .upload-button": {
                        opacity: 1,
                        pointerEvents: "auto",
                      },
                      "&:hover .delete-button": {
                        opacity: 1,
                        pointerEvents: "auto",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <>
                      {removeImage ? (
                        imagesrc || customer?.ProfileImg ? (
                          <Avatar
                            src={imagesrc || customer.ProfileImg}
                            sx={{
                              width: 150,
                              height: 150,
                              position: "absolute",
                              top: -75,
                              left: "50%",
                              transform: "translateX(-50%)",
                              boxShadow: "0 4px 8px rgba(128, 0, 128, 0.2)",
                            }}
                          />
                        ):(<>
                        <Avatar
                            src={""}
                            sx={{
                              width: 150,
                              height: 150,
                              position: "absolute",
                              top: -75,
                              left: "50%",
                              transform: "translateX(-50%)",
                              boxShadow: "0 4px 8px rgba(128, 0, 128, 0.2)",
                            }}
                          />
                        </>)
                        ) : (
                          <Avatar
                            sx={{
                              width: 150,
                              height: 150,
                              position: "absolute",
                              top: -75,
                              left: "50%",
                              transform: "translateX(-50%)",
                              backgroundColor: "#3f51b5",
                              boxShadow: "0 4px 8px rgba(128, 0, 128, 0.2)",
                            }}
                          >
                            {customer?.FirstName?.[0]}
                            {customer?.LastName?.[0]}
                          </Avatar>
                        )}
                      </>
                    )}
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "purple",
                        position: "absolute",
                        top: 50,
                        left: "50%",
                        transform: "translateX(-50%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        pointerEvents: "none",
                      }}
                      className="upload-button"
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    >
                      Upload
                    </Button>
                    {imagesrc !== "" && (
                      <Tooltip
                        title="Delete"
                        arrow
                        sx={{
                          "& .MuiTooltip-tooltip": {
                            fontSize: "2rem", // Adjust size as needed
                            padding: "8px 16px", // Adjust padding for more space
                          },
                          "& .MuiTooltip-arrow": {
                            fontSize: "2.25em", // Adjust arrow size
                          },
                        }}
                      >
                        <Button
                          sx={{
                            position: "absolute",
                            left: -50,
                            opacity: 1,
                            transition: "opacity 0.3s ease",
                            pointerEvents: "auto",
                          }}
                          className="delete-button"
                          onClick={handleDelete}
                        >
                          <Delete sx={{ fontSize: "2em" }} />
                        </Button>
                      </Tooltip>
                    )}

                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleDropMain(e.target.files)}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mt: 10, textAlign: "center" }}>
                    <Typography variant="h5" style={{ color: "purple" }}>
                      {customer?.FirstName} {customer?.LastName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      style={{ marginTop: "5px", fontSize: "20px" }}
                    >
                      {customer?.Email}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              style={{ color: "purple", fontSize: "22px" }}
            >
              Personal Informations
            </Typography>
            <form onSubmit={handleSubmit(saveChanges)}>
              <Controller
                name="FirstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    sx={{
                      mt: 2,
                      width: 400,
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "purple",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "purple",
                      },
                    }}
                    size="small"
                    inputProps={{
                      pattern: "[A-Za-z ]*",
                    }}
                    onInput={(e) => {
                      let value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      if (value.length > 0) {
                        value = value.charAt(0).toUpperCase() + value.slice(1);
                      }
                      e.target.value = value;
                      field.onChange(e);
                    }}
                  />
                )}
              />

              <Controller
                name="LastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    sx={{
                      mt: 2,
                      width: 400, // Set a fixed width for consistency
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "purple",
                        },
                      },
                      "& label.Mui-focused": {
                        color: "purple",
                      },
                    }}
                    size="small"
                    inputProps={{
                      pattern: "[A-Za-z ]*",
                    }}
                    onInput={(e) => {
                      let value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                      if (value.length > 0) {
                        value =
                          value.charAt(0).toUpperCase() +
                          value.slice(1).toLowerCase();
                      }
                      e.target.value = value;
                      field.onChange(e);
                    }}
                  />
                )}
              />

              <Controller
                name="Gender"
                control={control}
                defaultValue="Male" // Default value
                render={({ field }) => (
                  <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel
                      component="legend"
                      sx={{
                        color: "purple",
                        textAlign: "left",
                        fontSize: "12px",
                      }}
                    >
                      Gender
                    </FormLabel>
                    <RadioGroup
                      row
                      {...field}
                      sx={{ justifyContent: "center" }}
                      value={field.value} // Ensure controlled behavior
                      onChange={(e) => field.onChange(e.target.value)} // Handle change
                    >
                      <FormControlLabel
                        value="Male"
                        control={
                          <Radio
                            sx={{
                              color: "purple", // Default color
                              "&.Mui-checked": {
                                color: "purple", // Color when checked
                              },
                            }}
                          />
                        }
                        label="Male"
                      />
                      <FormControlLabel
                        value="Female"
                        control={
                          <Radio
                            sx={{
                              color: "purple", // Default color
                              "&.Mui-checked": {
                                color: "purple", // Color when checked
                              },
                            }}
                          />
                        }
                        label="Female"
                      />
                      <FormControlLabel
                        value="Other"
                        control={
                          <Radio
                            sx={{
                              color: "purple", // Default color
                              "&.Mui-checked": {
                                color: "purple", // Color when checked
                              },
                            }}
                          />
                        }
                        label="Other"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              />

              <Grid
                container
                spacing={2}
                sx={{ mt: 0.5, justifyContent: "center" }}
              >
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="DOB" // Name of the field
                      control={control} // control from useForm
                      defaultValue={null} // default value for the date
                      render={({ field }) => (
                        <DatePicker
                          label="Date of Birth"
                          value={
                            field.value
                              ? dayjs(field.value, "MM-DD-YYYY") // Format the value as MM-DD-YYYY
                              : null
                          }
                          onChange={(newValue) => {
                            // Format the new value as MM-DD-YYYY before passing it to field.onChange
                            field.onChange(
                              newValue ? newValue.format("MM-DD-YYYY") : null
                            );
                          }}
                          maxDate={dayjs().subtract(18, "year")}
                          sx={{ width: 400 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              sx={{
                                "& .MuiInputBase-input": {
                                  padding: "4px",
                                  fontSize: "12px",
                                  height: "10px",
                                },
                                "& .MuiOutlinedInput-root": {
                                  minHeight: "30px",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "12px",
                                },
                              }}
                              error={!!errors.selectedDate}
                              helperText={errors.selectedDate || ""}
                            />
                          )}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1, width: 400, backgroundColor: "purple" }} // Set a fixed width for the button
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
