"use client";

import React, { useRef, useState, useEffect } from "react";
import useRegister from "../../hook/useRegister";
import Lottie from "lottie-react";
import mailData from "../../Animation - 1724911498333.json";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import OtpInputGroup from "./otpInputfield";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { LottieRefCurrentProps } from "lottie-react";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

const OtpComponent = () => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const router = useRouter();
  const { confirm, resendOtp, loading } = useRegister();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("userEmail") || "";
      setUsername(userEmail);
    }
  }, []); // Run once on component mount

  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(120); // Start with 120 seconds

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false); // Enable the resend button after timer ends
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup interval on component unmount
    };
  }, [resendDisabled, timer]);

  const handleContinueClick = () => {
    if (
      inputValues.input1 &&
      inputValues.input2 &&
      inputValues.input3 &&
      inputValues.input4 &&
      inputValues.input5 &&
      inputValues.input6
    ) {
      const otpValue = getOTPValue();
      confirm(otpValue, username);
    } else {
      toast.error("Please enter OTP");
    }
  };

  const getOTPValue = () => {
    const otpValuesArray = Object.values(inputValues);
    return otpValuesArray.join("");
  };

  const handleResendCode = () => {
    if (!resendDisabled && username) {
      resendOtp(username);
      setResendDisabled(true); // Disable the resend button after clicking
      setTimer(120); // Reset timer for another 2 minutes
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleContinueClick();
    }
  };

  return (
    <>
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="pt-70">
          <Image
            width={120}
            height={100}
            src="/assets/img/logo/logo72.svg"
            alt="LaabamOne"
            style={{ marginLeft: "10px", width: "120px", height: "100px" }}
          />
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              className="box-signup"
              style={{ width: "50%", textAlign: "left" }}
              onKeyDown={handleKeyDown} // Attach the keyDown handler here
            >
              <h1
                className="text-heading-3 mb-20"
                style={{ fontSize: "24px", fontWeight: "bold" }}
              >
                Verify Your Account
              </h1>
              <p style={{ fontSize: "16px", marginBottom: "30px" }}>
                We have sent your verification link to{" "}
                <span style={{ fontWeight: "bold" }}>{username}</span>
              </p>
              <p style={{ fontSize: "16px", marginBottom: "10px" }}>
                Enter Code
              </p>
              <div className="form-field mb-50">
                <OtpInputGroup
                  setInputValues={setInputValues}
                  inputValues={inputValues}
                />
              </div>
              <p
                className="text-heading-6 mb-20"
                style={{
                  fontSize: "14px",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                Didn't receive the OTP?
                <span
                  onClick={handleResendCode}
                  style={{
                    fontSize: "14px",
                    cursor: resendDisabled ? "default" : "pointer",
                    fontWeight: "bold",
                    color: resendDisabled ? "#c0c0c0" : "#9c27b0",
                    marginLeft: "5px",
                  }}
                >
                  {resendDisabled
                    ? `(${Math.floor(timer / 60)}:${
                        timer % 60 < 10 ? "0" : ""
                      }${timer % 60})`
                    : "Resend"}
                </span>
              </p>
              <div className="form-group">
                <button
                  className="btn btn-square"
                  onClick={handleContinueClick}
                  disabled={loading}
                >
                  {loading ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        py: 1,
                        padding: "7px 0",
                        backgroundColor: "#800080", // Purple color
                        "&:hover": {
                          backgroundColor: "#4B0082", // Darker purple color
                        },
                      }}
                    >
                      <CircularProgress size={30} />
                    </Button>
                  ) : (
                    <div style={{ width: "70px" }}>
                      <ColorButton variant="contained">Verify</ColorButton>
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div style={{ width: "40%", textAlign: "right" }}>
              <Lottie
                animationData={mailData}
                lottieRef={lottieRef}
                loop
                autoplay
              />
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
      <style jsx>{`
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
        .fade-appear {
          opacity: 0;
        }
        .fade-appear-active {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
      `}</style>
    </>
  );
};

export default OtpComponent;