"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { gallery } from "../../../data/gallery";
import { useRouter } from "next/navigation";

const PricingSection = () => {
  const router = useRouter();

  const PlanCard = ({ title, price, features }) => (
    <Grid item xs={12} sm={6} md={3} sx={{ width: "80%" }}>
      <Card variant="outlined" sx={{ borderRadius: "20px", height: "750px" }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4" sx={{ color: "purple" }}>
            {price}{" "}
            <Typography
              variant="body1"
              component="span"
              sx={{ color: "black" }}
            >
              {" "}
              Starting From
            </Typography>
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "white",
              color: "purple",
              border: "1.5px solid purple",
            }}
          >
            Get started
          </Button>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 2,
              marginBottom: "5px",
              color: "purple",
              fontWeight: "bold",
            }}
          >
            FEATURES
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "17px", lineHeight: "30px" }}
          >
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <CheckIcon fontSize="small" sx={{ color: "purple" }} />{" "}
                {feature}
                <br />
              </React.Fragment>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const featuresData = [
    {
      feature: "A minimum of 3 hours",
      plans: [true, false, false],
    },
    {
      feature: "A minimum of 4-hour",
      plans: [false, true, false],
    },
    {
      feature: "A Minimum of 5 hours",
      plans: [false, false, true],
    },
    {
      feature: "Drop-off with setup and breakdown",
      plans: [true, false, false],
    },
    {
      feature: "$125/hour & $100 for each additional hour",
      plans: [true, false, false],
    },
    {
      feature: "Additional hours at $100 each",
      plans: [false, true, false],
    },
    {
      feature: "With additional hours at $100 each",
      plans: [false, false, true],
    },
    {
      feature: "A choice of basic backdrops (white or black)",
      plans: [true, false, false],
    },
    {
      feature: "Backdrops (white, black, gold, silver)",
      plans: [false, true, false],
    },
    {
      feature: "Backdrop choices (white, black, gold, silver)",
      plans: [false, false, true],
    },
    {
      feature: "A simple overlay",
      plans: [true, false, false],
    },
    {
      feature: "Customized overlays",
      plans: [false, true, false],
    },
    {
      feature: "Customized overlays",
      plans: [false, false, true],
    },
    {
      feature: "One mode selection",
      plans: [true, false, false],
    },
    {
      feature: "Up to 2 modes (photo, boomerang, GIF, video)",
      plans: [false, true, false],
    },
    {
      feature: "4 modes (photo, boomerang, GIF, video)",
      plans: [false, false, true],
    },
    {
      feature: "Photo or boomerang or GIF",
      plans: [true, false, false],
    },

    {
      feature:
        "Filter choice of 1-2 modes customizable lighting & custom live gallery,basic props",
      plans: [false, false, true],
    },
    {
      feature: "All 6 filters, customizable lighting & custom live gallery",
      plans: [false, false, true],
    },
    {
      feature: "Email sharing only and a live gallery",
      plans: [true, false, false],
    },
    {
      feature:
        "Email or mobile sharing, and attendance to assist with the station",
      plans: [false, true, false],
    },
    {
      feature: "Email or Mobile sharing, access to analytics, survey mode",
      plans: [false, false, true],
    },
    {
      feature: "Personalized backdrops start at $150",
      plans: [false, true, false],
    },
    {
      feature: "Personalized backdrops start at $150",
      plans: [false, false, true],
    },
    {
      feature: "Attendance to assist with the station",
      plans: [false, false, true],
    },
  ];

  const pricingData = [
    {
      title: "Tourist (Drop Off Option)",
      price: "$375",
      features: [
        "drop-off with setup and breakdown",
        "a minimum of 3 hours",
        "$125/hour & $100 for each additional hour",
        "a choice of basic backdrops (white or black)",
        "a simple overlay",
        "one mode selection",
        "photo or boomerang or GIF",
        "email sharing only and a live gallery",
      ],
    },
    {
      title: "Atlantis",
      price: "$600",
      features: [
        "minimum of 4-hour",
        "additional hours at $100 each",
        "backdrops (white, black, gold, silver)",
        "customized overlays",
        "up to 2 modes (photo, boomerang, GIF, video)",
        "customizable lighting, custom live gallery, basic props",
        "email or mobile sharing, and attendance to assist with the station",
        "Personalized backdrops start at $150",
      ],
    },
    {
      title: "Celestial",
      price: "$800",
      features: [
        "Minimum of 5 hours",
        "With additional hours at $100 each",
        "Backdrop choices (white, black, gold, silver)",
        "customized overlays",
        "4 modes (photo, boomerang, GIF, video)",
        "All 6 filters, customizable lighting & custom live gallery",
        "Email or Mobile sharing, access to analytics, survey mode",
        "Attendance to assist with the station",
        "Personalized backdrops start at $150",
      ],
    },
  ];

  const handleButtonClick = () => {
    router.push("/photo-booth#StepForm");
  };
  const [billing, setBilling] = useState("monthly");

  const handleBillingChange = (event, newBilling) => {
    if (newBilling !== null) {
      setBilling(newBilling);
    }
  };

  return (
    <>
      <Box sx={{ padding: "50px 20px" }}>
        <div className="row y-gap-20 justify-center text-center mt-50">
          <div className="col-auto">
            <div className="sectionTitle ">
              <h2 className="sectionTitle__title text-60 pt-50">
                Photo Booths
              </h2>

              <p className="sectionTitle__text text-30 pt-20">
                Create lasting memories with our exceptional photo booth
                packagessss
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {gallery.map((item) => (
                  <div
                    className="mt-20"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={`/assets/img/${item.imageSrc}`}
                      style={{
                        height: "30px",
                        width: "30px",
                        marginRight: "10px",
                      }}
                    />
                    <span className="text-10 pr-40">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
            paddingY: "5px",
          }}
        >
          <TableContainer
            sx={{
              width: "80%",
              background: "#140342",
              borderRadius: "10px",
              paddingX: "30px", // Add padding to prevent content from going to the edges
            }}
            component={Paper}
          >
            <Table aria-label="simple table">
              <TableHead>
                {/* Image Row */}
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ borderBottom: "none" }} // Remove border from TableCell
                  >
                    <img
                      src="/assets/img/mvpImage/photography.jpg"
                      style={{
                        borderRadius: "6px",
                        height: "320px",
                        width: "1020px",
                      }}
                      alt="Photography"
                    />
                  </TableCell>
                </TableRow>

                {/* Header Row */}
                <TableRow>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      color: "#fff",
                      fontFamily: "DM Sans, sans-serif",
                      fontSize: "20px",
                      textAlign: "left", // Align to the left
                      paddingLeft: "16px", // Add padding to the left
                    }}
                  >
                    Features
                  </TableCell>
                  <TableCell
                    align="right" // Align to the right
                    sx={{
                      borderBottom: "none",
                      paddingRight: "32px", // Add padding to the right
                    }}
                  >
                    <Typography
                      sx={{ color: "#fff", fontFamily: "DM Sans, sans-serif " }}
                    >
                      Tourist
                    </Typography>
                    <Typography
                      sx={{
                        color: "purple",
                        fontSize: "17px",
                        fontFamily: "Poppins, sans-serif",
                        display: "inline-flex", // Change to inline-flex for alignment
                        alignItems: "center", // Ensure alignment of the dollar sign and number
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          top: "-5px", // Adjust to move the dollar sign higher or lower
                          fontSize: "12px", // Smaller size for the dollar sign
                        }}
                      >
                        $
                      </span>
                      375
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right" // Align to the right
                    sx={{
                      borderBottom: "none",
                      paddingRight: "32px", // Add padding to the right
                    }}
                  >
                    <Typography
                      sx={{ color: "#fff", fontFamily: "DM Sans, sans-serif " }}
                    >
                      Atlantis
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "17px",
                        fontFamily: "Poppins, sans-serif",
                        display: "inline-flex",
                        alignItems: "center",
                        color: "purple",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          top: "-5px", // Adjust this value to move the dollar symbol higher or lower
                          fontSize: "12px", // Smaller size for the dollar sign
                        }}
                      >
                        $
                      </span>
                      600
                    </Typography>
                  </TableCell>
                  <TableCell
                    align="right" // Align to the right
                    sx={{
                      borderBottom: "none",
                      paddingRight: "32px", // Add padding to the right
                    }}
                  >
                    <Typography
                      sx={{ color: "#fff", fontFamily: "DM Sans, sans-serif " }}
                    >
                      Celestial
                    </Typography>
                    <Typography
                      sx={{
                        color: "purple",
                        fontSize: "17px",
                        fontFamily: "Poppins, sans-serif",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          top: "-5px", // Adjust this value if necessary
                          fontSize: "12px", // Smaller size for the dollar sign
                        }}
                      >
                        $
                      </span>
                      800
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {featuresData.map((row) => (
                  <TableRow
                    key={row.feature}
                    sx={{
                      "&:last-child td, &:last-child th": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        color: "#fff",
                        fontSize: "16px",
                        borderBottom: "none",
                        textAlign: "left", // Align to the left
                        paddingLeft: "16px", // Add padding to the left
                      }}
                      component="th"
                      scope="row"
                    >
                      {row.feature}
                    </TableCell>
                    {row.plans.map((plan, index) => (
                      <TableCell
                        key={index}
                        align="right" // Align to the right
                        sx={{
                          borderBottom: "none",
                          paddingRight: "32px", // Add padding to the right
                        }}
                      >
                        {typeof plan === "boolean" ? (
                          plan ? (
                            <CheckIcon
                              sx={{
                                color: "#00BFA6",
                                borderRadius: "50%",
                                fontSize: "2.4rem",
                                padding: "3px",
                              }}
                            />
                          ) : (
                            <Typography
                              sx={{
                                color: "#E57373",
                                display: "inline-block",
                                padding: "3px 5px",
                              }}
                            >
                              ✕
                            </Typography>
                          )
                        ) : (
                          plan
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* <Grid container  spacing={2}>
      {pricingData.map((plan, index) => (
        <PlanCard 
          key={index} 
          title={plan.title} 
          price={plan.price} 
          features={plan.features} 
        />
      ))}
    </Grid> */}
      </Box>
    </>
  );
};

export default PricingSection;
