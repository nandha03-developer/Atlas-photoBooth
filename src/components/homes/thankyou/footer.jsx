"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";
import { Box, Stack } from "@mui/material";

export default function Footer() {
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#140342",
          }}
        >
          <Stack direction="column">
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "-35px",
              }}
            >
              <Image
                src="/assets/img/whiteLogo/logo72.svg"
                alt="logo"
                width={100}
                height={100}
                style={{ height: "auto" }}
                priority
              />
            </Box>
            <p
              className="text-18"
              style={{ marginTop: "-45px", marginBottom: "20px" }}
            >
              AtlasfotoBooth – 2024 ALL RIGHTS RESERVED
            </p>
          </Stack>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
      </div>
    </>
  );
}
