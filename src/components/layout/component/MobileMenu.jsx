"use client";

import { mobileMenuList } from "../../../data/mobileMenu";
import { linkimage } from "../../../public/assets/img/mobileimage/link.png";

import Link from "next/link";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../../../contexts/AuthContext";
import { useUser } from "../../../context/UserDataContext";
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItemIcon,
  Menu,
  Typography,
} from "@mui/material";
import { Button, MenuItem } from "@mui/base";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import profileLink from "../../../public/assets/img/mobileimage/redirect.png";

export default function MobileMenu({ setActiveMobileMenu, activeMobileMenu }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [token, setToken] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { fetchUser, customer, setCustomer } = useUser();
  const [cus, setCus] = useState(null);
  const firstName = customer?.FirstName || "";
  const lastName = customer?.LastName || "";
  useEffect(() => {
    if (customer !== null) {
      setCus(customer);
    }
  }, [customer]);
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token =
      typeof window!==undefined &&localStorage.getItem("Accesstoken") ||
      typeof window!==undefined &&localStorage.getItem("usersubToken");
      setToken(token);
    }
  }, [
    (typeof window !== "undefined" && localStorage.getItem("Accesstoken")) ||
      (typeof window !== "undefined" && localStorage.getItem("usersubToken")),
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [menuNesting, setMenuNesting] = useState([]);
  const [menuItem, setMenuItem] = useState("");
  const [submenu, setSubmenu] = useState("");
  // const [anchorEl, setAnchorEl] = useState(null);
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(true);
    router.push("/profile");
    setTimeout(() => {
      setIsClicked(false);
    }, 100);
  };
  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

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
  const randomColor = getRandomColor();
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    mobileMenuList.forEach((elm) => {
      elm?.links?.forEach((elm2) => {
        if (elm2.href?.split("/")[1] == pathname?.split("/")[1]) {
          setMenuItem(elm.title);
        } else {
          elm2?.links?.map((elm3) => {
            if (elm3.href?.split("/")[1] == pathname?.split("/")[1]) {
              setMenuItem(elm.title);
              setSubmenu(elm2.title);
            }
          });
        }
      });
    });
  }, []);
  useEffect(() => {
    setShowMenu(true);
  }, []);

  const pathname = usePathname();
  const handleOrderDetail = () => {
    router.push("/orderDetail");
  };
  // const handleLogoutClick = () => {
  //   setAnchorEl(null);
  //   setDialogOpen(true);
  // };
  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      handleSignOut();
    }
  };
  const handleSignOut = () => {
    typeof window!==undefined &&localStorage.clear();
    window.location.href = "/login";
    setCustomer(null);
    // router.push("/login");
  };
  const handleClick1 = () => {
    router.push("/signup");
  };
  const handleClick2 = () => {
    router.push("/login");
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };
  return (
    <div
      className={`header-menu js-mobile-menu-toggle ${
        activeMobileMenu ? "-is-el-visible" : ""
      }`}
    >
      <div className="header-menu__content">
        <div className="mobile-bg js-mobile-bg"></div>
        {showMenu && activeMobileMenu && (
          <>
            {customer?.ProfileImg && (
              <div
                className={`mt-30  d-flex align-items-center ${
                  isClicked ? "bg-grey" : ""
                }`}
                onClick={handleClick}
                style={{
                  backgroundColor: isClicked ? "#F5EFFF" : "transparent",
                  borderRadius: "4px",
                  color: isClicked ? "purple" : "black",
                }}
              >
                <div className="ml-20">
                  {customer?.ProfileImg && (
                    <Avatar
                      src={customer?.ProfileImg}
                      sx={{
                        marginTop: 1,
                        width: 80,
                        height: 80,
                        border: "2px solid white",
                        marginLeft: "0", // aligns avatar to the left
                      }}
                      onClick={handleAvatarClick}
                    />
                  )}

                  {customer?.ProfileImg === "" && (
                    <Avatar
                      style={{ backgroundColor: randomColor }}
                      sx={{
                        marginTop: "10px",
                        width: 70,
                        height: 70,
                        border: "2px solid white",
                        marginLeft: "0", // aligns avatar to the left
                      }}
                      onClick={handleAvatarClick}
                    >
                      {generateAvatarName(
                        customer?.FirstName + " " + customer?.LastName
                      )}
                    </Avatar>
                  )}
                </div>
                <div className="ml-20 text-24 font-bold">
                  <div href="/profile">
                    {customer?.FirstName + " " + customer?.LastName} {""}
                  </div>
                </div>
                <div className="mr-20">
                  <Image
                    src={profileLink}
                    alt="arrow-right"
                    style={{ width: "25px", height: "20px" }}
                  />
                </div>
              </div>
            )}
            <div className="mobileMenu text-dark-1">
              {mobileMenuList.map((elm, i) => {
                if (elm.title) {
                  return (
                    <div key={i} className="submenuOne">
                      <div
                        className="title"
                        onClick={() =>
                          setMenuNesting((pre) =>
                            pre[0] == elm.title ? [] : [elm.title]
                          )
                        }
                      >
                        <span
                          className={
                            elm.title == menuItem
                              ? "activeMenu"
                              : "inActiveMenu"
                          }
                        >
                          {elm.title}
                        </span>

                        {/* Render arrow only if elm.links exists */}
                        {elm.links && (
                          <i
                            className={
                              menuNesting[0] == elm.title
                                ? "icon-chevron-right text-13 ml-10 active"
                                : "icon-chevron-right text-13 ml-10"
                            }
                          ></i>
                        )}
                      </div>

                      {elm.links &&
                        elm.links.map((itm, index) => (
                          <div
                            key={index}
                            className={
                              menuNesting[0] == elm.title
                                ? "toggle active"
                                : "toggle"
                            }
                          >
                            {itm.href && (
                              <Link
                                key={i}
                                className={
                                  pathname?.split("/")[1] ==
                                  itm.href?.split("/")[1]
                                    ? "activeMenu link"
                                    : "link inActiveMenu"
                                }
                                href={itm.href}
                              >
                                {itm.label}
                              </Link>
                            )}

                            {itm.links && (
                              <div className="submenuTwo">
                                <div
                                  className="title"
                                  onClick={() =>
                                    setMenuNesting((pre) =>
                                      pre[1] == itm.title
                                        ? [pre[0]]
                                        : [pre[0], itm.title]
                                    )
                                  }
                                >
                                  <span
                                    className={
                                      itm.title == submenu
                                        ? "activeMenu"
                                        : "inActiveMenu"
                                    }
                                  >
                                    {itm.title && itm.title}
                                  </span>

                                  {/* Render arrow only if itm.links exists */}
                                  {itm.links && (
                                    <i
                                      className={
                                        menuNesting[1] == itm.title
                                          ? "icon-chevron-right text-13 ml-10 active"
                                          : "icon-chevron-right text-13 ml-10"
                                      }
                                    ></i>
                                  )}
                                </div>
                                <div
                                  className={
                                    menuNesting[1] == itm.title
                                      ? "toggle active"
                                      : "toggle"
                                  }
                                >
                                  {itm.links &&
                                    itm.links.map((itm2, index3) => (
                                      <Link
                                        key={index3}
                                        className={
                                          pathname?.split("/")[1] ==
                                          itm2.href?.split("/")[1]
                                            ? "activeMenu link"
                                            : "link inActiveMenu"
                                        }
                                        href={itm2.href}
                                      >
                                        {itm2.label}
                                      </Link>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  );
                }
              })}

              {customer && (
                <>
                  <div
                    className="header-menu__button"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Button
                      className="button-font"
                      variant="contained"
                      color="primary"
                      sx={{
                        display: { xs: "flex", md: "flex", lg: "none" },
                        elevation: 4,
                      }}
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        width: "100px",
                        alignContent: "center",
                      }}
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </Button>
                  </div>

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
                </>
              )}
              {!customer && customer === null && (
                <>
                  <Box
                    className="header-menu__buttons-container mobileMenuLoginSingup"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "50px",
                      width: { xs: "60%", md: "80%", lg: "100%" },
                      marginX: { xs: "auto", md: "auto", lg: "auto" },
                    }}
                  >
                    Please login or create new account to access all features
                  </Box>
                  <Box
                    className="header-menu__buttons-container mobileMenuLoginSingup"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "30px",
                      width: { xs: "60%", md: "80%", lg: "100%" },
                      marginX: { xs: "auto", md: "auto", lg: "auto" },
                    }}
                  >
                    {!customer && (
                      <div className="header-menu__button">
                        <Button
                          className="button-font"
                          variant="contained"
                          color="primary"
                          sx={{
                            display: { xs: "flex", md: "flex", lg: "none" },
                            elevation: 4,
                          }}
                          style={{
                            backgroundColor: "purple",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            width: "100px",
                          }}
                          onClick={handleClick2}
                        >
                          Login
                        </Button>
                      </div>
                    )}
                    {!customer && (
                      <div className="header-menu__button">
                        <Button
                          className="button-font"
                          variant="contained"
                          color="primary"
                          sx={{
                            elevation: 4, // Adding elevation for a shadow effect
                          }}
                          style={{
                            backgroundColor: "purple",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            width: "100px",
                            marginLeft: "10px",
                          }}
                          onClick={handleClick1}
                        >
                          Signup
                        </Button>
                      </div>
                    )}
                  </Box>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className="header-menu-close"
        onClick={() => {
          setActiveMobileMenu(false);
        }}
        data-el-toggle=".js-mobile-menu-toggle"
      >
        <div className="size-40 d-flex items-center justify-center rounded-full bg-white">
          <div className="icon-close text-dark-1 text-16"></div>
        </div>
      </div>

      <div
        className="header-menu-bg"
        onClick={() => setActiveMobileMenu(false)}
      ></div>
    </div>
  );
}
