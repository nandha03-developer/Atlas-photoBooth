"use client";
import gsap from "gsap";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import logo from "../../public/assets/img/logo/logo72.svg";
import Lottie from "lottie-react";
import mailData from "../../Animation   1733292325889_Review (1).json";
import Skeleton from "react-loading-skeleton"; // If using react-loading-skeleton
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton styles

export default function HeroFour() {
  const lottieRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [noReviews, setNoReviews] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const formatDates = (date) => {
    // Assuming you have a function to format the date
    return new Date(date).toLocaleDateString();
  };
  const fetchData = () => {
    setLoading(true);
    const query = `
     query list {
  listReviews {
    Totalcount
    items {
      AddOns
      Address
      CityName
      CountryName
      CustomerId
      CustomerName
      Description
      DoorNo
      Image1
      Image2
      Image3
      Image4
      Image5
      OrderId
      PackageName
      PostalCode
      ProductId
      RatingValue
      ReviewDate
      StateName
      SupplierId
      Video
      id
      Ocassion
      Email
    }
  }
}
    `;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listReviews?.items || [];
        const userDatas =
          typeof window !== undefined && localStorage.getItem("userEmail");
        if (userDetails.length > 0) {
          setReviews(userDetails);
        } else {
          setNoReviews("No Reviews yet");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM"; // Determine AM/PM
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12"; // Convert 0 hours to 12

    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  };
  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <Image
  //         src={logo}
  //         alt="loading"
  //         width={100}
  //         height={100}
  //         className="zoom-image"
  //       />
  //     </div>
  //   );
  // }
  const renderSkeleton = () => (
    <div className="row y-gap-30 items-center justify-center">
      <div
        className="col-xl-9 col-lg-12 col-md-12 relative z-5"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="masthead__content pl-50 pr-10 lg:pl-0">
          <h1>
            <Skeleton width="70%" />
            <br />
            <Skeleton width="30%" />
          </h1>
          <p className="masthead__text text-10 text-dark-1 mt-25">
            <Skeleton count={3} />
          </p>
        </div>
      </div>
      <div
        className="col-xl-3 col-lg-4 col-md-12 relative z-2"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="masthead-image" style={{ marginTop: 10 }}>
          <Skeleton width={200} height={300} />
        </div>
      </div>
    </div>
  );
  return (
    <section className="masthead -type-3 bg-light-6 js-mouse-move-container">
      {reviews && reviews.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <h1 className="masthead__title">Review</h1>
        </Box>
      )}

      <div className="container mt-90">
      {loading
        ? Array(3) // Display 3 skeleton placeholders
            .fill(0)
            .map((_, index) => <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>)
        : reviews &&
          reviews.length > 0 && (
            <>
              {reviews.map((item, index) => (
                <div
                  key={index}
                  className="row y-gap-30 items-center justify-center"
                >
                  <div
                    className="col-xl-9 col-lg-12 col-md-12 relative z-5"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    <div className="masthead__content pl-50 pr-10 lg:pl-0">
                      <h1 className="">
                        {item.CustomerName}
                        <br />
                        {item.ReviewDate && (
                          <p className="text-purple-1">
                            {formatDate(item.ReviewDate)}
                          </p>
                        )}
                      </h1>
                      <p
                        className={`masthead__text text-10 text-dark-1 mt-25 
                          ${expandedIndex === index ? "" : "line-clamp"}`}
                      >
                        {item.Description}
                      </p>
                      {item.Description.split(" ").length > 8 && (
                        <button
                          onClick={() => toggleDescription(index)}
                          className="text-blue-500 mt-2 button-font"
                          style={{
                            cursor: "pointer",
                            color: "#800080",
                            fontSize: "12px",
                          }}
                        >
                          {expandedIndex === index ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    className="col-xl-3 col-lg-4 col-md-12 relative z-2"
                    data-aos="fade-up"
                    data-aos-delay="500"
                  >
                    {item.Image1 && (
                      <div className="masthead-image" style={{ marginTop: 10 }}>
                        <Image
                          width={200}
                          height={300}
                          data-move="20"
                          className="js-mouse-move brd-10"
                          src={item.Image1}
                          alt="image"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        {/* {reviews && reviews.length > 0 && (
          <>
            {reviews.map((item, index) => (
              <div
                key={index}
                className="row y-gap-30 items-center justify-center"
              >
                <div
                  className="col-xl-9 col-lg-12 col-md-12 relative z-5"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  <div
                    className="masthead__content pl-50 pr-10 lg:pl-0"
                    key={index}
                  >
                    <h1 className="">
                      {item.CustomerName}
                      <br />
                      {item.ReviewDate && (
                        <p className="text-purple-1">
                          {formatDate(item.ReviewDate)}
                        </p>
                      )}
                    </h1>

                    <p
                      className={`masthead__text text-10 text-dark-1 mt-25 
                        ${expandedIndex === index ? "" : "line-clamp"}`}
                    >
                      {item.Description}
                    </p>

                    {item.Description.split(" ").length > 8 && (
                      <button
                        onClick={() => toggleDescription(index)}
                        className="text-blue-500 mt-2 button-font"
                        style={{
                          cursor: "pointer",
                          color: "#800080",
                          fontSize: "12px",
                        }}
                      >
                        {expandedIndex === index ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="col-xl-3 col-lg-4 col-md-12 relative z-2"
                  data-aos="fade-up"
                  data-aos-delay="500"
                >
                  {item.Image1 && (
                    <div className="masthead-image" style={{ marginTop: 10 }}>
                      <Image
                        width={200}
                        height={300}
                        data-move="20"
                        className="js-mouse-move brd-10"
                        src={item.Image1}
                        alt="image"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )} */}
        {!reviews && !reviews.length > 0 && (
          <div className="d-flex justify-content-center">
            <Lottie
              animationData={mailData}
              lottieRef={lottieRef}
              loop
              autoplay
            />
          </div>
        )}
      </div>
    </section>
  );
}
