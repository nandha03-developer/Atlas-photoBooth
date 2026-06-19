
"use client"
import React, { useState, useEffect } from "react";
// import { FaArrowUp } from "react-icons/fa"; // Using FontAwesome for the arrow icon
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
export default function ScrollUpArrow() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <div onClick={scrollToTop} className="scroll-button">
          <ArrowCircleUpIcon />
        </div>
      )}
      {/* <style jsx>{`
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }
        .scroll-button {
          background-color: #000;
          color: #fff;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
          transition: opacity 0.4s ease;
        }
        .scroll-button:hover {
          background-color: #333;
        }
      `}</style> */}
    </div>
  );
}
