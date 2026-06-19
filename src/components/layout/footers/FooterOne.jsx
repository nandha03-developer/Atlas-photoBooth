"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Socials from "../../../components/common/Socials";
import { Box } from "@mui/material";

export default function FooterOne() {
  return (
    <footer className="footer bg-dark-1 text-white py-50">
      <div className="container">
        <Box
          sx={{
            mt: 3,
            display: {
              xs: "flex",
              sm: "flex",
              md: "none",
              lg: "none",
              xl: "none",
            },
            justifyContent: { xs: "center", md: "flex-end" },
          }}
          className="col-auto"
        >
          <div className="footer-logo">
            <Image
              src="/assets/img/whiteLogo/logo50.svg"
              alt="logo"
              width={170}
              height={110}
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>
        </Box>
        <div className="row justify-between">
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "flex",
                lg: "flex",
                xl: "flex",
              },
            }}
            className="col-auto"
          >
            <div className="footer-logo">
              <Image
                src="/assets/img/whiteLogo/logo72.svg"
                alt="logo"
                width={170}
                height={110}
              />
            </div>
          </Box>

          <div
            className="col-auto"
            style={{ marginTop: "20px", fontSize: "18px",textAlign:"left" }}
          >
            <div className="footer-links">
              <ul className="list-none">
                <li style={{ marginTop: "15px" }}>
                  <Link href="/purpose">Purpose of Business</Link>
                </li>
                <li style={{ marginTop: "15px" }}>
                  <Link href="/review">Reviews </Link>
                </li>
                <li style={{ marginTop: "15px" }}>
                  <Link href="/package">Package </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="col-auto"
            style={{ marginTop: "20px", fontSize: "18px",textAlign:"left" }}
          >
            <div className="footer-links">
              <ul className="list-none">
                <li style={{ marginTop: "15px" }}>
                  <Link active="true" href="/faq">
                    {" "}
                    FAQs
                  </Link>
                </li>
                <li style={{ marginTop: "15px" }}>
                  <Link href="/policy"> Policy</Link>
                </li>
                <li style={{ marginTop: "15px" }}>
                  <Link href="/contactus"> Contact </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="col-auto"
            style={{ marginTop: "20px", fontSize: "18px" }}
          >
            <div className="footer-links">
              <ul className="list-none" style={{textAlign:"left"}}>
                <li style={{ marginTop: "15px", fontSize: "20px" }}>
                  <p
                    style={{
                      marginTop: "15px",
                      color: "grey",
                      fontSize: "18px",
                      
                    }}
                  >
                    Reach us
                  </p>
                  <a
                    href="tel:3017955334"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      fontSize: "18px",
                    }}
                  >
                    301-795-5334
                  </a>
                </li>
                <li style={{ marginTop: "15px", fontSize: "20px" }}>
                  {" "}
                  <p
                    style={{
                      marginTop: "15px",
                      fontSize: "18px",
                      color: "grey",
                    }}
                  >
                    Inquiries{" "}
                  </p>{" "}
                </li>
                Atlasfotobooth@gmail.com
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom mt-40 pt-30 border-top-light-15">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
              <div className="footer-copyright">
                ©{new Date().getFullYear()} Atlasfotobooth. All Rights Reserved.
              </div>
              {/* <Socials /> */}
              </div>
             
            </div>
            <div className="col-auto">
              <div className="footer-socials d-flex justify-content-end">
                <div className="footer-copyright">
                  Powered By {""} :{" "}
                  <a href="https://www.laabamone.com " target="_blank">
                    {" "}
                    {""}Laabamone{" "}
                  </a>
                </div>
             
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
