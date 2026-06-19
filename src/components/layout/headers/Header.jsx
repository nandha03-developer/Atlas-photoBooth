"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
  MenuItem,
  Menu,
  ListItemIcon,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Logout } from "@mui/icons-material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Menu1 from "../component/Menu";
import MobileMenu from "../component/MobileMenu";
import { useUser } from "../../../context/UserDataContext";
import Socials from "../../../components/common/Socials";
import PhoneIcon from '@mui/icons-material/Phone'; 
function generateAvatarName(name) {
  // Split the name on the first space
  const [firstPart, secondPart] = name.split(" ", 2);

  // Extract initials from the first and second parts
  const initials = [firstPart, secondPart]
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials;
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export default function Header() {
  const { fetchUser, customer, setCustomer } = useUser();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [token, setToken] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileForm, setProfileForm] = useState(false);
  const [otp, setOtp] = useState(false);
  const [cus, setCus] = useState(null);

  const randomColor = getRandomColor();
  const open = Boolean(anchorEl);

  const firstName = customer?.FirstName || "";
  const lastName = customer?.LastName || "";

  const checkPath = () => {
    const currentPath = window.location.pathname;
    if (currentPath === "/profileForm") {
      setProfileForm(false);
    } else {
      setProfileForm(true);
    }
  };
  const checkPath1 = () => {
    const currentPath = window.location.pathname;
    if (currentPath === "/otp") {
      setOtp(false);
    } else {
      setOtp(true);
    }
  };
  useEffect(() => {
    checkPath();
    checkPath1();
  }, []);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick1 = () => {
    router.push("/booknow");
  };
  const handleClick2 = () => {
    router.push("/login");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSignOut = () => {
    typeof window !== undefined && localStorage.clear();
    window.location.href = "/login";
    setCustomer(null);
  };

  const handleProfile = () => {
    router.push("/profile");
  };
  const handleOrderDetail = () => {
    router.push("/orderDetail");
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };
  useEffect(() => {
    if (customer !== null) {
      setCustomer(customer);
    }
  }, [customer]);

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      handleSignOut();
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
        (typeof window !== undefined && localStorage.getItem("Accesstoken")) ||
        (typeof window !== undefined && localStorage.getItem("usersubToken"));
      setToken(token);
    }
  }, [
    (typeof window !== "undefined" && localStorage.getItem("Accesstoken")) ||
      (typeof window !== "undefined" && localStorage.getItem("usersubToken")),
  ]);
  return (
    <>
      {otp && (
        <header className="header -type-1 ">
          <div className="header__container">
          <div style={{ display: "flex", alignItems: "center",justifyContent:"space-between",padding:"0 20px",color:"white" }}>
                <div style={{ width:"100%",display: "flex", alignItems: "center",justifyContent:"space-between",padding:"10px 20px",borderRadius:"5px",color:"white" }}>
                <div>

                
                <PhoneIcon style={{ color: "white", fontSize: "18px",marginRight:"6px" }} />
                <a
                  href="tel:3017955334"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontSize: "13px",
                    
                  }}
                >
                  301-795-5334
                </a>
                </div>
                {/* <> */}
                <div style={{display:"flex", jusifyContent:"end"}}>
                Follow us on : <Socials color="white" />
                </div>
                {/* </> */}

                </div>
              </div>
             

            <div className="row justify-between items-center" style={{paddingRight:"20px"}}>
              

              <div className="col-auto">
                <div className="header-left">
                  <div className="header__logo">
                    <Link href="/">
                      <Image
                        src="/assets/img/whiteLogo/At.svg"
                        alt="logo"
                        width={150}
                        height={65}
                        style={{ height: "65px" }}
                        priority
                      />
                    </Link>
                  </div>
                </div>
              </div>
              {/* <Menu1 allClasses={"menu__nav text-white -is-active"} /> */}
              <Menu1 allClasses={"menu__nav text-white -is-active"} />
              <MobileMenu
                setActiveMobileMenu={setActiveMobileMenu}
                activeMobileMenu={activeMobileMenu}
              />

              <div className="col-auto">
                <div className="header-right d-flex items-center">
                  <div className="header-right__icons text-white d-flex items-center">
                    {(customer && customer.CognitoId !== "") || token ? (
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
                    ) : (
                      <Button
                        className="button-font"
                        variant="contained"
                        color="primary"
                        onClick={handleClick2}
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
                    )}

                    <div className="d-none xl:d-block ml-20">
                      <button
                        onClick={() => setActiveMobileMenu(true)}
                        className="text-white items-center"
                        data-el-toggle=".js-mobile-menu-toggle"
                      >
                        <i className="text-11 icon icon-mobile-menu"></i>
                      </button>
                    </div>
                  </div>

                  {(customer && customer.CognitoId !== "") || token ? (
                    <Box
                      className="header-right__buttons items-center ml-30 "
                      sx={{ display: { xs: "none", md: "none", lg: "flex" } }}
                    >
                      {customer?.ProfileImg && (
                        <Avatar
                          src={customer?.ProfileImg}
                          sx={{
                            margin: "auto",
                            marginTop: "10px",
                            width: 60,
                            height: 60,
                            border: "2px solid white",
                          }}
                          onClick={handleAvatarClick}
                        />
                      )}

                      {customer?.ProfileImg === "" && profileForm && (
                        <Avatar
                          style={{ backgroundColor: randomColor }}
                          onClick={handleAvatarClick}
                          sx={{
                            margin: "auto",
                            marginTop: "10px",
                            width: 70,
                            height: 70,
                            border: "2px solid white",
                          }}
                        >
                          {generateAvatarName(
                            customer?.FirstName + " " + customer?.LastName
                          )}
                        </Avatar>
                      )}
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            width: 180,
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&::before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "bottom",
                        }}
                      >
                        <MenuItem onClick={handleClose}>
                          {customer?.ProfileImg ? (
                            <>
                              <Avatar
                                src={customer?.ProfileImg}
                                sx={{
                                  margin: "auto",
                                  marginTop: "10px",
                                  width: 60,
                                  height: 60,
                                }}
                                onClick={handleAvatarClick}
                              />
                            </>
                          ) : (
                            <Avatar
                              style={{ backgroundColor: randomColor }}
                              onClick={handleAvatarClick}
                              sx={{
                                margin: "auto",
                                width: 80,
                                height: 80,
                              }}
                            >
                              <Typography sx={{ fontSize: "12px" }}>
                                {generateAvatarName(
                                  customer?.FirstName + " " + customer?.LastName
                                )}
                              </Typography>
                            </Avatar>
                          )}
                          <Box sx={{ mt: 0.3 }}>
                            <Typography
                              sx={{
                                display: "inline",
                                whiteSpace: "nowrap",
                                fontSize: "13px",
                                fontWeight: "550",
                                textWrap: "wrap",
                              }}
                            >
                              {firstName}
                            </Typography>
                            <Typography
                              sx={{
                                display: "inline",
                                whiteSpace: "normal",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "100%",
                                fontSize: "13px",
                                fontWeight: "550",
                              }}
                            >
                              {" "}
                              {lastName === "undefined" ? "" : lastName}
                            </Typography>
                          </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleProfile}>
                          <Link prefetch={true} href="/profile">
                            <ListItemIcon>
                              <HowToRegIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleOrderDetail}>
                          <Link prefetch={true} href="/orderDetail">
                            <ListItemIcon>
                              <ShoppingCartIcon fontSize="small" />
                            </ListItemIcon>
                            Order Details
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogoutClick}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                      <Dialog
                        open={dialogOpen}
                        onClose={() => handleDialogClose(false)}
                        aria-labelledby="logout-dialog-title"
                        aria-describedby="logout-dialog-description"
                      >
                        <DialogTitle id="logout-dialog-title">
                          {"Confirm Logout"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="logout-dialog-description">
                            Are you sure you want to logout?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => handleDialogClose(false)}
                            color="primary"
                          >
                            No
                          </Button>
                          <Button
                            onClick={() => handleDialogClose(true)}
                            color="primary"
                            autoFocus
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  ) : (
                    <div className="header-right__buttons d-flex items-center ml-20 md:d-none">
                      <Link
                        prefetch={true}
                        href="/login"
                        className="button -underline text-white"
                      >
                        Log in
                      </Link>
                      <Link
                        prefetch={true}
                        href="/signup"
                        className="button -sm -white text-dark-1 ml-30"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        </header>
      )}
    </>
  );
}
