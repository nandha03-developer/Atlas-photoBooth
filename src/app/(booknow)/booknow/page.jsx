"use client"; // Mark this as a Client Component
import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import React, { useEffect } from "react";
import QuoteForm from "../../../components/others/QuoteForm";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import FooterOne from "../../../components/layout/footers/FooterOne";
import { Box } from "@mui/material";
import login from "../../../public/assets/img/login/Login1.png";
import Image from "next/image";

// export const metadata = {
//   title:
//     "Sign up || Atlasfotobooth - Professional LMS Online Education Course NextJS Template",
//   description:
//     "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
// };

export default function page() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      
      const token =
        (typeof window !== undefined && localStorage.getItem("Accesstoken")) ||
        (typeof window !== undefined && localStorage.getItem("usersubToken"));
      if (token) {
        router.push("/booknow");
      } else {
        router.push("/login");
      }
    }
  }, []);
  useEffect(()=>{
    localStorage.removeItem("amount");
      localStorage.removeItem("paymentDetails");
  },[typeof window !== undefined &&localStorage.removeItem("amount"),
    typeof window !== undefined &&localStorage.removeItem("paymentDetails")])
  return (
    <>
      {/* <div
      className="main-content"
      style={{ height: "100%", backgroundColor: "#E0E0E0" }}
    >
      <Preloader />
      <Header />
      <div
        className="content-wrapper js-content-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <QuoteForm />
        </Suspense>
      </div>

      <FooterOne/>

    </div> */}
      {/* <div className="main-content">
        <Preloader />
        <Image
          src={login}
          height={1000}
          width={1000}
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
              <Suspense fallback={<div>Loading...</div>}>
                <QuoteForm />
              </Suspense>
            </Box>
            <FooterOne />
          </Box>
        </Box>
      </div> */}
      <div className="main-content">
        <Preloader />
        <Image
          src={login}
          height={1000}
          width={1000}
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
                flexGrow: 1, // This ensures the content area grows to fill available space
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                <QuoteForm />
              </Suspense>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 2, // Optional margin for spacing between content and footer
              flexShrink: 0, // Prevent the footer from shrinking when content grows
            }}
          >
            <FooterOne />
          </Box>
        </Box>
      </div>
    </>
  );
}
