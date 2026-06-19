import { Box } from "@mui/material";
import Preloader from "../../../components/common/Preloader";
import ContactOne from "../../../components/contacts/ContactOne";
import FooterOne from "../../../components/layout/footers/FooterOne";
import Header from "../../../components/layout/headers/Header";
import React from "react";

export const metadata = {
  title:
    "Contact-Us || Atlas fotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Atlas fotobooth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths",
};

export default function page() {
  return (
    <>
      {/* <div className="main-content">
      <Preloader />
      <Header />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        <ContactOne />
        <FooterOne />
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
        <Box
          flexGrow={1}
          className="content-wrapper js-content-wrapper"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ContactOne />
        </Box>

        {/* Footer */}
        <Box>
          <FooterOne />
        </Box>
      </Box>
    </>
  );
}
