'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Box } from "@mui/material";

export default function Join() {
const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = typeof window!==undefined && localStorage.getItem("Accesstoken")||typeof window!==undefined && localStorage.getItem("usersubToken");
      setToken(token);
    }
  }, [typeof window !== "undefined"&& localStorage.getItem("Accesstoken")||typeof window !== "undefined"&&localStorage.getItem("usersubToken")]);
  return (
    <section className="layout-pt-md layout-pb-md bg-purple-1">
      <div className="container">
        <div className="row y-gap-20 justify-between items-center">
          <div className="col-xl-4 col-lg-5">
            <p className="text-30 lh-15 text-white heading">
              Book your Events today
              <span className="text-green-1 heading"> 8k Happy renters</span>
            </p>
          </div>

          <Box sx={{display:{xs:"none",sm: "none",md:"flex",lg:"flex",xl:"flex"}}} className="col-auto">{token?(<Link href="/booknow" className="button -md -green-1 text-dark-1">
             Booking Now
            </Link>):(<Link href="/login" className="button -md -green-1 text-dark-1">
             Booking Now
            </Link>)}
          </Box>
        </div>
        <Box
            className="col-auto"
            sx={{mt:3,
              display:{xs:"flex",sm: "flex",md:"none",lg:"none",xl:"none"},
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            {token ? (
              <Link href="/booknow" className="button -md -green-1 text-dark-1">
                Booking Now
              </Link>
            ) : (
              <Link href="/login" className="button -md -green-1 text-dark-1">
                Booking Now
              </Link>
            )}
          </Box>
      </div>
    </section>
  );
}
