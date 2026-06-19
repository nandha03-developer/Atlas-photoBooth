"use client";
import {
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
  Stack,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog,
  Grid,
  Rating,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";
import logo from "../../../public/assets/img/logo/logo72.svg";
import Lottie from "lottie-react";
import { LottieRefCurrentProps } from "lottie-react";
// import mailData from "../../Animation-1733293733376_OrderDetail.json";
import orderAnimation from "../../../Animation-1733293733376_OrderDetail.json";
import { common } from "@mui/material/colors";

export default function FindCourse() {
  const lottieRef = (useRef < LottieRefCurrentProps) | (null > null);

  const [orderDetail, setOrderDetail] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [customerDetails, setCustomerDetails] = useState({});
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [value, setValue] = React.useState(0);
  const router = useRouter();
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteConfirmation = (id) => {
    setOpen(true);
    setDeleteId(id);
  };
  const handleDelete = () => {
    const query = `mutation delete {
  deleteReviews(input: {id: ${deleteId}}) {
    id
    AddOns
    Address
    CityName
    CountryName
    CustomerId
    CustomerName
    Description
    DoorNo
    Ocassion
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
    Email
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
        toast.success("Review deleted successfully");
        fetchData();
        handleClose();
        setDeleteId(null);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };
  const fetchData = () => {
    setLoading(true);
    const query = `
      query list {
        listOrderDetails {
          items {
            Bil_Amount
            Email
            Event_Date
            FirstName
            LastName
            Occassion
            Ordered_Date
            PhoneNo
            Pricing
            Rental_Duration
            id
            Address
            Cityname
            CountryName
            DoorNo
            Package_Name
            PostalCode
            State
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
        const userDetails = res.data?.data?.listOrderDetails?.items || [];
        const userDatas =
          typeof window !== "undefined" && localStorage.getItem("userEmail");

        if (userDatas) {
          const getUserDataByEmail = (email) => {
            return userDetails.filter((item) => item.Email === email);
          };
          const userData = getUserDataByEmail(userDatas);

          if (userData.length > 0) {
            const date = new Date();
            const formattedDate = `${
              date.getMonth() + 1
            }.${date.getDate()}.${date.getFullYear()}`;
            const updatedOrderDetails = userData.map((item) => ({
              ...item,
              // Ordered_Date: formattedDate,
            }));

            setOrderDetail(updatedOrderDetails);
          } else {
            console.log("User not found");
            setOrderDetail([]); // Clear order details
            setMessage("No order details yet"); // Set the no data message
          }
        } else {
          console.log("No user data in localStorage");
          setOrderDetail([]); // Clear order details
          setMessage("No order details yet"); // Set the no data message
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false); // Stop loading on error
        setMessage("Failed to fetch data. Please try again."); // Set error message
      });
  };

  useEffect(() => {
    fetchData();
    const savedSubmittedReviews =
      JSON.parse(
        typeof window !== undefined && localStorage.getItem("submittedReviews")
      ) || [];
  }, []);

  const handleReview = (item) => {
    setSelectedOrderId(item.id);
    setCustomerDetails(item);

    if (item.id) {
      getReviewDetails(item.id);
    }
  };
  const handleCancel = () => {
    setSelectedOrderId(null);
  };

  const handleDrop = async (acceptedFiles, type) => {
    const uploadFiles = acceptedFiles.map(async (file) => {
      const formData = new FormData();
      if (type === "image") {
        formData.append("files", file);
        formData.append("subfolder", "photobooth");
      } else {
        formData.append("file", file);
        formData.append("subfolder", "photobooth/video");
      }

      const apiUrl =
        type === "image"
          ? "https://g7p7gx7okzuqmrbcoohenvca5q0ommgm.lambda-url.ap-south-1.on.aws/upload"
          : "https://g7p7gx7okzuqmrbcoohenvca5q0ommgm.lambda-url.ap-south-1.on.aws/upload-video";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
          redirect: "follow",
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to upload file. Server responded with status: ${response.status} - ${errorText}`
          );
        }
        const result = await response.json();
        if (type === "video") {
          setUploadedVideoUrl(result.videoUrl);
        } else {
          return result.imageUrl || URL.createObjectURL(file);
        }
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(uploadFiles);
      if (type === "image") {
        setUploadedImages((prev) => [...prev, ...results]);
      } else {
        setUploadedVideos((prev) => [...prev, ...results]);
      }
      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`
      );
    } catch (error) {
      toast.error("An unexpected error occurred: " + error.message);
    }
  };

  const getReviewDetails = async (orderId) => {
    const mutation = `
query filter {
  listReviews(filter: {OrderId: {eq: ${orderId}}}) {
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
      Ocassion
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
    }
  }
}
`;
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };

    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await axios.post(endPoint, { query: mutation }, { headers });

      if (res.data.errors) {
        const errorMessage = res.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        const reviewData = res.data.data.listReviews.items;

        setReviewText(reviewData[0]?.Description || "");
        const updatedImages = [
          reviewData[0]?.Image1,
          reviewData[1]?.Image2,
          reviewData[2]?.Image3,
          reviewData[3]?.Image4,
          reviewData[4]?.Image5,
        ].filter(Boolean);
        const updatedVideos = [reviewData[0]?.Video].filter(Boolean);
        setSubmittedReviews(reviewData);
        setUploadedImages(updatedImages);
        setUploadedVideos(updatedVideos);
        setUploadedVideoUrl(reviewData[0]?.Video);
      }
    } catch (err) {
      toast.error("Error fetching review details.");
    }
  };
  const currentDate = new Date();
  const days = String(currentDate.getDate()).padStart(2, "0");
  const months = String(currentDate.getMonth() + 1).padStart(2, "0");
  const years = currentDate.getFullYear();
  let hours = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  const time = `${formattedHours}:${minutes} ${period}`;
  const today = `${months}-${days}-${years}${" "}${time}`;
  const handleReviewSubmit = async () => {
    const mutation =
      submittedReviews?.length !== 0
        ? `
          mutation update {
            updateReviews(input: {
              AddOns: "", 
              Email: "${customerDetails.Email}", 
              Address: "${customerDetails.Address}", 
              CityName: "${customerDetails.Cityname}", 
              CountryName: "${customerDetails.CountryName}", 
              CustomerId: 10, 
              CustomerName: "${customerDetails.FirstName} ${
            customerDetails.LastName
          }",  
              Description: "${reviewText}", 
              Ocassion: "", 
              DoorNo: "", 
              Image1: "${uploadedImages[0] || ""}", 
              Image2: "${uploadedImages[1] || ""}", 
              Image3: "${uploadedImages[2] || ""}", 
              Image4: "${uploadedImages[3] || ""}", 
              Image5: "${uploadedImages[4] || ""}", 
              OrderId: ${customerDetails?.id}, 
              PackageName: "${
                customerDetails.PackageName
                  ? `"${customerDetails.PackageName}"`
                  : ""
              }", 
              PostalCode: "", 
              ProductId: 10, 
              RatingValue: ${value}, 
              ReviewDate: "${today}", 
              StateName: "", 
              SupplierId: 10, 
              Video: "${uploadedVideoUrl || ""}", 
              id: ${submittedReviews[0]?.id}
            }) {
              id
            }
          }`
        : `
          mutation create {
            createReviews(input: {
              AddOns: "",
              Email: "${customerDetails.Email}",
              Address: "${customerDetails.Address}",
              CityName: "${customerDetails.Cityname}",
              CountryName: "${customerDetails.CountryName}",
              CustomerId: 10,
              CustomerName: "${customerDetails.FirstName} ${
            customerDetails.LastName
          }",
              Description: "${reviewText}",
              DoorNo: "${customerDetails.DoorNo}",
              Ocassion: "${customerDetails.Occassion}",
              Image1: "${uploadedImages[0] || ""}",
              Image2: "${uploadedImages[1] || ""}",
              Image3: "${uploadedImages[2] || ""}",
              Image4: "${uploadedImages[3] || ""}",
              Image5: "${uploadedImages[4] || ""}",
              OrderId: ${customerDetails?.id},
              PackageName: "${customerDetails.PackageName}",
              PostalCode: "${customerDetails.PostalCode}",
              ProductId: 10,
              RatingValue: ${value},
              ReviewDate: "${today}",
              StateName: "${customerDetails.State}",
              SupplierId: 10,
              Video: "${uploadedVideoUrl || ""}" 
            }) {
              id
            }
          }`;

    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };

    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await axios.post(endPoint, { query: mutation }, { headers });
      if (res.data.errors) {
        const errorMessage = res.data.errors[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Review submitted successfully!");
        setReviewText("");
        setSelectedOrderId(null);
        setImageFiles([]);
        setVideoFiles([]);
        setUploadedImages([]);
        setUploadedVideos([]);
        setUploadedVideoUrl(null);
        fetchData();
      }
    } catch (err) {
      toast.error("Error submitting review.");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles, type) => {
      if (
        acceptedFiles.length +
          (type === "image" ? uploadedImages.length : uploadedVideos.length) >
        5
      ) {
        toast.error("You can upload a maximum of 5 files.");
      } else {
        handleDrop(acceptedFiles, type);
      }
    },
    [uploadedImages, uploadedVideos]
  );

  const handleRemoveFile = (file, type) => {
    if (type === "image") {
      setUploadedImages(uploadedImages.filter((f) => f !== file));
    } else {
      setUploadedVideos(uploadedVideos.filter((f) => f !== file));
    }
  };
  const handleClick1 = () => {
    router.push("/booknow");
  };
  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({ onDrop: (acceptedFiles) => onDrop(acceptedFiles, "image") });
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({ onDrop: (acceptedFiles) => onDrop(acceptedFiles, "video") });

  function formatDate(dateString) {
    // Split the date string into an array [YYYY, MM, DD]
    const [year, month, day] = dateString.split("-");

    // Return the formatted string as MM-DD-YYYY
    return `${month}-${day}-${year}`;
  }
  const handleReviewChange = (e) => {
    const text = e.target.value;
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount <= 150) {
      setReviewText(text);
    }
  };

  const formatDates = (dateString) => {
    const [day, year, month] = dateString.split("-"); // Correctly split the input
    return `${month}-${day}-${year}`; // Reformat to "MM-DD-YYYY"
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Image
          src={logo}
          alt="loading"
          width={100}
          height={100}
          className="zoom-image"
        />
      </div>
    );
  }

  const commonStyles = {
    "& .MuiInputLabel-root": {
      color: "purple", // Set the label color to purple
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "purple", // Ensure the label stays purple when focused
    },
    "& .MuiOutlinedInput-root": {
      // borderRadius: "8px", // Adjust the border radius
      "&.Mui-focused fieldset": {
        borderColor: "purple", // Change the border color to purple when focused
      },
    },
    
  };

  return (
    <section className="order-section" style={{ paddingTop: "40px",width:"90%",marginTop:"150px",marginBottom:"30px" }}>
      <div className="container">
        {/* <ToastContainer /> */}
        <h2 className="section-title">Your Orders</h2>
        {orderDetail.length === 0 ? (
          <div style={{ width: "100%", justifyContent:"space-between", display:"flex", margin:"auto",alignItems:"center",flexDirection:"column",justifyContent:"space-evenly"}  }>
            <div style={{display:"flex", flexWrap:"wrap", gap:"10px", marginTop:"10px",justifyContent:"space-between"}}>
              <div style={{width:"60%"}}>
              <Lottie
                animationData={orderAnimation}
                lottieRef={lottieRef}
                loop
                autoplay
              />
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",marginTop:"60px"}}>
                <h3
                  style={{
                    color: "purple",
                    fontSize: "24px",
                    // marginTop: "20px",
                  }}
                >
                  No orders yet{" "}
                </h3>
                <div style={{marginTop:"20px"}}>
                <Button
                  className="button-font"
                  variant="contained"
                  color="primary"
                  onClick={handleClick1}
                  sx={{
                    backgroundColor: "purple",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "#140342",
                      border: "1px solid purple",
               },
                  }}
                >
                  Book Now
                </Button>
                </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orderDetail.map((item, index) => (
              <div key={index} className="order-card">
                <div className="order-header">
                  <span className="order-id">Order #{item.id}</span>
                  <span className="order-date">
                    Order Placed: {item.Ordered_Date}
                  </span>
                </div>
                <div className="order-content">
                  <div className="order-info">
                    <p>
                      <strong>First Name:</strong> {item.FirstName}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {item.LastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {item.Email}
                    </p>
                    <p>
                      <strong>Occasion:</strong> {item.Occassion}
                    </p>
                    <p>
                      <strong>Package Name:</strong> {item.Package_Name}
                    </p>
                    {/* <p>
                      <strong>Event Date:</strong> {formatDate(item.Event_Date)}
                    </p>
                    <p>
                      <strong>Phone No:</strong> {item.PhoneNo}
                    </p> */}
                  </div>
                  <div className="order-details">
                    <p>
                      <strong>Event Date:</strong>{" "}
                      {formatDates(item.Event_Date)}
                    </p>
                    <p>
                      <strong>Phone No:</strong> {item.PhoneNo}
                    </p>
                    <p>
                      <strong>Pricing:</strong> ${item.Pricing}
                    </p>
                    <p>
                      <strong>Rental Duration:</strong> {item.Rental_Duration}
                      Hours
                    </p>

                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReview(item)}
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        fontSize: "12px",
                        padding: "5px 10px",
                        marginBottom: "20px",
                      }}
                    >
                      {submittedReviews.some((review) => review.OrderId === item.id)
                        ? "Update Review"
                        : "Write a Review"}
                    </Button> */}
                    {/* {new Date(item.Event_Date) < new Date() ? (<Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReview(item)}
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        fontSize: "12px",
                        padding: "5px 10px",
                        marginBottom: "20px",
                      }}
                    >
                      Write Review

                    </Button>) : (<></>)} */}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReview(item)}
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        fontSize: "12px",
                        padding: "5px 10px",
                        marginBottom: "20px",
                      }}
                    >
                      Write Review
                    </Button>
                    {/* {selectedOrderId == item.id && (
                      <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <TextField
                          label="Write your review"
                          multiline
                          rows={4}
                          variant="outlined"
                          value={reviewText}
                          // onChange={(e) => setReviewText(e.target.value)}
                          onChange={handleReviewChange}
                          fullWidth
                        />
                         <div
                          {...getImageRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getImageInputProps()} />
                          <p>
                            Drag, drop, or click images (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedImages.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <img
                                src={file}
                                alt={`Uploaded image ${i + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => handleRemoveFile(file, "image")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        </Grid>
                        <Grid item xs={6}>
                        <div
                          {...getVideoRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getVideoInputProps()} />
                          <p>
                            Drag, drop, or click video (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedVideos.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              >
                                <source src={file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <IconButton
                                onClick={() => handleRemoveFile(file, "video")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        </Grid>
                      </Grid>
                      <div className="review-section">
                        <TextField
                          label="Write your review"
                          multiline
                          rows={4}
                          variant="outlined"
                          value={reviewText}
                          // onChange={(e) => setReviewText(e.target.value)}
                          onChange={handleReviewChange}
                          fullWidth
                        />
                        <div
                          {...getImageRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getImageInputProps()} />
                          <p>
                            Drag, drop, or click images (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedImages.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <img
                                src={file}
                                alt={`Uploaded image ${i + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => handleRemoveFile(file, "image")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <div
                          {...getVideoRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getVideoInputProps()} />
                          <p>
                            Drag, drop, or click video (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedVideos.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              >
                                <source src={file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <IconButton
                                onClick={() => handleRemoveFile(file, "video")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewSubmit}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "purple",
                              color: "white",
                            }}
                          >
                            Submit Review
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCancel}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "grey",
                              color: "white",
                            }}
                          >
                            Cancel
                          </Button>
                          {submittedReviews.some((review) => review.OrderId === item.id)
                            && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDeleteConfirmation(submittedReviews.find(review => review.OrderId === item.id)?.id)}
                                style={{
                                  marginTop: "10px",
                                  backgroundColor: "#F95454",
                                  color: "white",
                                }}
                              >
                                Delete
                              </Button>
                            )}
                        </Stack>
                      </div>
                      </>
                    )} */}
                  </div>
                </div>
                {selectedOrderId == item.id && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sx={{ mt: 1 }}>
                        <TextField
  label="Write your review"
  multiline
  rows={2}  // Reduced the number of rows to make the text area smaller
  variant="outlined"
  value={reviewText}
  onChange={handleReviewChange}
  fullWidth
  InputProps={{
    style: { minHeight: '60px' }, // Reduced the min height to make it smaller
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      paddingTop: '4px',  // Reduced the top padding
      paddingBottom: '4px',  // Reduced the bottom padding
    },
    ...commonStyles,
  }}
