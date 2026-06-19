import React from "react";
// import TopNavOne from "./Header/TopNav/TopNavOne";
// import MenuOne from "./Header/Menu/MenuOne";
// import TopSlider from "./Header/TopNav/TopSlider";
// import Footer1 from "./Footer/Footer1";
import Footer from "../components/layout/footers/FooterOne"
import Header from "../components/layout/headers/Header"

const LayoutHeaderAndFooter = ({ children }) => {
  return (
    <div>
      <Header/>
      {children}
      <Footer />
    </div>
  );
};

export default LayoutHeaderAndFooter;
