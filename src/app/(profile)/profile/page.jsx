import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import React from "react";
import Profile from "../../../components/profile/profile";
import FooterOne from "../../../components/layout/footers/FooterOne";
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
      {/* <div className="main-content">
      <Preloader />
      <Header />
      <div className="content-wrapper js-content-wrapper mb-60">
        <Profile/>
      </div>
      <FooterOne/>
    </div> */}
      <Box
        display="flex"
        flexDirection="column"
        minHeight="100vh" // Ensures the layout fills the viewport height
      >
        {/* Header */}
        <Box>
          <Preloader />
          <Header />
        </Box>

        {/* Main Content */}
        <Box
          flexGrow={1}
          className="content-wrapper js-content-wrapper"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py:{lg:10,md:5,sm:3}
          }}
        >
          <Profile />
        </Box>

        {/* Footer */}
        <Box>
          <FooterOne />
        </Box>
      </Box>
    </>
  );
}
