"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { styled } from "@mui/system";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 1,
  position: "absolute",
  top: -theme.spacing(6),
  width: theme.spacing(12),
  height: theme.spacing(12),
}));

export const metadata = {
  title: "Sign up || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};

export default function Page() {
  const [customer, setCustomer] = useState();
  const { control, handleSubmit, setValue } = useForm();

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
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listCustomers?.items || [];
        const userDatas = typeof window!==undefined &&localStorage.getItem("userEmail");
        
        if (userDatas) {
          const getUserDataByEmail = (email) => userDetails.find((item) => item.Email === email);
          const userData = getUserDataByEmail(userDatas);

          if (userData) {
            setCustomer(userData);
            setValue("FirstName", userData.FirstName);
            setValue("LastName", userData.LastName);
            setValue("Email", userData.Email);
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

  const saveChanges = (data) => {
    const mutation = `
      mutation update {
  updateCustomer(input: {
  CognitoId: "${customer.CognitoId}", DOB: "${customer.DOB}", Email: "${customer.Email}", FirstName: "${data.FirstName}", Id: ${customer.Id}, LastName: "${data.LastName}", ProfileImg: "${customer.ProfileImg}", Role: ${customer.Role}
        
        }) {
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
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query: mutation }, { headers })
      .then((res) => {
        fetchData(); 
      })
      .catch((err) => {
        console.error("Error saving data:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 18,
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
              mt: 4,
              pt: 3,
              position: "relative",
              borderRadius: "35px",
              boxShadow: "0 4px 8px rgba(128, 0, 128, 0.4)",
            }}
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                {customer?.ProfileImg ? (
                  <Avatar
                    src={customer?.ProfileImg}
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
          <Typography variant="h6" style={{ color: "purple", fontSize: "22px" }}>
            Personal Information
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
                />
              )}
            />
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
                  sx={{
                    mt: 2,
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
                />
              )}
            />
            <Button type="submit" variant="contained" sx={{ mt: 4, backgroundColor: "purple" }}>
              Save Changes
            </Button>
          </form>
        </Grid>
      </Grid>
    </Container>
  );
}
