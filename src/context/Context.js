"use client";

import axios from "axios";
import { coursesData } from "../data/courses";
import { events } from "../data/events";
import { productData } from "../data/products";
import React, { useCallback, useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);

  const [cartCourses, setCartCourses] = useState([]);
  const [cartEvents, setCartEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  // New states for user data
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState('');
  const [customer, setCustomer] = useState(null);
  //   new
  useEffect(() => {
    const storedUserId = typeof window!==undefined &&localStorage.getItem("userEmail");
    // alert(storedUserId)
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      return;
    }
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
      "x-api-key":  process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listCustomers?.items || [];
        // const userDatas = localStorage.getItem("userEmail");
        const userDatas = userId;
        if (userDatas) {
          const getUserDataByEmail = (email) =>
            userDetails.find((item) => item.Email === email);
          const userData = getUserDataByEmail(userDatas);
          if (userData) {
            setCustomer(userData);
            setEmail(userData.Email);
          } else {
            console.log("User not found");
          }
        } else {
          console.log("No user data in localStorage");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [userId]);
  const addCourseToCart = (id) => {
    if (!cartCourses.filter((elm) => elm.id == id)[0]) {
      const item = {
        ...coursesData.filter((elm) => elm.id == id)[0],
        quantity: 1,
      };
      setCartCourses((pre) => [...pre, item]);
    }
  };
  const isAddedToCartCourses = (id) => {
    if (cartCourses.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };
  const addProductToCart = (id) => {
    if (!cartProducts.filter((elm) => elm.id == id)[0]) {
      const item = {
        ...productData.filter((elm) => elm.id == id)[0],
        quantity: 1,
      };
      setCartProducts((pre) => [...pre, item]);
    }
  };
  const isAddedToCartProducts = (id) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };
  const addEventToCart = (id) => {
    if (!cartEvents.filter((elm) => elm.id == id)[0]) {
      const item = { ...events.filter((elm) => elm.id == id)[0], quantity: 1 };
      setCartEvents((pre) => [...pre, item]);
    }
  };
  const isAddedToCartEvents = (id) => {
    if (cartEvents.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };

  const contextElement = {
    cartProducts,
    setCartProducts,
    addProductToCart,
    isAddedToCartProducts,

    addCourseToCart,
    isAddedToCartCourses,
    cartCourses,
    setCartCourses,

    cartEvents,
    setCartEvents,
    addEventToCart,
    isAddedToCartEvents,

    // User data management
    email,
    setEmail,
    username,
    setUsername,
    fetchUser,
    customer,
    setCustomer,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
