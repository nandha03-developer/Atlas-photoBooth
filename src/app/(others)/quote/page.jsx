import Preloader from "../../../components/common/Preloader";
import Header from "../../../components/layout/headers/Header";
import QuoteForm from "../../../components/others/QuoteForm";
import React from "react";
import { Suspense } from 'react';


export default function page() {
  return (
    <div className="main-content">
      <Preloader />
      <Header />
      <div
        className="content-wrapper js-content-wrapper overflow-hidden"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
         <Suspense fallback={<div>Loading...</div>}>
        <QuoteForm />
        </Suspense>
      </div>
    </div>
  );
}
