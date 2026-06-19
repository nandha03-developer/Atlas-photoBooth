// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import ImageList from "@mui/material/ImageList";
// import ImageListItem from "@mui/material/ImageListItem";
// import axios from "axios";
// import {
//   Button,
//   CircularProgress,
//   IconButton,
//   Paper,
//   Stack,
//   Typography,
// } from "@mui/material";
// import Image from "next/image";
// import { Download, Fullscreen } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import NoImage from "../../../public/assets/img/no-pictures.png";
// import logo from "../../../public/assets/img/logo/logo72.svg";

// export default function Gallery({ details, cols }) {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingImages, setLoadingImages] = useState({}); // To track image loading
//   const [noImages, setNoImages] = useState(false);
//   const [error, setError] = useState(null);

//   // };
//   useEffect(() => {
//     fetchImages();
//   }, [details.Event_Date, details.Occassion]);
//   const fetchImages = async () => {
//     const userName = typeof window!==undefined &&localStorage.getItem("userEmail");
//     try {
//       const endPoint = process.env.NEXT_PUBLIC_API_URL;
//       const response = await axios.post(
//         // "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql",
//         endPoint,
//         {
//           query: `
//             query list {
// listGalleries {
//   Totalcount
//   items {
//     Image_url
//     Video_url
//     id
//     EmailId
//     Occassion
//     EventDate
//   }
// }
// }`,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
//           },
//         }
//       );

//       if (response.data?.data?.listGalleries?.items) {
//         const filteredItems = response.data.data.listGalleries.items.filter(
//           (item) =>
//             item.EmailId === userName &&
//             item.EventDate === details.Event_Date &&
//             item.Occassion === details.Occassion &&
//             item.Image_url !== ""
//         );

//         const images = filteredItems
//           .map((item) => item.Image_url.split(","))
//           .flat();
//         setImages(images);
//         if (images.length > 0) {
//           setNoImages(false);
//         } else {
//           setNoImages(true);
//         }
//       } else {
//         throw new Error("Invalid response structure");
//       }
//     } catch (error) {
//       console.error("Error fetching images:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", marginBottom: "150px", marginTop: "100px" }}>
//         <Image
//           src={logo}
//           alt="loading"
//           width={100}
//           height={100}
//           className="zoom-image"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }
//   const openFile = (fileUrl) => {
//     const newWindow = window.open(fileUrl, "_blank");
//     if (newWindow) newWindow.opener = null;
//   };
//   function downloadBase64File(contentType, base64Data, fileName) {
//     const linkSource = `data:${contentType};base64,${base64Data}`;
//     const downloadLink = document.createElement("a");
//     downloadLink.href = linkSource;
//     downloadLink.download = fileName;
//     downloadLink.click();
//   }

//   function downloadImage(item) {
//     setLoadingImages((prevState) => ({ ...prevState, [item]: true }));
//     const parts = item.split("/");
//     const fileName = parts[parts.length - 1];
//     const apiUrl = `https://khs1ly30oh.execute-api.us-east-1.amazonaws.com/default/Download_S3_Image?subfolder=IMAGES&object_name=${fileName}`;

