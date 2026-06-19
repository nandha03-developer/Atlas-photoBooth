"use client";

import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import authConfig from "../../configs/auth";
import useAuth from "../../hook/registerHook/useAuth";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import {
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { useKeyDown } from "../../hook/useKeyDown";
import GoogleSignIn from "../googleSignin/googleSignin";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));
export default function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();
  // const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  // const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasValidLength: false,
    hasNoLeadingOrTrailingSpace: false,
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handlePasswordChange = (value) => {
    const validationResults = validatePassword(value);
    setPasswordErrors(validationResults);

    // Check if all conditions are satisfied
    const allConditionsMet = Object.values(validationResults).every(Boolean);
    setIsPasswordValid(allConditionsMet);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // const handlePasswordChange = (value) => {
  //   const validationResults = validatePassword(value);
  //   setPasswordErrors(validationResults);
  // };

  const defaultValues = {
    email: "",
    password: "",
  };
  useKeyDown(() => {
    handleSubmit(onSubmit)();
  }, ["Enter"]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues,
    mode: "onBlur",
  });
  const onSubmit = (data) => {
    login(data.email, data.password);
  };
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

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(5, "Password must be at least 5 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
  });
  const CLIENT_ID = "2dilsnnsd6acp0mme9gfgig32o"; // Replace with your Cognito App Client ID
  const CLIENT_SECRET = "1i13gnm003mal8n8baqbk8ltisa0efe3pcb43itdhai2dui7g4r4"; // Replace with your Cognito App Client Secret
  const AWS_REGION = "ap-south-1"; // Replace with your AWS region

  const cognito = new CognitoIdentityServiceProvider({ region: "us-east-2" });
  const generateSecretHash = (username, clientId, clientSecret) => {
    return crypto
      .createHmac("SHA256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  };

  const handleLogin = async (data) => {
    // setLoading(true);
    const params = {
      email: data.email,
      password: data.password,
      rememberMe: rememberMe,
    };
    const secretHash = generateSecretHash(
      params.email,
      CLIENT_ID,
      CLIENT_SECRET
    );
    try {
      const response = await cognito
        .initiateAuth({
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: params.email,
            PASSWORD: params.password,
            SECRET_HASH: secretHash,
          },
          ClientId: "2dilsnnsd6acp0mme9gfgig32o", // Replace with your actual Cognito User Pool Client ID
        })
        .promise();

      const token = response?.AuthenticationResult?.AccessToken;
      typeof window !== undefined &&
        localStorage.setItem(authConfig.storageTokenKeyName, token);

      const userResponseData = {
        email: params.email,
        password: params.password,
      };
      params.rememberMe
        ? window.localStorage.setItem(
            "userData",
            JSON.stringify(userResponseData)
          )
        : null;

      toast.success("Login successful");
      setTimeout(() => {
        router.push("/gallery");
      }, 2000);
      const returnUrl = router.query.returnUrl || "/login";
      const redirectURL = returnUrl && returnUrl !== "/" ? returnUrl : "/";

      // setLoading(false);
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Sign-in failed Invalid user name or password");
    }
  };
  const handleLogins = async (data) => {
    // setLoading(true);
    const { email, password } = data;
    const params = {
      email: email,
      password: password,
      rememberMe: rememberMe,
    };

    try {
      await handleLogin(params);

      toast.success("Login successful!", toastConfig);
      typeof window !== undefined &&
        localStorage.setItem("userData", JSON.stringify({ email, password }));
    } catch (error) {
      toast.error("Login failed. Please try again.", toastConfig);
    } finally {
      // setLoading(false);
    }
  };
  // const commonStyles = {
  //   "& .MuiInputLabel-root": {
  //     color: "purple", // Set the label color to purple
  //   },
  //   "& .MuiOutlinedInput-root": {
  //     borderRadius: "8px",
  //     "&.Mui-focused fieldset": {
  //       borderColor: "#E49BFF", // Change the border color to purple when focused
  //     },
  //   },
  //   borderRadius: "8px", // Adjust the value as needed for your desired border radius
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
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("Accesstoken")||localStorage.getItem("usersubToken");
  //     if (token) {
  //       router.push("/");
  //     } else {
  //       router.push("/login");
  //     }
  //   }
  // }, [localStorage.getItem("Accesstoken"),localStorage.getItem("usersubToken")]);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("Accesstoken")||localStorage.getItem("usersubToken");
  //     if (token) {
  //       router.push("/");
  //     } else {
  //       router.push("/login");
  //     }
  //   }
  // }, [localStorage.getItem("Accesstoken"),localStorage.getItem("usersubToken")]);
  // useEffect(() => {
  //   // alert("signpage");
  //   const signupemail = localStorage.getItem("loginemail");
  //   if (signupemail) {
  //     // Ensure the code only runs in the client-side
  //     if (typeof window !== "undefined") {
  //       const token =
  //         localStorage.getItem("Accesstoken") ||
  //         localStorage.getItem("usersubToken");
  //       if (token) {
  //         router.push("/");
  //       } else {
  //         router.push("/signup");
  //       }
  //     }
  //   }
  // }, [
  //   typeof window !== "undefined"&&localStorage.getItem("Accesstoken"),
  //   typeof window !== "undefined"&&localStorage.getItem("usersubToken"),
  // ]);
  return (
    <div className="form-page__content">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="row text-center"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "150px",
            // paddingTop: "200px",

            marginBottom: "50px",
          }}
        >
          <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-xs-8">
            <div
              className="px-30 py-30 md:px-25 md:py-25 shadow-sm mb-5 bg-white rounded-16"
              style={{ boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)" }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h3 className="text-24 lh-13">Login</h3>
              </div>
              <p
                className="mt-6 mb-6"
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  color:'#4f547b'
                }}
              >
                Hey, Enter your details to get sign into your account
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Email is required" }}
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
                    {/* <div
                      style={{
                        marginTop: "10px",
                        color: "#555",
                        textAlign: "left",
                        fontSize: "14px",
                        display: "flex",
                        justifyContent: "space-between", // Aligns items in two columns
                      }}
                    >
                      <div style={{ flex: 1, paddingRight: "10px" }}>
                        <p
                          style={{
                            color: passwordErrors.hasUpperCase
                              ? "green"
                              : "red",
                          }}
                        >
                          {passwordErrors.hasUpperCase ? "✔" : "✖"} Must contain
                          an uppercase letter
                        </p>
                        <p
                          style={{
                            color: passwordErrors.hasLowerCase
                              ? "green"
                              : "red",
                          }}
                        >
                          {passwordErrors.hasLowerCase ? "✔" : "✖"} Must contain
                          a lowercase letter
                        </p>
                        <p
                          style={{
                            color: passwordErrors.hasNumber ? "green" : "red",
                          }}
                        >
                          {passwordErrors.hasNumber ? "✔" : "✖"} Must contain a
                          number
                        </p>
                      </div>
                      <div style={{ flex: 1, paddingLeft: "10px" }}>
                        <p
                          style={{
                            color: passwordErrors.hasSpecialChar
                              ? "green"
                              : "red",
                          }}
                        >
                          {passwordErrors.hasSpecialChar ? "✔" : "✖"} Must
                          contain a special character
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
                          {passwordErrors.hasNoLeadingOrTrailingSpace
                            ? "✔"
                            : "✖"}{" "}
                          No leading/trailing spaces
                        </p>
                      </div>
                    </div> */}

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
  <h3 style={{ fontSize: "12px", marginBottom: "10px", color: "#333" }}>
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
      fontSize:"12px",
          color: passwordErrors.hasUpperCase ? "green" : "red",
        }}
      >
        {passwordErrors.hasUpperCase ? "✔" : "✖"} An uppercase letter
      </p>
      <p
        style={{
      fontSize:"12px",
          color: passwordErrors.hasLowerCase ? "green" : "red",
        }}
      >
        {passwordErrors.hasLowerCase ? "✔" : "✖"} A lowercase letter
      </p>
      <p
        style={{fontSize:"12px",
          color: passwordErrors.hasNumber ? "green" : "red",
        }}
      >
        {passwordErrors.hasNumber ? "✔" : "✖"} A number
      </p>
    </div>
    <div style={{ flex: 1, paddingLeft: "10px" }}>
      <p
        style={{fontSize:"12px",
          color: passwordErrors.hasSpecialChar ? "green" : "red",
        }}
      >
        {passwordErrors.hasSpecialChar ? "✔" : "✖"} A special character
      </p>
      <p
        style={{fontSize:"12px",
          color: passwordErrors.hasValidLength ? "green" : "red",
        }}
      >
        {passwordErrors.hasValidLength ? "✔" : "✖"} At least 8 characters
      </p>
      <p
        style={{fontSize:"12px",
          color: passwordErrors.hasNoLeadingOrTrailingSpace ? "green" : "red",
        }}
      >
        {passwordErrors.hasNoLeadingOrTrailingSpace ? "✔" : "✖"} No leading/trailing spaces
      </p>
    </div>
  </div>
