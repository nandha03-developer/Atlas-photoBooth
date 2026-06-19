"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Gallery from "./Gallery";
import Video from "./Video";
import axios from "axios";
import { Button, Grid, Skeleton, Stack, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useUser } from "../../../context/UserDataContext";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import logo from "../../../public/assets/img/logo/logo72.svg";
import Image from "next/image";
import Lottie from "lottie-react";
// import mailData from "../../../Animation - 1733294180685_Gallery 1.json";
import gallery from "../../../gallery (1).json"

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const lottieRef = React.useRef(null);
  const { email, fetchUser, customer } = useUser();
  const [value, setValue] = React.useState(0);
  const [orderDetail, setOrderDetail] = React.useState([]);
  const [userDetails, setUserDetails] = React.useState([]);
  const [selectedOccasion, setSelectedOccasion] = React.useState("");
  const [showGallery, setShowGallery] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [emptyRows, setEmptyRows] = React.useState(false);
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page change
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  React.useEffect(() => {
    const fetchData = () => {
      // setLoading(true);

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
      StartTime
      EndTime
      Completed
      AdditionalHours
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
          const userDetails = res.data?.data?.listOrderDetails?.items || [];
          const userDatas =
            typeof window !== undefined && localStorage.getItem("userEmail");
          if (userDatas) {
            const getUserDataByEmail = (email) => {
              return userDetails.filter((item) => item.Email === email);
            };
            const userData = getUserDataByEmail(userDatas);

            if (userData && userData.length > 0) {
              setLoading(true);

              setOrderDetail(userData);

              const filteredData = userData
                .filter((item) => item.Email === userDatas)
                .map((item) => ({
                  Occassion: item.Occassion,
                  Package_Name: item.Package_Name,
                  Email: item.Email,
                  Event_Date: item.Event_Date,
                  FirstName: item.FirstName,
                  LastName: item.LastName,
                }));
              // console.log("filteredData", filteredData);
              setUserDetails(filteredData);
              setTimeout(() => {
                setLoading(false);
              }, 2000);
            } else {
              setLoading(false);
              setEmptyRows(true);
            }
          } else {
            console.log("No user data in localStorage");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLoading(false);
        });
    };
    fetchData();
  }, []);
  const handleRowClick = (details) => {
    setSelectedOccasion(details);
    setShowGallery(true);
  };

  const [cols, setCols] = React.useState(5);
  const handleColChange = () => {
    setCols((prev) => (prev === 5 ? 4 : 5));
  };
  // if (!userDetails) {
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
  return (
    <>
      {showGallery && (
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          style={{ marginTop: "130px" }}
        >
          <Grid item xs={2} sx={{ display: "flex", justifyContent: "center" }}>
            <Button>
              <ArrowCircleLeftIcon
                sx={{ fontSize: 30, color: "#800080" }}
                onClick={() => setShowGallery(false)}
              />
            </Button>
            <Button onClick={handleColChange}>
              {cols === 5 ? (
                <Stack direction="row">
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                </Stack>
              ) : (
                <Stack direction="row">
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                  <Box
                    sx={{
                      width: 4,
                      height: 20,
                      backgroundColor: "#800080",
                      marginRight: 0.1,
                      borderRadius: 1,
                    }}
                  ></Box>
                </Stack>
              )}
            </Button>
          </Grid>
          <Grid item xs={2} />

          <Grid item xs={4}>
            <Typography
              align="center"
              className="heading"
              style={{ fontSize: "30px", fontWeight: "bold" }}
            >
              Gallery
            </Typography>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      )}
      <Box sx={{ width: "100%", paddingTop: { sm: 5 } }}>
        {loading && (
          // Skeleton loader while data is being fetched
          <>
            <div
              className="container d-flex justify-content-center"
              style={{ marginTop: "150px" }}
            >
              <Skeleton variant="text" width={300} height={40} />
            </div>
            <div
              className="container d-flex justify-content-center"
              style={{ marginTop: "15px", width: "100%", margin: "0 auto" }}
            >
              <Skeleton variant="text" width={500} height={20} />
            </div>
            <TableContainer
              component={Paper}
              sx={{
                maxWidth: "80%",
                margin: "20px auto",
                marginBottom: 10,
                marginTop: 5,
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {[...Array(5)].map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="text" width={100} height={20} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(5)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="rectangular" height={20} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && userDetails.length > 0 && (
          // Content when data is available
          <>
            {showGallery === false && (
              <>
                <div
                  className="container d-flex justify-content-center"
                  style={{ paddingTop: "150px" }}
                >
                  <Typography
                    className="page-header__title heading"
                    style={{ fontSize: "30px", fontWeight: "bold" }}
                  >
                    Occasion Type
                  </Typography>
                </div>
                <div
                  className="container d-flex justify-content-center"
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    margin: "0 auto",
                  }}
                >
                  <Typography
                    className="para"
                    sx={{
                      fontSize: "15px",
                      lineHeight: "1.5",
                      color: "#333",
                    }}
                  >
                    Fun, creative photo booth experiences for weddings, events,
                    and parties. Choose your occasion type
                  </Typography>
                </div>
                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: "80%",
                    margin: "20px auto",
                    marginBottom: 10,
                    marginTop: 5,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Booking Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Event Date
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Occasion
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Package Name
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDetails
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((detail, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleRowClick(detail)}
                            sx={{
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "#f5f5f5" },
                            }}
                          >
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.FirstName} {detail.LastName}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Event_Date}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Email}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Occassion}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Package_Name}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={userDetails.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </TableContainer>
              </>
            )}
            {showGallery && (
              <>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "purple",
                      },
                      "& .MuiTab-root": {
                        textTransform: "none",
                        "&.Mui-selected": {
                          color: "purple",
                        },
                      },
                    }}
                  >
                    <Tab label="IMAGES" {...a11yProps(0)} />
                    <Tab label="VIDEOS" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Gallery details={selectedOccasion} cols={cols} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <Video details={selectedOccasion} cols={cols} />
                </CustomTabPanel>
              </>
            )}
          </>
        )}

        {!loading && emptyRows && emptyRows === true && (<>
          <div className="d-flex justify-content-center" >
            <Lottie
            style={{width: "50%",paddingTop: "100px"}}
              animationData={gallery}
              lottieRef={lottieRef}
              loop
              autoplay
            />
          </div>
          {/* <div
            className="container d-flex justify-content-center"
            style={{ marginTop: "250px", marginBottom: "250px" }}
          >
            <h6 className="page-header__title heading">
              No Photos on user account!
            </h6>
          </div> */}
          </>
        )}

        {/* {!loading&&userDetails&&userDetails.length > 0 && (
          <>
            {showGallery === false && (
              <>
                <div
                  className="container  d-flex justify-content-center"
                  style={{ marginTop: "150px" }}
                >
                  <Typography
                    className="page-header__title heading"
                    style={{ fontSize: "30px", fontWeight: "bold" }}
                  >
                    Occasion Type
                  </Typography>
                </div>
                <div
                  className="container d-flex justify-content-center"
                  style={{ marginTop: "15px", width: "100%", margin: "0 auto" }}
                >
                  <Typography
                    className="para"
                    sx={{ fontSize: "15px", lineHeight: "1.5", color: "#333" }}
                  >
                    Fun, creative photo booth experiences for weddings, events,
                    and parties. Choose your occasion type
                  </Typography>
                </div>

                <TableContainer
                  component={Paper}
                  sx={{
                    maxWidth: "80%",
                    margin: "20px auto",
                    marginBottom: 10,
                    marginTop: 5,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Booking Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Event Date
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Occasion
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bolder", fontSize: "14px" }}
                          className="para"
                        >
                          Package Name
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userDetails
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((detail, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleRowClick(detail)}
                            sx={{
                              cursor: "pointer",
                              "&:hover": { backgroundColor: "#f5f5f5" },
                            }}
                          >
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.FirstName} {detail.LastName}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Event_Date}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Email}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Occassion}
                            </TableCell>
                            <TableCell
                              className="para"
                              style={{ fontSize: "13px" }}
                            >
                              {detail.Package_Name}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={userDetails.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]} 
                  />
                </TableContainer>
              </>
            )}
            {showGallery && (
              <>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "purple",
                      },
                      "& .MuiTab-root": {
                        textTransform: "none",
                        "&.Mui-selected": {
                          color: "purple",
                        },
                      },
                    }}
                  >
                    <Tab label="IMAGES" {...a11yProps(0)} />
                    <Tab label="VIDEOS" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <Gallery details={selectedOccasion} cols={cols} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <Video details={selectedOccasion} cols={cols} />
                </CustomTabPanel>
              </>
            )}
          </>
        )}  */}
      </Box>
    </>
  );
}