/>

                      

                        <Box sx={{ mt: 1 }}>
                          <Typography
                            component="legend"
                            sx={{ fontWeight: 550, }
                          }
                          >
                            Give the Rating for that order
                          </Typography>
                          <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <div
                          {...getImageRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getImageInputProps()} />
                          <p>Drag, drop, or click images (5).</p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedImages.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <img
                                src={file}
                                alt={`Uploaded image ${i + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => handleRemoveFile(file, "image")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <div
                          {...getVideoRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getVideoInputProps()} />
                          <p>Drag, drop, or click video (5).</p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedVideos.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              >
                                <source src={file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <IconButton
                                onClick={() => handleRemoveFile(file, "video")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewSubmit}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "purple",
                              color: "white",
                            }}
                          >
                            Submit Review
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCancel}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "grey",
                              color: "white",
                            }}
                          >
                            Cancel
                          </Button>
                          {submittedReviews.some(
                            (review) => review.OrderId === item.id
                          ) && (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleDeleteConfirmation(
                                  submittedReviews.find(
                                    (review) => review.OrderId === item.id
                                  )?.id
                                )
                              }
                              style={{
                                marginTop: "10px",
                                backgroundColor: "#F95454",
                                color: "white",
                              }}
                            >
                              Delete
                            </Button>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                    {/* <div className="review-section">
                        <TextField
                          label="Write your review"
                          multiline
                          rows={4}
                          variant="outlined"
                          value={reviewText}
                          // onChange={(e) => setReviewText(e.target.value)}
                          onChange={handleReviewChange}
                          fullWidth
                        />
                        <div
                          {...getImageRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getImageInputProps()} />
                          <p>
                            Drag, drop, or click images (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedImages.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <img
                                src={file}
                                alt={`Uploaded image ${i + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => handleRemoveFile(file, "image")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <div
                          {...getVideoRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "10px",
                            marginTop: "10px",
                          }}
                        >
                          <input {...getVideoInputProps()} />
                          <p>
                            Drag, drop, or click video (5).
                          </p>
                        </div>
                        <div
                          className="file-preview"
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {uploadedVideos.map((file, i) => (
                            <div
                              key={i}
                              className="file-item"
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              <video
                                controls
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              >
                                <source src={file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <IconButton
                                onClick={() => handleRemoveFile(file, "video")}
                                size="small"
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          ))}
                        </div>
                        <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleReviewSubmit}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "purple",
                              color: "white",
                            }}
                          >
                            Submit Review
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCancel}
                            style={{
                              marginTop: "10px",
                              backgroundColor: "grey",
                              color: "white",
                            }}
                          >
                            Cancel
                          </Button>
                          {submittedReviews.some((review) => review.OrderId === item.id)
                            && (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleDeleteConfirmation(submittedReviews.find(review => review.OrderId === item.id)?.id)}
                                style={{
                                  marginTop: "10px",
                                  backgroundColor: "#F95454",
                                  color: "white",
                                }}
                              >
                                Delete
                              </Button>
                            )}
                        </Stack>
                      </div> */}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: "30vw",
            maxHeight: "90vh",
            paddingX: 3,
            backgroundColor: "#ebe8fc",
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DialogTitle style={{ color: "purple", textAlign: "center" }}>
            Delete Review
          </DialogTitle>
          {/* <DialogActions>
            <IconButton
              style={{ color: "purple" }}
              onClick={() => {
                handleClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogActions> */}
        </Stack>
        <DialogContent sx={{ backgroundColor: "primary" }}>
          Do you want to delete the review?
        </DialogContent>
        <DialogActions sx={{ mr: 2 }}>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: "#800080",
              "&:hover": {
                backgroundColor: "#5441ad",
              },
            }}
            variant="contained"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpen(false)}
            sx={{ backgroundColor: "grey" }}
            variant="contained"
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
