"use client";
import { useState, useEffect } from "react";
import React from "react";
import { learningJourney } from "../../data/learningPaths";
import { AddonsData } from "../../data/learningPaths";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography } from "@mui/material";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/swiper-bundle.min.css';
// import { Autoplay } from 'swiper'

import Image from "next/image";
export default function Addons() {
  // const [showSlider, setShowSlider] = useState(false);
  // useEffect(() => {
  //   setShowSlider(true);
  // }, []);
  return (
    <>
      <section className="section-bg layout-pt-lg layout-pb-md px-20">
        <div className="section-bg__item -full -height-half bg-dark-5"></div>
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle">
              <h2 className="sectionTitle__title text-white">
                Know about our Addons!
              </h2>
            </div>
          </div>
        </div>

        <div className="pt-60 lg:pt-50 px-0 js-section-slider position-relative">
          {/* Swiper Container */}
          <div
            className="swiper-container relative"
            style={{ position: "relative" }}
          >
            {/* Left Navigation Button */}
            <button
              className="swiper-button-prev icon-arrow-left-event-four"
              style={{
                position: "absolute",
                left: "10px", // Adjust the position from the left of the container
                top: "50%", // Align vertically in the center
                transform: "translateY(-50%)", // Corrects vertical positioning
                backgroundColor: "purple",
                padding: "10px 20px",
                border: "none",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: "10", // Make sure the button stays on top
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#D8BFD8"; // Darken on hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "purple"; // Reset on hover out
              }}
            >
              <i
                className="icon icon-arrow-left"
                style={{ color: "white", fontSize: "20px" }}
              ></i>
            </button>

            {/* Swiper Component */}
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              loop={true}
              modules={[Navigation, Autoplay]}
              breakpoints={{
                576: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 15 },
                1300: { slidesPerView: 6, spaceBetween: 15 },
              }}
              className="h-full"
            >
              {AddonsData.map((elm, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="coursesCard -type-2 text-center pt-30 pb-40 px-30 rounded-8 bg-white shadow-2"
                    data-aos="fade-right"
                    data-aos-duration={(index + 1) * 250}
                    style={{ height: "250px" }}
                  >
                    <div className="coursesCard__image">
                      <Image
                        width={60}
                        height={60}
                        src={elm.imageSrc}
                        alt="image"
                      />
                    </div>
                    <div className="coursesCard__content mt-30">
                      <div
                        className="coursesCard__header"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <h5 className="coursesCard__title text-18 lh-1 fw-500">
                          {elm.title}
                        </h5>
                        <h5
                          className="coursesCard__title text-18 lh-1 fw-700"
                          style={{ color: "purple", marginLeft: "10px" }}
                        >
                          {elm.rate}
                        </h5>
                      </div>
                      <p className="coursesCard__text text-14 mt-10">
                        {elm.text}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Right Navigation Button */}
            <button
              className="swiper-button-next icon-arrow-right-event-four"
              style={{
                position: "absolute",
                right: "10px", // Adjust the position from the right of the container
                top: "50%", // Align vertically in the center
                transform: "translateY(-50%)", // Corrects vertical positioning
                backgroundColor: "purple",
                padding: "10px 20px",
                border: "none",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: "10", // Ensures it's on top
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#D8BFD8"; // Darken on hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "purple"; // Reset on hover out
              }}
            >
              <i
                className="icon icon-arrow-right"
                style={{ color: "white", fontSize: "20px" }}
              ></i>
            </button>
          </div>
        </div>

        {/* </div> */}
      </section>
    </>
  );
}
