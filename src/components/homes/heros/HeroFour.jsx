"use client";
import { Typography } from "@mui/material";
import gsap from "gsap";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useEffect, useRef, useState } from "react";
import { events } from "../../../data/events";
import { List, OrderedSet } from "immutable";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dynamic from "next/dynamic";
import axios from "axios";

const Editor =
  typeof window !== "undefined"
    ? dynamic(() =>
        import("react-draft-wysiwyg").then((module) => module.Editor)
      )
    : undefined;

export default function HeroFour() {
  const [purpose, setPurpose] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState([]);
  const [editorState, setEditorState] = useState("");
  const [editorStateEvent, setEditorStateEvent] = useState("");

  const [loading, setLoading] = React.useState(false);
  const [showSlider, setShowSlider] = useState(false);

  const customStyleMap = {
    RED: {
      color: "rgb(209,72,65)",
    },
    BOLD: {
      fontWeight: "bold",
    },
    BULLET: {
      listStyleType: "bullet",
    },
    NUMBER: {
      listStyleType: "decimal",
    },
    COLOR: (color) => ({
      color: color,
    }),
  };
  const fetchPurpose = () => {
    setLoading(true);
    const query = `
    query MyQuery {
  listPurposes {
    Totalcount
    items {
      ID
      MainContent
      MainImage
      Title
    }
  }
  listUpcomingEvents {
    items {
      id
      pid
      EventTitle
      EventImage
      EventDescription
    }
  }
}`;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const purpose = res.data?.data?.listPurposes?.items || [];
        const events = res.data?.data?.listUpcomingEvents?.items || [];
        setPurpose(purpose);
        setUpcomingEvents(events);
        const editorContent = purpose.map((pkg) => {
          const blocksFromHTML = convertFromHTML(pkg.MainContent || "");
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          return EditorState.createWithContent(contentState);
        });
        const editorContentEvent = events.map((pkg) => {
          const blocksFromHTML = convertFromHTML(pkg.EventDescription || "");
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          return EditorState.createWithContent(contentState);
        });
        setEditorState(editorContent);
        setEditorStateEvent(editorContentEvent);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };
  const hasSubmitted = useRef(false);
  useEffect(() => {
    setShowSlider(true);
    if (!hasSubmitted.current) {
      // fetchAddOns();
      // fetchPackages();
      // fetchOccasions();
      fetchPurpose();
      hasSubmitted.current = true;
    }
  }, []);

  const createEditorStateFromHTML = (html) => {
    if (html) {
      html = html.replace(/^"|"$/g, "");
      html = html.replace(/\\"/g, '"').replace(/\\n/g, "");

      const blocksFromHTML = convertFromHTML(html);
      const updatedBlocks = blocksFromHTML.contentBlocks.map((block) => {
        if (block.getType() === "unordered-list-item") {
          return block.set("data", OrderedSet.of("BULLET"));
        }
        if (block.getType() === "ordered-list-item") {
          return block.set("data", OrderedSet.of("NUMBER"));
        }
        return block;
      });

      const updatedContentState = ContentState.createFromBlockArray(
        List(updatedBlocks),
        blocksFromHTML.entityMap
      );
      const editorState = EditorState.createWithContent(updatedContentState);
      return editorState;
    }
    return EditorState.createEmpty();
  };
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

  useEffect(() => {
    if (purpose && purpose.MainContent) {
      const editorStateFromAPI = createEditorStateFromHTML(purpose.MainContent);
      setEditorState(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [editorState]);
  useEffect(() => {
    if (events && events.EventDescription) {
      const editorStateFromAPI = createEditorStateFromHTML(
        events.EventDescription
      );
      setEditorStateEvent(editorStateFromAPI || EditorState.createEmpty());
    }
  }, [editorStateEvent]);
  return (
    <>
      <section className="masthead -type-3 bg-light-6 js-mouse-move-container">
  <div className="container mt-60 d-flex justify-content-center">
    {purpose.length === 0 ? (
      <div
        className="page-header__title heading"
        style={{
          fontSize: "3rem",
          lineHeight: "1.2",
          color: "#000",
          fontWeight: "bold",
          background:
            "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-loading 1.5s infinite",
          borderRadius: "4px",
          width: "50%",
          height: "40px",
          margin: "0 auto",
        }}
      ></div>
    ) : (
      <p
        className="page-header__title heading"
        style={{
          fontSize: "3rem",
          lineHeight: "1.2",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        Purpose of Business {/* {purpose[0].Title} */}
      </p>
    )}
  </div>

  <div>
    {purpose.length === 0 ? (
      <div className="container mt-90">
        <div
          style={{
            height: "40px",
            width: "50%",
            background:
              "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-loading 1.5s infinite",
            borderRadius: "4px",
            margin: "0 auto 20px auto",
          }}
        ></div>
        <div className="row y-gap-30 items-center justify-center">
          <div className="col-md col-xl-7 col-lg-11 relative z-5">
            <div
              style={{
                height: "20px",
                width: "100%",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton-loading 1.5s infinite",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            ></div>
            <div
              style={{
                height: "20px",
                width: "100%",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton-loading 1.5s infinite",
                borderRadius: "4px",
                marginBottom: "10px",
              }}
            ></div>
          </div>

          <div className="col-xl-5 col-lg-7 relative z-2">
            <div
              style={{
                height: "400px",
                width: "340px",
                background:
                  "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
                backgroundSize: "200% 100%",
                animation: "skeleton-loading 1.5s infinite",
                borderRadius: "10px",
                margin: "0 auto",
              }}
            ></div>
          </div>
        </div>
      </div>
    ) : (
      purpose.map((pkg, index) => (
        <div key={index}>
          <div className="page-header__text heading text-30 text-dark-4 d-flex justify-content-center pt-20 z-1">
            {pkg.Title}
          </div>

          <div className="container mt-90">
            <div className="row y-gap-30 items-center justify-center">
              <div
                className="col-md col-xl-7 col-lg-11 relative z-5"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="masthead__content pl-32 lg:pl-0">
                  <Typography
                    className="masthead__text text-dark-1 para"
                    sx={{
                      fontSize: {
                        xs: "14px",
                        sm: "16px",
                        md: "18px",
                        lg: "20px",
                      },
                      fontWeight: 550,
                      paddingTop: { xs: "20px" },
                      lineHeight: 2,
                    }}
                  >
                    {editorState[index] && (
                      <Editor
                        editorState={editorState[index]}
                        toolbarHidden
                        readOnly
                        wrapperClassName="editor-wrapper"
                        editorClassName="editor-content"
                        toolbarClassName="editor-toolbar"
                        customStyleMap={customStyleMap}
                      />
                    )}
                  </Typography>
                </div>
              </div>

              <div
                className="col-xl-5 col-lg-7 relative z-2"
                data-aos="fade-up"
                data-aos-delay="750"
              >
                <div className="masthead-image">
                  <Image
                    width={400}
                    height={400}
                    style={{ height: "400px", width: "340px" }}
                    data-move="20"
                    className="js-mouse-move brd-10"
                    src={pkg.MainImage}
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
</section>



<section className="layout-pt-lg layout-pb-lg border-top-light">
        <div className="container position-relative">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle ">
                <p
                  className="sectionTitle__title heading"
                  style={{ fontSize: "30px", fontWeight: "bold" }}
                >
                  Upcoming Events
                </p>
              </div>
            </div>
          </div>

          <div className="pt-60 lg:pt-50 js-section-slider position-relative">
            <img
              src="/assets/img/arrow/left-arrow.png"
              alt="arrow"
              className="swiper-button-prev icon-arrow-left-event-four"
              style={{
                width: "24px",
                height: "24px",
                marginLeft: "-13px",
                marginTop: "10px",
              }}
            />

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
                  {upcomingEvents.slice(0, 6).map((elm, i) => (
                    <SwiperSlide key={i} className="swiper-slide">
                      <div className="eventCard-container">
                        <div className="eventCard -type-3 text-20 bg-light-4 rounded-8">
                          <div className="eventCard__date">
                            <p
                              className="heading"
                              style={{ fontSize: "20px", fontWeight: "bold" }}
                            >
                              {elm.EventTitle}
                            </p>
                          </div>
                          {/* <p className="eventCard__title para text-16 lh-15 fw-500" style={{ fontSize: "16px", color: "#000" }}>
                            {elm.EventDescription}
                          </p> */}
                          {editorStateEvent[i] && (
                            <Editor
                              editorState={editorStateEvent[i]}
                              toolbarHidden
                              readOnly
                              wrapperClassName="editor-wrapper"
                              editorClassName="editor-content"
                              toolbarClassName="editor-toolbar"
                              customStyleMap={customStyleMap}
                            />
                          )}
                          <div>
                            <Image
                              src={elm.EventImage}
                              height={200}
                              width={200}
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <img
              src="/assets/img/arrow/right-arrow.png"
              alt="arrow"
              className="swiper-button-next icon-arrow-right-event-four"
              style={{ width: "24px", height: "24px" }}
            />

            <div className="d-flex justify-center x-gap-15 items-center pt-60 lg:pt-40">
              <div className="col-auto">
                <div className="pagination -arrows js-pagination event-four-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
