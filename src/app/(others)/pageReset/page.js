"use client";
import { useState } from "react";
import Link from "next/link";
import useAuth from "../../../hook/registerHook/useAuth";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import Icon from "@mui/icons-material/LockOutlined";

const StyledContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "10vh",
});

const StyledBox = styled(Box)({
  textAlign: "center",
  width: "100%",
});

const StyledButton = styled(Button)({
  backgroundColor: "#7e22ce",
  "&:hover": {
    backgroundColor: "#6a1ab9",
  },
  marginTop: "1.5rem",
});

const StyledLink = styled(Link)({
  marginTop: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
});

const Reset = () => {
  const { resetPasswordRequest } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    typeof window!==undefined &&localStorage.setItem("forgetemail", email);
    setLoading(true);

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await resetPasswordRequest(email);
    } catch (error) {
      console.error("Error resetting password:", error);
      setEmailError("Error resetting password");
    }

    setLoading(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
    
  return (
    <StyledContainer maxWidth="xs"> 
      <Icon sx={{ fontSize: 40, color: "purple" }} />
      <StyledBox>
        <Typography variant="h5" component="h1" gutterBottom>
          Forgot password?
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          No worries, we'll send you reset instructions.
        </Typography>
      </StyledBox>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3, width: "100%" }}
      >
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
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
        />
        <StyledButton
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          style={{ backgroundColor: "purple" }}
        >
          {loading ? <CircularProgress size={24} /> : "Reset password"}
        </StyledButton>
      </Box>
      <StyledLink href="/login">
        <Typography variant="body2" style={{ color: "purple" }}>
          ← Back to log in
        </Typography>
      </StyledLink>
    </StyledContainer>
  );
};

export default Reset;
