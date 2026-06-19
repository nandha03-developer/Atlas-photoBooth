import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import LoginForm from "../../../components/others/LoginForm";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import FooterOne from "../../../components/layout/footers/FooterOne";
import Image from "next/image";
import BgImage from "../../../public/assets/img/loginBg/loginBg2.svg";
import login from "../../../public/assets/img/login/Login1.png";
import { Box } from "@mui/material";

export const metadata = {
  title:
    "Login || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Atlas Photo Booth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths.",
};
export default function page() {
  return (
    <>
      <div className="main-content">
        <Preloader />
        <Image
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
        />
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
              <LoginForm />
            </Box>
            <FooterOne />
          </Box>
        </Box>
      </div>
    </>
  );
}
