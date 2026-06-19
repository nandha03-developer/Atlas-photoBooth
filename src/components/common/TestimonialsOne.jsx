"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import { whatsIncluded } from "../../data/whatsIncluded";
import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

export default function TestimonialsOne() {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    setShowSlider(true);
  }, []);
  return (
    <section className="layout-pt-lg mt-80 layout-pb-lg bg-purple-1">
      <div className="container ">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <div className="sectionTitle ">
              <p
                className="sectionTitle__title text-green-1 heading"
                style={{ letterSpacing: "1px" }}
              >
                Whats Included
              </p>
              <p className="sectionTitle__text para text-white ">
                Explore our diverse offerings for every occasion.
              </p>
            </div>
          </div>
        </div>

        <div className="js-section-slider pt-50">
          {showSlider && (
            <Swiper
              className="overflow-visible"
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: ".right",
                prevEl: ".left",
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              loop={true}
              spaceBetween={30}
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
              {whatsIncluded.map((elm, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <div
                    className="testimonials -type-1"
                    data-aos="fade-left"
                    data-aos-duration={(i + 1) * 550}
                  >
                    <div className="testimonials__content1">
                      <div className="testimonials-footer1">
                        <div className="testimonials-footer__image">
                          <Image
                            className="brd-10"
                            width={60}
                            height={60}
                            src={`/assets/img/home/${elm.imageSrc}`}
                            alt="image"
                          />
                        </div>
                      </div>
                      <p
                        className="testimonials__title heading"
                        style={{ fontSize: "22px" }}
                      >
                        {elm.title}
                      </p>
                      <p className="testimonials__text para" style={{ fontSize: "16px" }}>{`“${elm.des}”`}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="d-flex x-gap-20 items-center justify-center pt-60 lg:pt-40">
            <div className="col-auto left">
              <button className="button -outline-white text-white size-50 rounded-full d-flex justify-center items-center js-prev">
                <i className="icon icon-arrow-left text-24"></i>
              </button>
            </div>
            <div className="col-auto right">
              <button className="button -outline-white text-white size-50 rounded-full d-flex justify-center items-center js-next">
                <i className="icon icon-arrow-right text-24"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
