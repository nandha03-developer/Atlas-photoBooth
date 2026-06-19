"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MobileFooter from "./MobileFooter";
import { menuList } from "../../../data/menu";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import Image from "next/image";
import axios from "axios";

// export const loginContext = React.createContext();

export default function Menu({ allClasses, headerPosition }) {
  const [menuItem, setMenuItem] = useState("");
  const [submenu, setSubmenu] = useState("");
  const [token, setToken] = useState("");
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [noReviews, setNoReviews] = useState("");

  useEffect(() => {
    menuList.forEach((elm) => {
      elm?.links?.forEach((elm2) => {
        if (elm2.href?.split("/")[1] == pathname.split("/")[1]) {
          setMenuItem(elm.title);
        } else {
          elm2?.links?.map((elm3) => {
            if (elm3.href?.split("/")[1] == pathname.split("/")[1]) {
              setMenuItem(elm.title);
              setSubmenu(elm2.title);
            }
          });
        }
      });
    });
  }, []);
  // useEffect(() => {
  //   const token =
  //     localStorage.getItem("Accesstoken")
  //   setToken(token);
  // }, []);

  useEffect(() => {
    const accessToken =
      typeof window !== undefined && localStorage.getItem("Accesstoken");
    const userSubToken =
      typeof window !== undefined && localStorage.getItem("usersubToken");
    const token = accessToken || userSubToken;
    setToken(token);
  }, []);

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
    // console.log("reviews", reviews);
  }, []);

  return (
    <div
      className={`header-menu js-mobile-menu-toggle ${
        headerPosition ? headerPosition : ""
      }`}
    >
      <div className="header-menu__content">
        <div className="mobile-bg js-mobile-bg"></div>

        <div className="d-none xl:d-flex items-center px-20 py-20 border-bottom-light">
          {/* <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
              >
                Book Now
              </Button> */}
          <Link prefetch={true} href="/login" className="text-dark-1">
            Log in
          </Link>
          <Link prefetch={true} href="/signup" className="text-dark-1 ml-30">
            Sign Up
          </Link>
        </div>

        <div className="menu js-navList">
          <ul className={`${allClasses ? allClasses : ""}`}>
            <li className="menu-item-has-children button-font">
              <Link
                prefetch={true}
                data-barba
                href="/"
                className={menuItem == "Home" ? "activeMenu" : ""}
              >
                Home
              </Link>
            </li>

            {/* about us */}
            <li
              style={{ marginLeft: 10 }}
              className="menu-item-has-children button-font"
            >
              <Link
                data-barba
                href="#"
                className={menuItem == "Events" ? "activeMenu" : ""}
              >
                About Us <i className="icon-chevron-right text-13 ml-10"></i>
              </Link>
              <ul className="subnav">
                <li className="menu__backButton js-nav-list-back">
                  <Link href="#">
                    <i className="icon-chevron-left text-13 mr-10"></i> Events
                  </Link>
                </li>
                {menuList[1].links.map((elm, i) => (
                  <li
                    key={i}
                    className={
                      pathname.split("/")[1] == elm.href.split("/")[1]
                        ? "activeMenu"
                        : "inActiveMenu"
                    }
                  >
                    <Link data-barba href={elm.href}>
                      {elm.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li
              style={{ marginLeft: 10 }}
              className="menu-item-has-children button-font"
            >
              <Link
                prefetch={true}
                data-barba
                href="/package"
                className={
                  pathname == "/package" ? "activeMenu" : "inActiveMenuTwo"
                }
              >
                Package
              </Link>
              {/* <ul className="subnav">
                <li className="menu__backButton js-nav-list-back">
                  <Link href="#">
                    <i className="icon-chevron-left text-13 mr-10"></i> Events
                  </Link>
                </li>
                {menuList[2].links.map((elm, i) => (
                  <li
                    key={i}
                    className={
                      pathname.split("/")[1] == elm.href.split("/")[1]
                        ? "activeMenu"
                        : "inActiveMenu"
                    }
                  >
                    <Link data-barba href={elm.href}>
                      {elm.label}
                    </Link>
                  </li>
                ))}
              </ul> */}
            </li>
            {/* Photo booth */}
            {/* <li style={{ marginLeft: 10 }} className="menu-item-has-children button-font">
              <Link
                prefetch={true}
                data-barba
                href="/photo-booth"
                className={
                  pathname == "/photo-booth" ? "activeMenu" : "inActiveMenuTwo"
                }
              >
                Photo Booth
              </Link>
              <ul className="subnav">
                <li className="menu__backButton js-nav-list-back">
                  <Link href="#">
                    <i className="icon-chevron-left text-13 mr-10"></i> Events
                  </Link>
                </li>
                {menuList[2].links.map((elm, i) => (
                  <li
                    key={i}
                    className={
                      pathname.split("/")[1] == elm.href.split("/")[1]
                        ? "activeMenu"
                        : "inActiveMenu"
                    }
                  >
                    <Link data-barba href={elm.href}>
                      {elm.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li> */}

            {/* review */}

            {reviews && reviews.length > 0 && (
              <li style={{ marginLeft: 10 }} className="button-font">
                <Link
                  prefetch={true}
                  data-barba
                  href="/review"
                  className={
                    pathname == "/review" ? "activeMenu" : "inActiveMenuTwo"
                  }
                >
                  Reviews
                </Link>
              </li>
            )}

            {/* gallery */}
            {token ? (
              <li style={{ marginLeft: 10 }} className=" button-font">
                <Link
                  prefetch={true}
                  data-barba
                  href="/gallery"
                  className={
                    pathname == "/login"
                      ? "activeMenu button-font"
                      : "inActiveMenuTwo button-font"
                  }
                >
                  Gallery
                </Link>
              </li>
            ) : (
              <li style={{ marginLeft: 10 }} className=" button-font">
                <Link
                  prefetch={true}
                  data-barba
                  href="/login"
                  className=" button-font"
                >
                  Gallery
                </Link>
              </li>
            )}
            {/* Contact */}
            <li style={{ marginLeft: 10 }} className="button-font">
              <Link
                data-barba
                prefetch={true}
                href="/contactus"
                className={
                  pathname == "/contactus" ? "activeMenu" : "inActiveMenuTwo"
                }
              >
                Contact
              </Link>
            </li>

            {/* Book Now Button */}
            {/* <li style={{ marginLeft: 10 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClick}
              >
                Book Now
              </Button>
            </li> */}
          </ul>
        </div>

        {/* mobile footer start */}
        {/* <MobileFooter /> */}
        {/* mobile footer end */}
      </div>

      <div
        className="header-menu-close"
        data-el-toggle=".js-mobile-menu-toggle"
      >
        <div className="size-40 d-flex items-center justify-center rounded-full bg-white">
          <div className="icon-close text-dark-1 text-16"></div>
        </div>
      </div>

      <div className="header-menu-bg"></div>
    </div>
  );
}
