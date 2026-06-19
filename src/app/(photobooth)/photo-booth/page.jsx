// "use client";
import Preloader from "../../../components/common/Preloader";
import FooterOne from "../../../components/layout/footers/FooterOne";
import Header from "../../../components/layout/headers/Header";
import Photobooth1 from "../../../components/homes/photobooth/Photobooth1";

import React from "react";

export const metadata = {
  title:
    "Atlas fotobooth || Atlas fotobooth - Professional LMS Online Education Course NextJS Template",
  description:
    "Atlas fotobooth offers a premium photo booth experience for weddings, parties, corporate events, and more. Capture unforgettable memories with our stylish and fun photo booths",
};
export default function page() {
  return (
    <div className="main-content  ">
      <Preloader />
      <Header />
      <div className="content-wrapper js-content-wrapper overflow-hidden">
        {/* <Pricing /> */}
        <Photobooth1 />
        {/* <div className="backform">
          <StepForm />
        </div> */}
        {/* <Addons /> */}
        <FooterOne />
      </div>
    </div>
  );
}