//     // const apiUrl = `https://4e3zbbrcri.execute-api.us-east-2.amazonaws.com/default/Download_S3_Image?subfolder=IMAGES&object_name=${fileName}`;
//     fetch(apiUrl)
//       .then((response) => response.text())
//       .then((text) => {
//         const contentType = "image/png";
//         downloadBase64File(contentType, text, fileName);
//         setLoadingImages((prevState) => ({ ...prevState, [item]: false }));
//       })
//       .catch((error) => console.error("Error downloading the image:", error));
//   }
//   const DemoPaper = styled(Paper)(({ theme }) => ({
//     width: 120,
//     height: 120,
//     padding: theme.spacing(2),
//     ...theme.typography.body2,
//     textAlign: "center",
//   }));
//   return (
//     <Box sx={{ width: "100%", marginBottom: "50px" }}>
//       <ImageList variant="masonry" cols={cols} gap={8}>
//         {images.length > 0 &&
//           images.map((item, index) => (
//             <ImageListItem
//               key={index}
//               sx={{
//                 boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
//                 padding: 2,
//                 position: "relative",
//                 "&:hover .icon-buttons": {
//                   visibility: "visible",
//                 },
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"; // Elevation effect on hover
//                 e.currentTarget.style.transform = "scale(1.02)"; // Slight scale effect
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Reset shadow
//                 e.currentTarget.style.transform = "scale(1)"; // Reset scale
//               }}
//             >
//               {/* Show CircularProgress if the image is loading */}
//               {loadingImages[item] && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                     zIndex: 10,
//                   }}
//                 >
//                   <CircularProgress size={24} />
//                 </Box>
//               )}
//               <img
//                 src={item}
//                 alt={`Gallery Image ${index + 1}`}
//                 style={{ opacity: loadingImages[item] ? 0.5 : 1,height:"auto", width: "auto" }}
//               />
//               {/* <img key={index} src={item} alt={`Gallery Image ${index + 1}`} /> */}
//               <Box
//                 className="icon-buttons"
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: "10px",
//                   visibility: "hidden",
//                 }}
//               >
//                 <IconButton
//                   variant="contained"
//                   onClick={() => downloadImage(item)}
//                 >
//                   <Download style={{ color: "#000", fontSize: "15px" }} />
//                 </IconButton>
//                 <IconButton variant="contained" onClick={() => openFile(item)}>
//                   <Fullscreen style={{ color: "#000", fontSize: "15px" }} />
//                 </IconButton>
//               </Box>
//             </ImageListItem>
//           ))}
//       </ImageList>
//       {images.length === 0 && (
//         <Paper
//           elevation={2}
//           sx={{
//             width: "100%",
//             height: 300,
//             isEmpty: true,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Stack direction="column">
//             <Image src={NoImage} alt="No images" height={100} width={100} />
//             <Typography sx={{ fontStyle: "italic" }}>
//               No Images found
//             </Typography>
//           </Stack>
//         </Paper>
//       )}
//     </Box>
//   );
// }
import React, { useState, useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import axios from "axios";
import { CircularProgress, IconButton, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Download, Fullscreen } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import NoImage from "../../../public/assets/img/no-pictures.png";
import logo from "../../../public/assets/img/logo/logo72.svg";

export default function Gallery({ details, cols }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // For scrolling load
  const [hasMore, setHasMore] = useState(true); // Track if more images are available
  const [error, setError] = useState(null);
  const [loadingImages, setLoadingImages] = useState({}); // To track image loading
  const pageSize = 10; // Number of images to load per page
  const observer = useRef();

  useEffect(() => {
    fetchImages(1); // Initial load
  }, [details.Event_Date, details.Occassion]);

  const fetchImages = async (page) => {
    const userName = typeof window !== "undefined" && localStorage.getItem("userEmail");
    setLoading(page === 1); // Show main loader on initial load only
    setLoadingMore(page > 1); // Show small loader for subsequent loads
    try {
      const endPoint = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(endPoint, {
        query: `
          query list {
            listGalleries {
              Totalcount
              items {
                Image_url
                Video_url
                id
                EmailId
                Occassion
                EventDate
              }
            }
          }`,
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        },
      });

      if (response.data?.data?.listGalleries?.items) {
        const filteredItems = response.data.data.listGalleries.items.filter(
          (item) =>
            item.EmailId === userName &&
            item.EventDate === details.Event_Date &&
            item.Occassion === details.Occassion &&
            item.Image_url !== ""
        );

        const newImages = filteredItems
          .map((item) => item.Image_url.split(","))
          .flat();

        const paginatedImages = newImages.slice((page - 1) * pageSize, page * pageSize);
        setImages((prev) => (page === 1 ? paginatedImages : [...prev, ...paginatedImages]));

        if (paginatedImages.length < pageSize) {
          setHasMore(false); // No more images to load
        }
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const lastImageRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchImages(Math.ceil(images.length / pageSize) + 1); // Load next page
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, images]
  );
    const openFile = (fileUrl) => {
    const newWindow = window.open(fileUrl, "_blank");
    if (newWindow) newWindow.opener = null;
  };
  function downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  function downloadImage(item) {
    setLoadingImages((prevState) => ({ ...prevState, [item]: true }));
    const parts = item.split("/");
    const fileName = parts[parts.length - 1];
    const apiUrl = `https://khs1ly30oh.execute-api.us-east-1.amazonaws.com/default/Download_S3_Image?subfolder=IMAGES&object_name=${fileName}`;

    // const apiUrl = `https://4e3zbbrcri.execute-api.us-east-2.amazonaws.com/default/Download_S3_Image?subfolder=IMAGES&object_name=${fileName}`;
    fetch(apiUrl)
      .then((response) => response.text())
      .then((text) => {
        const contentType = "image/png";
        downloadBase64File(contentType, text, fileName);
        setLoadingImages((prevState) => ({ ...prevState, [item]: false }));
      })
      .catch((error) => console.error("Error downloading the image:", error));
  }
  const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 120,
    height: 120,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "center",
  }));
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "100px 0" }}>
        <Image src={logo} alt="loading" width={100} height={100} className="zoom-image" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ width: "100%", marginBottom: "50px" }}>
      <ImageList variant="masonry" cols={cols} gap={8}>
        {images.map((item, index) => (
          <>
          <ImageListItem
            key={index}
            sx={{
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
              padding: 2,
              position: "relative",
              "&:hover .icon-buttons": { visibility: "visible" },
            }}
            ref={index === images.length - 1 ? lastImageRef : null} // Attach observer to last image
          >
            {/* <img src={item} alt={`Gallery Image ${index + 1}`} style={{ width: "100%", height: "auto" }} /> */}
            <img
                src={item}
                alt={`Gallery Image ${index + 1}`}
                style={{ opacity: loadingImages[item] ? 0.5 : 1,height:"auto", width: "auto" }}
              />
               <Box
                className="icon-buttons"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                  visibility: "hidden",
                }}
              >
                <IconButton
                  variant="contained"
                  onClick={() => downloadImage(item)}
                >
                  <Download style={{ color: "#000", fontSize: "15px" }} />
                </IconButton>
                <IconButton variant="contained" onClick={() => openFile(item)}>
                  <Fullscreen style={{ color: "#000", fontSize: "15px" }} />
                </IconButton>
              </Box>
          </ImageListItem>
          </>
        ))}
      </ImageList>
      {loadingMore && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {images.length === 0 && !loading && (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack direction="column">
            <Image src={NoImage} alt="No images" height={100} width={100} />
            <Typography sx={{ fontStyle: "italic" }}>No Images Found</Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
