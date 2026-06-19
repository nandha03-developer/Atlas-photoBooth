"use client";
import React, { useEffect } from "react";
import GalleryTab from "../../../components/homes/heros/GalleryTabs";
import FooterOne from "../../../components/layout/footers/FooterOne";
import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import Image from "next/image";
import bgImage from "../../../public/assets/img/loginBg/bg1.avif";

export default function page() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        (typeof window !== undefined && localStorage.getItem("Accesstoken")) ||
        (typeof window !== undefined && localStorage.getItem("usersubToken"));
      if (token) {
        router.push("/gallery");
      } else {
        router.push("/");
      }
    }
  }, []);
  return (
    <>
      {/* <div className='main-content'>
    <Preloader/>
        <Header/>
    </div>
     <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <GalleryTab/>
        <FooterOne/>
     </div> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures the container takes full viewport height
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Main content area */}
          <Box>
            <Preloader />
            <Header />
          </Box>
          {/* className="bg-image" */}
          {/* <Box className="content-wrapper js-content-wrapper overflow-hidden bg-image1">
          <GalleryTab />
        </Box> */}
          <Box
            className="content-wrapper js-content-wrapper overflow-hidden"
            // sx={{
            //   position: "relative",
            //   width: "100%",
            //   height: { lg: "80vh", md: "80vh", sm: "70vh" },
            //   display: "flex",
            //   flexDirection: "column",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   paddingTop: { lg: 10, md: 10, sm: 5 },
            //   paddingBottom: { lg: 10, md: 10, sm: 5 },
            // }}
          >
            {/* Background Image */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: -1,
              }}
            >
              {/* <Image
                src={bgImage}
                alt="Background"
                layout="fill"
                objectFit="cover"
                quality={100} // Ensures high image clarity
                priority={true} // Optimize image for initial load
              /> */}
            </Box>

            {/* Content */}
            <GalleryTab />
          </Box>
        </Box>
        {/* Footer */}
        <Box
          component="footer"
          sx={{
            position:"relative",
            // mt: "auto", // Pushes the footer to the bottom
            // bgcolor: "primary.main", // Adjust background color as needed
            color: "white", // Adjust text color as needed
            // py: 2, // Padding for the footer
            textAlign: "center", // Center-align the content
            top:{lg:150,md:100,sm:150}
          }}
        >
          <FooterOne />
        </Box>
      </Box>
    </>
  );
}
