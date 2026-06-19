"use client";
import gsap from "gsap";
import Link from "next/link";
import { ShapeRendering } from "../../../svg/index";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import hero_bg from "../../../public/assets/img/home-1/hero/bg.png";
import home1 from "../../../public/assets/img/homeatlas/home1.jpeg";
import home2 from "../../../public/assets/img/home/homeImage2.jpeg";

// import home2 from "../../../public/assets/img/homeatlas/home2.jpg";
// import home3 from "../../../public/assets/img/homeatlas/home3.jpeg";
import home3 from "../../../public/assets/img/home/HomeImage.jpeg";

import { Box, Button } from "@mui/material";
import QuoteModal from "./QuoteModal";

const masthead_info = [
  // {
  //   id: 1,
  //   icon: masthead_icon_1,
  //   text: "Over 12 million students",
  // },
  // {
  //   id: 2,
  //   icon: masthead_icon_2,
  //   text: "More than 60,000 courses",
  // },
  // {
  //   id: 3,
  //   icon: masthead_icon_3,
  //   text: "Learn anything online",
  // },
];

const hero_content = {
  // title: "Capture Moments! Book with Atlas Foto Booth for your Memorable Event",
  title: (
    <>
      Capture Moments! Book with Atlas!
      {/* Fotobooth for your Memorable Event */}
    </>
  ),
  text_underline: "Atlasfotobooth",
  info_hero: <>Make Your Event Experiences Memorable Moments!</>,
  starts: [
    "icon-star text-yellow-1 text-11",
    "icon-star text-yellow-1 text-11",
    "icon-star text-yellow-1 text-11",
    "icon-star text-yellow-1 text-11",
    "icon-star text-yellow-1 text-11",
  ],
};
const { title, text_underline, info_hero, starts } = hero_content;

const HomeHero = () => {
  useEffect(() => {
    const parallaxIt = () => {
      const target = document.querySelectorAll(".js-mouse-move-container");

      target.forEach((container) => {
        const targets = container.querySelectorAll(".js-mouse-move");

        targets.forEach((el) => {
          const movement = el.getAttribute("data-move");

          document.addEventListener("mousemove", (e) => {
            const relX = e.pageX - container.offsetLeft;
            const relY = e.pageY - container.offsetTop;

            gsap.to(el, {
              x:
                ((relX - container.offsetWidth / 2) / container.offsetWidth) *
                Number(movement),
              y:
                ((relY - container.offsetHeight / 2) / container.offsetHeight) *
                Number(movement),
              duration: 0.2,
            });
          });
        });
      });
    };

    parallaxIt();
  }, []);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <section className="masthead -type-1 js-mouse-move-container">
        <div className="masthead__bg">
          <Image src={hero_bg} alt="image" height={100} width={100} style={{ width: 'auto', height: 'auto' }}/>
        </div>

        <Box
          className="container"
          sx={{ marginTop: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 } }}
        >
          <div className="row y-gap-30 justify-between items-end">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-10">
              <div
                className="masthead__content"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <p className="home__title heading">{title} </p>
                {/* <p className="home__title text-green-1 underline">
                  {text_underline}
                </p> */}
                <p
                  data-aos="fade-up"
                  data-aos-duration="100"
                  className="masthead__text para"
                >
                  {info_hero}
                </p>
                {/* <div
                  data-aos="fade-up"
                  data-aos-duration="200"
                  className="masthead__buttons row x-gap-10 y-gap-10"
                >
                  <div className="col-12 col-sm-auto">
                    <Button
                      variant="contained"
                      className="button -md -purple-1 text-white button-font"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                        },
                      }}
                      onClick={handleClickOpen}
                    >
                      Get My Quote
                    </Button>
                    <QuoteModal open={open} handleClose={handleClose} />
                  </div>
                  <div className="col-12 col-sm-auto">
                    <Link
                      data-barba
                      href="/photo-booth"
                      className="button -md -outline-green-1 text-green-1 button-font"
                    >
                      Explore Our Photo Booths
                    </Link>
                  </div>
                </div> */}
                <div
                  data-aos="fade-up"
                  data-aos-duration="200"
                  className="masthead__buttons row x-gap-10 y-gap-10"
                >
                  <div className="col-12 col-sm-auto">
                    <Button
                      variant="contained"
                      className="button -md -purple-1 text-white button-font"
                      sx={{
                        width: {
                          xs: "100%", // Full width for small screens
                          sm: "100%",
                          lg: "auto", // Adjust for larger screens if needed
                        },
                      }}
                      onClick={handleClickOpen}
                    >
                      Get My Quote
                    </Button>
                    <QuoteModal open={open} handleClose={handleClose} />
                  </div>
                  <div className="col-12 col-sm-auto">
                    <Link
                      data-barba
                      href="/photo-booth"
                      className="button -md -outline-green-1 text-green-1 button-font"
                      style={{
                        display: "block",
                        width: "100%", // Same full width styling
                        lineHeight: "30px"
                      }}
                    >
                      Explore Our Photo Booths
                    </Link>
                  </div>
                </div>

                <div
                  data-aos="fade-up"
                  data-aos-duration="300"
                  className="masthead-info row sm:d-none"
                  style={{ marginTop: "100px" }}
                >
                  {masthead_info.map((item, i) => (
                    <div
                      key={i}
                      className="masthead-info__item d-flex items-center text-white"
                    >
                      <div className="masthead-info__icon mr-10">
                        <Image src={item.icon} alt="icon" height={100} width={100} />
                      </div>
                      <div className="masthead-info__title lh-1">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Box
              className="col-xl-6 col-lg-6 col-md-6"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              <Box className="masthead-image">
                <div className="masthead-image__el1">
                  <Image
                    className="js-mouse-move brd-10 home-three-images"
                    data-move="40"
                    style={{
                      objectFit: "cover",
                      height: "400px",
                      width: "300px",
                    }}
                    src={home1}
                    width={1000}
                    height={1000}
                    alt="image"
                  />
                </div>

                <div className="masthead-image__el2">
                  <Image
                    className="js-mouse-move brd-10"
                    data-move="70"
                    src={home2}
                    style={{
                      objectFit: "cover",
                      height: "200px",
                      width: "200px",
                    }}
                    alt="image"
                  />
                </div>

                <div className="masthead-image__el3">
                  <Image
                    className="js-mouse-move brd-10"
                    data-move="40"
                    src={home3}
                    style={{
                      objectFit: "cover",
                      height: "200px",
                      width: "200px",
                    }}
                    alt="image"
                  />
                </div>
              </Box>
            </Box>
          </div>
        </Box>

        {/* animated shape start */}
        <ShapeRendering />
        {/* animated shape end */}
      </section>
    </>
  );
};

export default HomeHero;
