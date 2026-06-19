"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
// import uploadFileToS3 from "../aws/uploadimages3";
import useRegister from "../../hook/useRegister";
import { useUser } from "../../context/UserDataContext";
import Datepickers from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import toast from "react-hot-toast";
import dayjs from "dayjs";
import Image from "next/image";
import login from "../../public/assets/img/login/Login1.png"

export default function ProfileForm() {
  // const {email, password, firstName, lastName, dateOfBirth, profileImage} = UserProvider();
  const { email, fetchUser, customer, setCustomer } = useUser();
  const router = useRouter();
  const { registrationData } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesVal, setFilesVal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [hovered, setHovered] = useState(false);
  const [cognitoId, setCognitoId] = useState("");
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error("Please select only image files.");
      } else {
        handleDropMain(acceptedFiles);
      }
    },
  });
  const handleDropMain = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const apiUrl =
          "https://g7p7gx7okzuqmrbcoohenvca5q0ommgm.lambda-url.ap-south-1.on.aws/upload";
        const formData = new FormData();
        formData.append("files", file);
        formData.append("subfolder", "photobooth");

        const requestOptions = {
          method: "POST",
          body: formData,
          redirect: "follow",
        };

        const response = await fetch(apiUrl, requestOptions);

        if (response.ok) {
          const result = await response.json();
          const image = result.imageUrl || URL.createObjectURL(file);
          setImageSrc(image);
          setValue("profileimage", image);
          toast.success("File Uploaded successfully");
        } else {
          const errorResult = await response.json();
          throw new Error(
            "Failed to upload file. Server responded with status: " +
              response.status +
              " " +
              errorResult.message
          );
        }
      } catch (error) {
        console.error("Error:", error);
        if (axios.isAxiosError(error)) {
          toast.error(
            "Error uploading file: " +
              (error.response?.data?.message || error.message)
          );
        } else {
          toast.error("An unexpected error occurred: " + error.message);
        }
      }
    } else {
      toast.error("No file selected for upload");
    }
  };
  const {
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm({});
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
    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listCustomers?.items || [];
        const userDatas =
          typeof window !== undefined && localStorage.getItem("userEmail");

        if (userDatas) {
          const getUserDataByEmail = (email) =>
            userDetails.find((item) => item.Email === email);
          const userData = getUserDataByEmail(userDatas);
          if (userData) {
            setValue("FirstName", userData.FirstName);
            setValue("LastName", userData.LastName);
            setValue("Email", userData.Email);
            const [month, day, year] = userData.DOB.split("-");
            const date = `${year}-${month}-${day}`;
            setValue("DateOfBirth", date);

            setCognitoId(userData.CognitoId);
            setUserId(userData.Id);
          } else {
            console.log("User not found");
          }
        } else {
          console.log("No user data in localStorage");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Unable to fetch user data. Please try again later.");
      }
    };

    fetchData();
  }, [fetchUser]); // Ensure this effect runs only when fetchUser changes

  const onSubmit = (data) => {
    // debugger
    // const userId = localStorage.getItem("userId");
    const name = `${data.FirstName} ${data.LastName}`;
    const [year, month, day] = data.DateOfBirth.split("-");
    const formattedDate = `${month}-${day}-${year}`;
    // const accesstoken = localStorage.getItem("Accesstoken");

    const mutation = `
    mutation update {
  updateCustomer(input: {CognitoId: "${cognitoId}", DOB: "${formattedDate}", Email: "${data.Email}", FirstName: "${data.FirstName}", Id: ${userId}, LastName: "${data.LastName}", ProfileImg: "${imageSrc}", Role: false}) {
    CognitoId
    DOB
    Email
    FirstName
    Id
    LastName
    ProfileImg
    Role
  }
}`;
    const requestBody = {
      query: mutation,
    };

    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };

    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, requestBody, { headers })
      .then((res) => {
        if (res.data.data.updateCustomer) {
          router.push("/");

          toast.success("Profile create sucessfully");
          // setTimeout(() => {
          // window.location.href = "/";
          // setCustomer(res.data.data.updateCustomer);
          // }, 2000);
          fetchUser()
          setCustomer(res.data.data.updateCustomer);
        }
      })
      .catch((err) => {
        console.error("Error saving data:", err);
        toast.error("Error saving data");
      });
  };

  const handleUpload = async (files) => {
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    try {
      setLoading(true);
      const url = await uploadFileToS3(file, "photobooth-galleries/IMAGES");
      setImageSrc(url);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUpload([file]);
    }
  };

  useEffect(() => {
    filesVal && handleUpload(filesVal);
  }, [filesVal]);
  useEffect(() => {
    const handleUnload = () => {
      typeof window !== undefined &&
        localStorage.setItem("shouldRedirect", "true");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  useEffect(() => {
    const shouldRedirect = localStorage.getItem("shouldRedirect");
    if (shouldRedirect === "true") {
      typeof window !== undefined && localStorage.removeItem("shouldRedirect");

      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.location.href = "/login"; // Replace '/login' with your actual login route
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      // localStorage.clear();
    };
  }, []);
  const watchDateOfBirth = watch("DateOfBirth");
  const getMinDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const today = dayjs(); // Current date
  const minAgeDate = today.subtract(18, "years").format("YYYY-MM-DD");
  const commonStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "purple",
      },
    },
    "& .MuiInputLabel-root": {
      "&.Mui-focused": {
        color: "purple",
      },
    },
    "& .MuiInputBase-input": {
      "&.Mui-focused": {
        color: "purple",
      },
    },
  };
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      typeof window !== undefined && localStorage.clear(); // Clear localStorage when back button is pressed
      window.location.href = "/login"; // Redirect to login page
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  return (
    <div
      style={{
        marginTop: "100px",
        display: "flex",
        justifyContent: "center",
        padding: isMobile ? "10px" : "0",
      }}
    >
      <Image
          src={login}
          height={1000}
          width={1000}
          alt=""
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
          }}
        />
      <div
        style={{
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: isMobile ? "20px" : "50px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          width: isMobile ? "100%" : "70%",
        }}
      >
        <div
          style={{
            backgroundColor: "#BDB5D5",
            width: isMobile ? "100%" : "40%",
            height: "144%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: isMobile ? "16px 16px 0 0" : "16px 0 0 16px",
            padding: "20px",
            marginLeft: isMobile ? "0" : "-50px",
            marginTop: "-50px",
          }}
        >
          <Avatar
            style={{ width: "100px", height: "100px", cursor: "pointer" }}
            src={imageSrc}
            onClick={() => document.getElementById("file-upload").click()}
          />
          <p>Let's get you set up</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              handleDropMain(e.target.files);
            }}
          />
          {loading && (
            <Button
              variant="contained"
              sx={{ backgroundColor: "grey", px: 3 }}
              disabled
            >
              <CircularProgress size={24} />
            </Button>
          )}
          {!loading && (
            <Button
              variant="contained"
              sx={{ backgroundColor: "purple" }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload
            </Button>
          )}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ width: isMobile ? "100%" : "60%" }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="FirstName"
                control={control}
                defaultValue=""
                rules={{ required: "First Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      pattern: "[A-Za-z]*",
                    }}
                    onInput={(e) => {
                      let value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Ensure only letters
                      value =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase(); // Capitalize first letter
                      e.target.value = value;
                      field.onChange(e); // Trigger React Hook Form's onChange
                    }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    sx={commonStyles}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="LastName"
                control={control}
                defaultValue=""
                rules={{ required: "Last Name is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    size="small"
                    inputProps={{
                      pattern: "[A-Za-z]*", // Allow only letters, no spaces
                    }}
                    onInput={(e) => {
                      let value = e.target.value.replace(/[^a-zA-Z]/g, ""); // Ensure only letters
                      value =
                        value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase();
                      e.target.value = value;
                      field.onChange(e);
                    }}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    sx={commonStyles}
                  />
                )}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <Controller
                name="DateOfBirth"
                control={control}
                defaultValue=""
                rules={{ required: "Date of Birth is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    variant="outlined"
                    size="small"
                    error={!!error}
                    helperText={error ? error.message : null}
                    type="date"
                    InputProps={{
                      inputProps: {
                        max: minAgeDate, // Set max date to 18 years ago
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={commonStyles}
                  />
                )}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Controller
                name="Email"
                control={control}
                defaultValue=""
                rules={{ required: "Email is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    fullWidth
                    aria-readonly
                    label="Email"
                    variant="outlined"
                    size="small"
                    error={!!error}
                    helperText={error ? error.message : null}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={commonStyles}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button>{/* CANCEL */}</Button>
            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: "purple" }}
            >
              SAVE
            </Button>
          </Box>
        </form>
        {/* <ToastContainer /> */}
      </div>
    </div>
  );
}