</div>

                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        // marginBottom: "4px",
                        fontSize: "14px",
                        fontWeight: "lighter",
                      }}
                    >
                      <Link href="/pageReset" color="secondary">
                        Forgot Password?
                      </Link>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: "4px",
                        fontSize: "14px",
                        marginTop: 0,
                        fontWeight: "lighter",
                      }}
                    >
                      <Link href="/signup" color="secondary">
                        create a new account?
                      </Link>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    {loading ? (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{
                          borderRadius: "12px",
                          py: 1,
                          // padding: "15px 0",
                          backgroundColor: "#800080", // Purple color
                          "&:hover": {
                            backgroundColor: "#4B0082", // Darker purple color
                          },
                        }}
                      >
                        <CircularProgress />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="button-font"
                        variant="contained"
                        color="primary"
                        fullWidth
                        // disabled={loading}
                        disabled={!isPasswordValid || loading}
                        sx={{
                          borderRadius: "12px",
                          py: 1,
                          // padding: "15px 0",

                          backgroundColor: "#800080", // Purple color
                          "&:hover": {
                            backgroundColor: "#4B0082", // Darker purple color
                          },
                        }}
                      >
                        Login
                      </Button>
                    )}

                    <Grid item xs={12}>
                      {/* Divider with "or" */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: "20px 0", // Uniform margin above and below the divider
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
                          marginTop: "20px", // Spacing between divider and button
                        }}
                      >
                        <GoogleSignIn />
                      </div>
                    </Grid>

                    {/* <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <GoogleSignIn />
                    </div> */}
                  </Grid>
                </Grid>
              </form>
              {/* <ToastContainer /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
