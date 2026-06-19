"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
// import { Navigation, Pagination } from "swiper";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

import { events } from "../../../data/events";

import Link from "next/link";
export default function EventsFour() {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    setShowSlider(true);
  }, []);
  return (
    <section className="layout-pt-lg layout-pb-lg border-top-light">
  <div className="container position-relative">
    <div className="row justify-center text-center">
      <div className="col-auto">
        <div className="sectionTitle ">
          <p className="sectionTitle__title heading" style={{fontSize:"30px", fontWeight:"bold"}}>Upcoming Events</p>
        
        </div>
      </div>
    </div>

    <div className="pt-60 lg:pt-50 js-section-slider position-relative">
  {/* Left Navigation Button */}
  {/* <button className="swiper-button-prev icon-arrow-left-event-four"> */}
    <img src="/assets/img/arrow/left-arrow.png" alt="arrow"className="swiper-button-prev icon-arrow-left-event-four" style={{ width: '24px', height: '24px',marginLeft:"-13px", marginTop:"10px" }} />
  {/* </button> */}

  {showSlider && (
    <div className="swiper-container">
      <Swiper
        className="swiper-wrapper overflow-visible"
        modules={[Navigation, Pagination]}
        pagination={{
          el: ".event-four-pagination",
          clickable: true,
        }}
        navigation={{
          nextEl: ".icon-arrow-right-event-four",
          prevEl: ".icon-arrow-left-event-four",
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          450: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
      >
        {events.slice(0, 6).map((elm, i) => (
          <SwiperSlide key={i} className="swiper-slide">
            <div className="eventCard-container">
              <div className="eventCard -type-3 text-20 bg-light-4 rounded-8">
                <div className="eventCard__date">
                  <p className="heading" style={{fontSize:"20px", fontWeight:"bold"}}>
                  {elm.title}
                  </p>
                  
                  </div>
                <p className="eventCard__title para text-16 lh-15 fw-500" style={{fontSize:"16px", color:"#000" }}>
                  {elm.desc}
                </p>
                <div>
                  <Image src={elm.imgSrc} height={200} width={200} alt="" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )}


    <img src="/assets/img/arrow/right-arrow.png" alt="arrow" className="swiper-button-next icon-arrow-right-event-four" style={{ width: '24px', height: '24px' }} />
  {/* </button> */}

  <div className="d-flex justify-center x-gap-15 items-center pt-60 lg:pt-40">
    <div className="col-auto">
      <div className="pagination -arrows js-pagination event-four-pagination"></div>
    </div>
  </div>
</div>

  </div>
</section>

  );
}
