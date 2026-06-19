'use client'
import Header from "../components/layout/headers/Header";
import HomeHero from "../components/homes/heros/HomeHero";
import TestimonialsOne from "../components/common/TestimonialsOne";
import FeaturesOne from "../components/homes/features/FeaturesOne";
import Join from "../components/homes/join/Join";
import FooterOne from "../components/layout/footers/FooterOne";
import Preloader from "../components/common/Preloader";
import CategoriesOccassion from "../components/homes/categories/CategoriesOccassion";
import React from "react";
import { UserProvider } from "../context/UserDataContext";
import LayoutHeaderAndFooter from "../components/Layout";

// export const metadata = {
//   title: "Atlasfotobooth",
//   description:
//     "Elevate your e-learning content with Educrat, the most impressive LMS template for online courses, education and LMS platforms.",
// };

export default function HomePage() {
  return (
    <>
    {/* <LayoutHeaderAndFooter> */}
    {/* <UserProvider> */}
      <Preloader  />
      <Header />
      <div className="content-wrapper  js-content-wrapper overflow-hidden">
        <HomeHero />
        <CategoriesOccassion />
        <TestimonialsOne />
        <FeaturesOne />
        {/* <Join /> */}
        <FooterOne />
      </div>
      {/* </UserProvider> */}
      {/* </LayoutHeaderAndFooter> */}
    </>
  );
}
