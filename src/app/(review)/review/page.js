import React from "react";
import TestimonialsFour from "../../../components/homes/testimonials/TestimonialsFour";
// import LearningSelection2 from "../../../components/homes/LearningSelection2";
import LearningSelection2 from "../../../components/homes/LearningSelection2";

import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import FooterOne from "../../../components/layout/footers/FooterOne";
import { Box } from "@mui/material";
export const metadata = {
  title:
    "Review || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Atlas Photo Booth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths",
};

export default function page() {
  return (
    <>
      {/* <div className="main-content">
        <Preloader />
        <Header />
      </div>
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <LearningSelection2 />
        <TestimonialsFour />
        <FooterOne />
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
        <Box flexGrow={1} className="content-wrapper js-content-wrapper">
          <LearningSelection2 />
          <TestimonialsFour />
        </Box>

        {/* Footer */}
        <Box>
          <FooterOne />
        </Box>
      </Box>
    </>
  );
}
