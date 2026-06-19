"use client";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useRegister from "../../../hook/useRegister";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Link,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { styled } from "@mui/system";
import useAuth from "../../../hook/registerHook/useAuth";
import dynamic from 'next/dynamic';

const OtpInputGroup = dynamic(
  ()=>import ("../../../components/otp/otpInputfield"),{
    ssr:false,
  });
const StyledCard = styled(Card)({
  maxWidth: 400,
  margin: "auto",
  marginTop: "50px",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(128, 0, 128, 0.5)",
  borderRadius: "10px",
});

const ResetPassword = () => {
  const { confirm, resendOtp, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [email,setEmail] = useState('');
  const { resetPassword } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail:any = typeof window!==undefined && localStorage.getItem("forgetemail");
      setEmail(storedEmail);
    }
  }, []);

  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // const [resendTimer, setResendTimer] = useState(120); 
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(120);
  useEffect(() => {
    let timer:any;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendTimer]);

  const getOTPValue = () => {
    const otpValuesArray = Object.values(inputValues);
    const otpValue = otpValuesArray.join("");
    return otpValue;
  };

  const handleChange = (e: any) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const StyledLink = styled(Link)({
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = { ...errors };
    if (passwords.newPassword.trim() === "") {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else {
      newErrors.newPassword = "";
    }

    if (passwords.confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    if (isValid) {
      const otpValue = getOTPValue();
      resetPassword(email, passwords.confirmPassword, otpValue);
    } else {
      setErrors(newErrors);
    }
  };

  const handleResendCode = () => {
    if (email && resendTimer === 0) {
      resendOtp(email); // Trigger the resend function
      setResendTimer(120); // Restart the timer for another 2 minutes
    }
  };

  return (
    <Box className="section-box">
      <StyledCard>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ color: "purple" }}
        >
          Set new password
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          gutterBottom
        >
          Your new password must be different to previously used passwords.
        </Typography>
        <CardContent>
          <Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              OTP verification code sent to
            </Typography>
            <Typography variant="body2" color="primary" gutterBottom>
              {email}
            </Typography>
            <OtpInputGroup
              setInputValues={setInputValues}
              inputValues={inputValues}
            />
            <Typography variant="body2" color="textSecondary" align="right">
              Didn&apos;t receive the OTP?{" "}
              <span
                onClick={handleResendCode}
                style={{
                  fontSize: "14px",
                  cursor: resendTimer > 0 ? "default" : "pointer",
                  fontWeight: "bold",
                  color: resendTimer > 0 ? "#c0c0c0" : "#9c27b0",
                  marginLeft: "5px",
                }}
              >
                {resendTimer > 0
                  ? `(${Math.floor(resendTimer / 60)}:${
                      resendTimer % 60 < 10 ? "0" : ""
                    }${resendTimer % 60})`
                  : "Resend"}
              </span>
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              sx={{
                mb: 2,
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
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type={confirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                mb: 2,
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
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setConfirmPassword(!confirmPassword)}
                    >
                      {confirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={false}
              sx={{
                mt: 2,
                backgroundColor: "purple",
                "&:hover": {
                  backgroundColor: "#130342",
                },
              }}
            >
              Reset password
            </Button>
          </form>
        </CardContent>
        <StyledLink href="/login">
          <Typography variant="body2" style={{ color: "purple" }}>
            ← Back to log in
          </Typography>
        </StyledLink>
      </StyledCard>
    </Box>
  );
};

export default ResetPassword;
