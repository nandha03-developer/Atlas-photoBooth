"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Button, Rating } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import logo from "../../../public/assets/img/logo/logo72.svg"

import "swiper/swiper-bundle.css";
import "@mui/icons-material";
import Image from "next/image";

const API_ENDPOINT =
  "https://rpmzp5d4vrdlflr662d6ft7vta.appsync-api.us-east-1.amazonaws.com/graphql";
const API_KEY =  process.env.NEXT_PUBLIC_X_API_KEY;

export default function TestimonialsFour() {
  const [showSlider, setShowSlider] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  const fetchData = () => {
    const query = `
      query list {
        listCustomers {
          Totalcount
          items {
            CognitoId
            DOB
            Email
            FirstName
            Id
            LastName
            ProfileImg
            Role
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
        const customerData = res.data?.data?.listCustomers?.items || [];
        setCustomers(customerData);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.setAttribute("data-use-service-core", "");
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  const fetchReviews = async () => {
    try {
      const response = await axios.post(
        API_ENDPOINT,
        {
          query: `
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
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );

      if (response.data?.data?.listReviews?.items) {
        setReviews(response.data.data.listReviews.items);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getCustomerProfileImg = (email) => {
    const customer = customers.find((cust) => cust.Email === email);
    return customer ? customer.ProfileImg : null;
  };
  useEffect(() => {
    setShowSlider(true);
    fetchReviews();
    fetchData();
  }, []);

  // if (loading) {
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <Image src={logo} alt="loading" width={100} height={100} className="zoom-image" />
  //     </div>
  //   );
  // }

  if (error) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    <Image src={logo} alt="loading" width={100} height={100} className="zoom-image" />
  </div>;
  }

  return (
    <>
    {showSlider && reviews && reviews.length > 0 && (
     
    <section
      className="layout-pt-md layout-pb-lg bg-dark-5"
      style={{ backgroundColor: "#4B0082" }}
    >
      <div className="container">

        <div className="text-center my-2">
          <h2 style={{ color: "#ffffff",fontStyle: "italic", fontSize: "28px" }}>What our customers say</h2>
        </div>
     
          <div className="pt-60 lg:pt-50 js-section-slider">
            
            <Swiper
              className="overflow-visible"
              modules={[Navigation, Pagination]}
              pagination={{
                el: ".pagination-testimonial",
                clickable: true,
              }}
              navigation={{
                nextEl: ".icon-arrow-right-testimonial",
                prevEl: ".icon-arrow-left-testimonial",
              }}
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
                  slidesPerView: 2,
                },
              }}
            >
              {reviews&&reviews.map((review, index) => (
                <SwiperSlide key={review.id} className="swiper-slide">
                  <Card
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      margin: "10px",
                      borderRadius: "10px",
                      padding: "20px",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="10px"
                      >
                        <Avatar
                          alt={review.CustomerName}
                          src={getCustomerProfileImg(review.Email)}
                          style={{ width: 65, height: 65, marginRight: 8 }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="h6"
                              component="div"
                              style={{ fontSize: "16px", fontWeight: "bold" }}
                            >
                              {review?.CustomerName}
                            </Typography>
                            <CheckCircleIcon
                              style={{ color: "#9370DB", marginLeft: "4px" }}
                            />
                          </Box>
                          <Typography
                            sx={{ mb: 0.5 }}
                            color="text.secondary"
                            style={{ fontWeight: 550, color: "grey", fontSize: "12px" }}
                          >
                            {/* {new Date(review.ReviewDate).toLocaleDateString()} */}
                            {review.ReviewDate}
                          </Typography>
                          <Rating
                            name="simple-controlled"
                            sx={{fontSize: "14px"}}
                            value={review.RatingValue}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        className={`masthead__text text-10 text-dark-1 mt-25 ${expandedIndex === index ? "" : "line-clamp-slider"
                          }`}
                        sx={{ mt: 1 }}
                        style={{
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                      >
                        {review.Description}
                      </Typography>

                      <Button onClick={() => handleToggle(index)} size="small" className="button-font" style={{ fontSize: "10px" }}>
                        {expandedIndex === index ? "Show Less" : "Show More"}
                      </Button>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          color: "grey",
                        }}
                      >
                        Address: {review.Address}, {review.CityName},{" "}
                        {review.StateName}, {review.CountryName},{" "}
                        {review.PostalCode}
                      </Typography>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="d-flex justify-center x-gap-15 items-center pt-60 lg:pt-40">
              <div className="col-auto">
                <button className="d-flex items-center text-24 arrow-left-hover js-prev icon-arrow-left-testimonial">
                  <i className="icon text-white icon-arrow-left"></i>
                </button>
              </div>
              <div className="col-auto">
                <div className="pagination -arrows js-pagination pagination-testimonial"></div>
              </div>
              <div className="col-auto">
                <button className="d-flex items-center text-24 arrow-right-hover js-next icon-arrow-right-testimonial">
                  <i className="icon text-white icon-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        
      </div>
    </section>
    
  )}
  </>
  );
}
