'use client';
import { useState } from "react";
import Link from "next/link";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import useAuth from "../../hook/registerHook/useAuth";

function Reset() {
  const { resetPasswordRequest } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear the email error when the user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await resetPasswordRequest(email);
      // Perform any additional actions here
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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reset password
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          Enter your email to reset your password.
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Enter your email"
          variant="outlined"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Link href="/" passHref>
          <Button variant="text" color="primary">
            Back to homepage
          </Button>
        </Link>
      </Box>
    </Container>
  );
}

export default Reset;
