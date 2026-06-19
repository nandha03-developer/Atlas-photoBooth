"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CardMedia,
  Box,
  Avatar,
  CircularProgress,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import uploadFileToS3 from "../aws/uploadimages3";
import { useDropzone } from "react-dropzone";
import useRegister from "../../hook/useRegister";

export default function ProfileForm() {
  const router = useRouter();
  const { registrationData } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesVal, setFilesVal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error("Please select only image files.");
      } else {
        setFiles(acceptedFiles.map((file) => Object.assign(file)));
        setFilesVal(acceptedFiles.map((file) => Object.assign(file)));
      }
    },
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({});
  const onSubmit = (data) => {
    

    const cognitoId = typeof window!==undefined &&localStorage.getItem("usersubToken");
    const name = `${data.firstName} ${data.lastName}`;
    const mutation = `
    mutation create {
      createCustomer(input: {CognitoId: "${cognitoId}", DOB: "${data.date}", Email: "${data.Email}", FirstName: "${data.FirstName}", LastName: "${data.LastName}", ProfileImg: "${imageSrc}", Role: false}) {
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
    `;
    const requestBody = {
      query: mutation,
    };

    const headers = {
      "x-api-key":  process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };

    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, requestBody, { headers })
      .then((res) => {
        router.push("/");
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
      setShowPreview(true);
      setBannerImage(url);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filesVal && handleUpload(filesVal);
  }, [filesVal]);

  return (
    <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '50px',
          display: 'flex',
          justifyContent: 'space-between',
          width: '70%',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFD700', // Yellow color
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <Avatar style={{ width: '100px', height: '100px' }} />
          <p>Let's get you set up</p>
          <p style={{ textAlign: 'center' }}>
            It should only take a couple of minutes to pair with your watch
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '60%' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
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
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="DateOfBirth"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    variant="outlined"
                    size="small"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Mobile"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Mobile"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="CustomerID"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Customer ID"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="Membership"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Membership"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="secondary">
              CANCEL
            </Button>
            <Button variant="contained" color="primary" type="submit">
              SAVE
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
}
