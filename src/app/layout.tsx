"use client";

import "../public/assets/sass/styles.scss";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-calendar/dist/Calendar.css";
config.autoAddCss = false;

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Context from "../context/Context";
import { UserProvider } from "../context/UserDataContext";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import { DataProvider } from "../context/useOrderDetails";
import { ToastContainer } from "react-toastify";
import Header from "../components/layout/headers/Header";
import GlobalProvider from "./GlobalProvider";

export default function RootLayout({ children }: any) {
  useEffect(() => {
    AOS.init({
      duration: 700,
      offset: 120,
      easing: "ease-out",
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Use `rel="stylesheet"` for font styles */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&display=swap"
          rel="stylesheet"
          as="style"
        />

        {/* <link rel="preload" href="style.css" /> */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto:wght@700&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <GlobalProvider>
          <Context>{children}</Context>
        </GlobalProvider>
        <ScrollToTop />
        <ToastContainer />
      </body>
    </html>
  );
}
