import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import React from "react";
import OrderDetail from "../../../components/homes/thankyou/orderDetail";
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
      <div className="main-content">
        <Preloader />
        {/* <Image
          src={login}
          height={10000}
          width={10000}
          alt=""
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            zIndex: -1,
          }}
        /> */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(5px)",
            }}
          >
            <Header />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OrderDetail />
            </Box>
            <FooterOne />
          </Box>
        </Box>
      </div>
    {/* <div className="main-content">
      <Preloader />
      <Header />
      <div className="content-wrapper js-content-wrapper">
        <OrderDetail />
      </div>
      <FooterOne/>
    </div> */}
    </>
  );
}
