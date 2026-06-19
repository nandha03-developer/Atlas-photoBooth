import { Box } from "@mui/material";
import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import ProfileForm from "../../../components/others/ProfileForm";
import React from "react";
import FooterOne from "../../../components/layout/footers/FooterOne";
export const metadata = {
  title:
    "Sign up || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
};
export default function page() {
  return (
    <>
    {/* <div className="main-content  ">
      <Preloader />
      <Header />
      <div
        className="content-wrapper js-content-wrapper loginBgImage"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfileForm />
      </div>
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
        <Box sx={{my:{md:5,lg:15}}} flexGrow={1} className="content-wrapper js-content-wrapper">
        <ProfileForm />
        </Box>

        {/* Footer */}
        <Box>
          <FooterOne />
        </Box>
      </Box>
    </>
  );
}
