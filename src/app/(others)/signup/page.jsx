import Image from "next/image";
import Preloader from "../../../components/common/Preloader";
import FooterOne from "../../../components/layout/footers/FooterOne";
import Header from "../../../components/layout/headers/Header";
import SignUpForm from "../../../components/others/SignUpForm";
import login from "../../../public/assets/img/login/Login1.png";
import React from "react";
import { Box } from "@mui/material";

export const metadata = {
  title:
    "Sign up || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};
export default function page() {
  return (
    <>
    <div className="main-content">
  <Preloader />
  {/* Background Image */}
  <Image
    src={login}
    height={1000}
    width={1000}
    alt=""
    style={{
      position: "fixed", // Fixed positioning to cover entire viewport
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh", // Covers full height of the viewport
      objectFit: "cover",
      zIndex: -1, // Places it behind all other content
    }}
  />
  <Box
    sx={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh", // Ensures the Box spans the full height
    }}
  >
    <Box
      sx={{
        position: "sticky", // Keeps the Header fixed at the top
        top: 0, // Sticks to the top
        zIndex: 2, // Ensure it stays above the background
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Optional: Adds a semi-transparent background to the header
        backdropFilter: "blur(5px)", // Optional: Adds a blur effect
      }}
    >
      <Header />
    </Box>

    {/* Scrollable LoginForm and Footer */}
    <Box
      sx={{
        flexGrow: 1, // Pushes Footer to the bottom
        display: "flex",
        flexDirection: "column",
        overflowY: "auto", // Enables scrolling for this content
        position: "relative",
        zIndex: 1, // Ensures LoginForm is above the background
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "2rem",
        }}
      >
        <SignUpForm />
      </Box>
      <FooterOne />
    </Box>
  </Box>
</div>
    {/* <div className="main-content  ">
      <Preloader />
      <Header />
      <div
        className="content-wrapper js-content-wrapper loginBgImage"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "scroll",
        }}
      >
        <SignUpForm />
      </div>
      <FooterOne/>
    </div> */}
    </>
  );
}
