"use client";
import React, { useContext, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "../../../lib/convertToSubcurrency";
import CheckoutPage from "../../../components/checkoutPage/CheckoutPage";
import { DataContext } from "../../../context/useOrderDetails";
import { useRouter } from "next/navigation";
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIc_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
const Payment = () => {
  const router = useRouter();
  const { sharedData } = useContext(DataContext);
  // useEffect(() => {
  
  //   // setSharedData({...sharedData,paymentPage:true})
  //   setOrderDetails(sharedData)
  // },[])
  // const amount = 100
  // const currency = "usd";
  const amount = sharedData?.pricing;
  // alert(amount)
  // useEffect(() => {
  //   if (sharedData === null) {
  //     router.push("/booknow");
  //   } else {
  //     router.push("/payment");
  //   }
  // }, []);

  return (
    <div
      style={{
        height: "100vh",
        maxWidth: "600px",
        margin: "auto",
        // padding: "20px",
        color: "#ffffff",
        textAlign: "center",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // marginTop: "1%", // Add a top margin for spacing
        // marginBottom: "1%", // Optional: Add a bottom margin for spacing
      }}
    >
      <h1
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          marginBottom: "10px",
          textAlign: "end",
        }}
      >
        Payment
      </h1>
      <h2
        style={{ fontSize: "0.7rem", fontWeight: "400", marginBottom: "20px" }}
      >
        All transactions are secure and encrypted.
      </h2>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: amount,
          currency: "usd",
          // payment_method_types: ['card', 'ideal', 'ach_debit'], // Add optional payment methods here
        }}
      >
        <CheckoutPage amount={amount} />
      </Elements>
    </div>
  );
};
export default Payment;
