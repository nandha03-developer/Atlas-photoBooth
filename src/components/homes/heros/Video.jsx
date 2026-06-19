import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import axios from "axios";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Strip3 from "../../../public/assets/img/strip/strip3_blue.svg";
import Strip4 from "../../../public/assets/img/strip/strip4_blue.svg";
import Image from "next/image";
import NoImage from "../../../public/assets/img/no-pictures.png";
import logo from "../../../public/assets/img/logo/logo72.svg";

export default function Video({ details, cols }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noVideos, setNoVideos] = useState(false);
  useEffect(() => {
    const fetchImages = async () => {
      const userName = typeof window!==undefined &&localStorage.getItem("userEmail");
      try {
        const endPoint = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.post(
          // "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql",
          endPoint,
          {
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
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key":  process.env.NEXT_PUBLIC_X_API_KEY,
            },
          }
        );

        if (response.data?.data?.listGalleries?.items) {
          const filteredItems = response.data.data.listGalleries.items.filter(
            (item) =>
              item.EmailId === userName &&
              item.EventDate === details.Event_Date &&
              item.Occassion === details.Occassion &&
              item.Video_url !== ""
          );

          // const videos = filteredItems.map((item) => item.Video_url);
          // setVideos(videos);
          const videos = filteredItems
            .map((item) => item.Video_url.split(","))
            .flat();
          setVideos(videos);
          if (videos.length > 0) {
            setNoVideos(false);
          } else {
            setNoVideos(true);
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [details.Event_Date, details.Occassion]);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "150px",
          marginTop: "100px",
        }}
      >
        {/* <CircularProgress /> */}
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box sx={{ width: "100%", marginBottom: "50px" }}>
      {/* <Button onClick={handleColChange}>
        {cols === 6 ? <Image src={Strip4} alt="strip4" /> : <Image src={Strip3} alt="strip3" />}
      </Button> */}
      <ImageList variant="masonry" cols={cols} gap={8}>
        {videos &&
          videos.length > 0 &&
          videos[0].Video_url !== "" &&
          videos.map((item, index) => (
            <ImageListItem
              key={item.id}
              sx={{
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                padding: 2,
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"; // Elevation effect on hover
                e.currentTarget.style.transform = "scale(1.02)"; // Slight scale effect
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"; // Reset shadow
                e.currentTarget.style.transform = "scale(1)"; // Reset scale
              }}
            >
              <video
                key={index}
                controls
                width="100%"
                src={item}
                alt={item.id}
                loading="lazy"
              />
            </ImageListItem>
          ))}
      </ImageList>
      {videos.length === 0 && (
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: 300,
            isEmpty: true,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack direction="column">
            <Image src={NoImage} alt="No images" height={100} width={100} />
            <Typography sx={{ fontStyle: "italic" }}>
              No videos found
            </Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
