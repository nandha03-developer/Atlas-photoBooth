"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useRegister from "../../hook/useRegister";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useKeyDown } from "../../hook/useKeyDown";
import { useRouter } from "next/navigation";
// import GoogleIcon from "@mui/icons-material/Google";
import GoogleSignIn from "../googleSignin/googleSignin";

export default function SignUpForm() {
  const router = useRouter();
  const { register, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasValidLength: false,
    hasNoLeadingOrTrailingSpace: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validatePassword = (password) => {
    const errors = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasValidLength: password.length >= 8,
      hasNoLeadingOrTrailingSpace: password.trim() === password,
    };
    return errors;
  };
  const handlePasswordChange = (value) => {
    const validationResults = validatePassword(value);
    setPasswordErrors(validationResults);

    // Check if all conditions are satisfied
    const allConditionsMet = Object.values(validationResults).every(Boolean);
    setIsPasswordValid(allConditionsMet);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  useKeyDown(() => {
    handleSubmit(onSubmit)();
  }, ["Enter"]);
  const onSubmit = (data) => {
    const name = `${data.firstName} ${data.LastName}`;

    register(data.email, data.password, name);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // const handleGoogleSignUp = () => {
  //   // AWS Cognito Google Sign-In URL
  //   const loginUrl = 'https://photobooth.auth.us-east-2.amazoncognito.com/oauth2/authorize?client_id=2dilsnnsd6acp0mme9gfgig32o&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fatlasfotoboothfrontend.vercel.app%2F&identity_provider=Google';

  //   // Redirect to the Google Sign-In page
  //   router.push(loginUrl);
  // };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    // alert("signpage");
    const signupemail =
      typeof window !== undefined && localStorage.getItem("signupemail");
    if (!signupemail) {
      // Ensure the code only runs in the client-side
      if (typeof window !== "undefined") {
        const token =
          (typeof window !== undefined &&
            localStorage.getItem("Accesstoken")) ||
          (typeof window !== undefined && localStorage.getItem("usersubToken"));
        if (token) {
          router.push("/");
        } else {
          router.push("/signup");
        }
      }
    }
  }, [
    typeof window !== "undefined" && localStorage.getItem("Accesstoken"),
    typeof window !== "undefined" && localStorage.getItem("usersubToken"),
  ]);
  const commonStyles = {
    borderRadius: "5px",
    width: "100%",
    "& .MuiInputLabel-root": {
      color: "purple", // Set the label color to purple
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "&.Mui-focused fieldset": {
        color: "purple", // Set the label color to purple

        borderColor: "purple", // Change the border color to purple when focused
      },
    },
  };
  return (
    <div className="form-page__content lg:mt-50">
      <div className="container">
        <style>
          {`
      /* WebKit browsers (Chrome, Safari) */
      ::-webkit-scrollbar {
        width: 2px;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #0a466b;
      }
    `}
        </style>
        <div className="row text-center" style={{ marginTop: "150px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-xs-8">
              <div
                className="px-30 py-30 md:px-25 md:py-25 shadow-lg p-3 mb-5 bg-white rounded-16"
                style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)" }}
              >
                <h3 className="text-24 lh-13">Become a Member</h3>
                {/* <p
                className="mt-6"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Fill out this form, and a Atlas Fotobooth team member will
                contact you to craft a personalized photo booth rental package
                tailored to your events unique needs.
              </p> */}

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ padding: "20px" }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                      <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: "First name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            size="small"
                            sx={commonStyles}
                            inputProps={{
                              pattern: "[A-Za-z]*", // Allow only letters, no spaces
                            }}
                            onInput={(e) => {
                              let value = e.target.value.replace(
                                /[^a-zA-Z]/g,
                                ""
                              );
                              if (value.length > 0) {
                                value =
                                  value.charAt(0).toUpperCase() +
                                  value.slice(1).toLowerCase();
                              }
                              e.target.value = value;
                              field.onChange(e); // Ensure React Hook Form updates the value
                            }}
                            variant="outlined"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Controller
                        name="LastName"
                        control={control}
                        rules={{ required: "Last name is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name"
                            size="small"
                            sx={commonStyles}
                            fullWidth
                            inputProps={{
                              pattern: "[A-Za-z ]*", // Allow only letters and spaces
                            }}
                            onInput={(e) => {
                              let value = e.target.value.replace(
                                /[^a-zA-Z ]/g,
                                ""
                              );

                              if (value.length > 0) {
                                value = value
                                  .toLowerCase() // Convert entire string to lowercase
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                  ); // Capitalize first letter of each word
                              }

                              e.target.value = value;
                              field.onChange(e); // Trigger React Hook Form's onChange
                            }}
                            variant="outlined"
                            error={!!errors.LastName}
                            helperText={errors.LastName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "Enter a valid email address",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email"
                            size="small"
                            sx={commonStyles}
                            fullWidth
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>

                    {/* <Grid item xs={12} md={12}>
                    <Controller
                      name="password"
                      control={control}
                      rules={{
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type={showPassword ? "text" : "password"}
                          label="Password"
                          variant="outlined"
                          error={!!errors.password}
                          size="small"
                          sx={commonStyles}
                          helperText={
                            errors.password ? errors.password.message : ""
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <div style={{ marginTop: "10px", color: "#555",textAlign: "left",fontSize: "14px" }}>
                      <p
                        style={{
                          color: passwordErrors.hasUpperCase ? "green" : "red",
                        }}
                      >
                        {passwordErrors.hasUpperCase ? "✔" : "✖"} Must contain
                        an uppercase letter
                      </p>
                      <p
                        style={{
                          color: passwordErrors.hasLowerCase ? "green" : "red",
                        }}
                      >
                        {passwordErrors.hasLowerCase ? "✔" : "✖"} Must contain a
                        lowercase letter
                      </p>
                      <p
                        style={{
                          color: passwordErrors.hasNumber ? "green" : "red",
                        }}
                      >
                        {passwordErrors.hasNumber ? "✔" : "✖"} Must contain a
                        number
                      </p>
                      <p
                        style={{
                          color: passwordErrors.hasSpecialChar
                            ? "green"
                            : "red",
                        }}
                      >
                        {passwordErrors.hasSpecialChar ? "✔" : "✖"} Must contain
                        a special character
                      </p>
                      <p
                        style={{
                          color: passwordErrors.hasValidLength
                            ? "green"
                            : "red",
                        }}
                      >
                        {passwordErrors.hasValidLength ? "✔" : "✖"} At least 8
                        characters
                      </p>
                      <p
                        style={{
                          color: passwordErrors.hasNoLeadingOrTrailingSpace
                            ? "green"
                            : "red",
                        }}
                      >
                        {passwordErrors.hasNoLeadingOrTrailingSpace ? "✔" : "✖"}{" "}
                        No leading/trailing spaces
                      </p>
                    </div> */}

                    <Grid item xs={12}>
                      <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: "Password is required",
                          validate: (value) => {
                            const errors = validatePassword(value);
                            return (
                              Object.values(errors).every(Boolean) ||
                              "Password is not strong enough"
                            );
                          },
                        }}
                        render={({ field }) => (
                          <div style={{ position: "relative" }}>
                            <TextField
                              fullWidth
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              error={Boolean(errors.password)}
                              helperText={errors.password?.message}
                              {...field}
                              size="small"
                              onChange={(e) => {
                                field.onChange(e);
                                handlePasswordChange(e.target.value);
                              }}
                              sx={commonStyles}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                        )}
                      />

                      {/* Password Requirements */}
                      <div
                        style={{
                          marginTop: "10px",
                          color: "#555",
                          textAlign: "left",
                          fontSize: "14px",
                          display: "flex",
                          flexDirection: "column", // Ensures heading is above the content
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "12px",
                            marginBottom: "10px",
                            color: "#333",
                          }}
                        >
                          Password must contain:
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: "10px" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                color: passwordErrors.hasUpperCase
                                  ? "green"
                                  : "red",
                              }}
                            >
                              {passwordErrors.hasUpperCase ? "✔" : "✖"} An
                              uppercase letter
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: passwordErrors.hasLowerCase
                                  ? "green"
                                  : "red",
                              }}
                            >
                              {passwordErrors.hasLowerCase ? "✔" : "✖"} A
                              lowercase letter
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: passwordErrors.hasNumber
                                  ? "green"
                                  : "red",
                              }}
                            >
                              {passwordErrors.hasNumber ? "✔" : "✖"} A number
                            </p>
                          </div>
                          <div style={{ flex: 1, paddingLeft: "10px" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                color: passwordErrors.hasSpecialChar
                                  ? "green"
                                  : "red",
                              }}
                            >
                              {passwordErrors.hasSpecialChar ? "✔" : "✖"} A
                              special character
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color: passwordErrors.hasValidLength
                                  ? "green"
                                  : "red",
                              }}
                            >
                              {passwordErrors.hasValidLength ? "✔" : "✖"} At
                              least 8 characters
                            </p>
                            <p
                              style={{
                                fontSize: "12px",
                                color:
                                  passwordErrors.hasNoLeadingOrTrailingSpace
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {passwordErrors.hasNoLeadingOrTrailingSpace
                                ? "✔"
                                : "✖"}{" "}
                              No leading/trailing spaces
                            </p>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      {loading ? (
                        <Button
                          className="button-font"
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={loading}
                          fullWidth
                          sx={{
                            borderRadius: "12px",
                            py: 1,
                            padding: "15px 0",
                            backgroundColor: "#800080",
                            "&:hover": {
                              backgroundColor: "#4B0082",
                            },
                          }}
                        >
                          <CircularProgress />
                        </Button>
                      ) : (
                        <Button
                          className="button-font"
                          type="submit"
                          variant="contained"
                          color="primary"
                          // disabled={loading}
                          disabled={!isPasswordValid || loading}
                          fullWidth
                          sx={{
                            borderRadius: "12px",
                            py: 1,
                            padding: "15px 0",
                            backgroundColor: "#800080",
                            "&:hover": {
                              backgroundColor: "#4B0082",
                            },
                          }}
                        >
                          Register
                        </Button>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      {/* Divider with "or" */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "20px", // Add spacing below the "or" divider
                        }}
                      >
                        <Divider style={{ flexGrow: 1 }} />
                        <span style={{ margin: "0 10px", color: "#aaa" }}>
                          or
                        </span>
                        <Divider style={{ flexGrow: 1 }} />
                      </div>

                      {/* Google Sign Up Button */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "20px", // Add spacing above the Google Sign In button
                        }}
                      >
                        <GoogleSignIn />
                      </div>
                    </Grid>
                  </Grid>
                </form>
                {/* <ToastContainer /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
