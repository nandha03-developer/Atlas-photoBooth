// "use client";
// import React, { useContext, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import convertToSubcurrency from "../../../lib/convertToSubcurrency";
// import CheckoutPage from "../../../components/checkoutPage/CheckoutPage";
// import { DataContext } from "../../../context/useOrderDetails";
// import { useRouter } from "next/navigation";
// if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
//   throw new Error("NEXT_PUBLIC_STRIPE_PUBLIc_KEY is not defined");
// }
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
// const Payment = () => {
//   const router = useRouter();
//   const { sharedData } = useContext(DataContext);
//   const amounts = sharedData?.pricing||"";
//   const amount = amounts || localStorage.getItem("amount");
//   useEffect(() => {
//     localStorage.setItem("amount", amount);
//     console.log("paymentpage", amount)
//   }, [sharedData]);
//   alert(amount)
//   return (
//     <div
//       style={{
//         height: "100vh",
//         maxWidth: "600px",
//         margin: "auto",
//         // padding: "20px",
//         color: "#ffffff",
//         textAlign: "center",
//         borderRadius: "10px",
//         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         // marginTop: "1%", // Add a top margin for spacing
//         // marginBottom: "1%", // Optional: Add a bottom margin for spacing
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "1rem",
//           fontWeight: "600",
//           marginBottom: "10px",
//           textAlign: "end",
//         }}
//       >
//         Payment
//       </h1>
//       <h2
//         style={{ fontSize: "0.7rem", fontWeight: "400", marginBottom: "20px" }}
//       >
//         All transactions are secure and encrypted.
//       </h2>
//       {amount!==null&&amount!==undefined && (
//         <Elements
//           stripe={stripePromise}
//           options={{
//             mode: "payment",
//             amount: amount||0,
//             currency: "usd",
//             // payment_method_types: ['card', 'ideal', 'ach_debit'], // Add optional payment methods here
//           }}
//         >
//           <CheckoutPage amount={amount} />
//         </Elements>
//       )}
//     </div>
//   );
// };
// export default Payment;
"use client";
import React, { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "../../../lib/convertToSubcurrency";
import CheckoutPage from "../../../components/checkoutPage/CheckoutPage";
import { DataContext } from "../../../context/useOrderDetails";
import { useRouter } from "next/navigation";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const router = useRouter();
  const { sharedData } = useContext(DataContext);
  const [isHide, setIsHide] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [data, setData] = useState(null);
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);
  const [amount, setAmount] = useState(null);
  const [amountInSubunits, setAmountInSubunits] = useState(null);
  const [packageName, setPackageName] = useState(null);
useEffect(()=>{
  const amounts = sharedData?.pricing || "";
  const amount = parseInt(amounts || localStorage.getItem("amount") || "0", 10);
  setAmount(amount)
  setAmountInSubunits(amount)
  // const amountInSubunits = amount;
  const packageDetails = JSON.parse(localStorage.getItem("paymentDetails"));

  const packageName = packageDetails?.packageName;
  setPackageName(packageName)
},[])
  // const amounts = sharedData?.pricing || "";
  // const amount = parseInt(amounts || localStorage.getItem("amount") || "0", 10);
  // const amountInSubunits = amount;

  useEffect(() => {
    if (amount > 0 &&amount!== null && amount!== undefined) {
      localStorage.setItem("amount", amount);
    }
    // console.log("Payment page amount:", amountInSubunits);
  }, [sharedData, amount, amountInSubunits]);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sharedData !== null &&
      sharedData !== undefined
    ) {
      const paymentDetails = localStorage.getItem("paymentDetails");
      //  console.log("sharedData",sharedData)
      //  console.log("paymentDetails",JSON.parse(paymentDetails))
      const data = sharedData || JSON.parse(paymentDetails);
      // console.log("payment details100",data)
      setData(data);
      localStorage.setItem("amount", sharedData?.pricing);

      localStorage.setItem("paymentDetails", JSON.stringify(sharedData));
    }
  }, [sharedData]);
  // const packageDetails = JSON.parse(localStorage.getItem("paymentDetails"));

  // const packageName = packageDetails?.packageName;
  // console.log("packageDetails",packageName)
  // if (!amountInSubunits || amountInSubunits <= 0) {
  //   return <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
  //     <h1>No amount selected</h1>
  //     <Button onClick={()=>router.push("/booknow")}>GoBack</Button>
  //   </div>;
  // }
  // const [redirectStatus, setRedirectStatus] = useState('');

  useEffect(() => {
    // Get the current URL
    const urlParams = new URLSearchParams(window.location.search);
    // Extract the redirect_status query parameter
    const status = urlParams.get("redirect_status");
    if (status === "succeeded") {
      setIsHide(true);
      setDialogOpen(true);
      // console.log("status",status)
      // setRedirectStatus(status);
    }
  }, []);
  const handelClose = () => {
    // router.push("/");
    
      localStorage.removeItem("amount");
    localStorage.removeItem("paymentDetails");
      window.location.href = "/";

  };
  if(typeof window !== "undefined" && !sharedData){
  if ((!amount || amount <= 0)&& !localStorage.getItem("amount")) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>No amount selected</h1>
        <Button
          variant="contained"
          onClick={() => router.replace("/booknow")}
          style={{
            marginTop: "8px",
            backgroundColor: "#800080",
            color: "white",
            textTransform: "none",
          }}
        >
          Go Back
        </Button>
      </div>
    );
  }
  }
  return (
    <div
      style={{
        height: "100vh",
        maxWidth: "600px",
        margin: "auto",
        color: "#ffffff",
        textAlign: "center",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "10px" }}>
        Payment
      </h1>
      <h2
        style={{ fontSize: "0.7rem", fontWeight: "400", marginBottom: "20px" }}
      >
        All transactions are secure and encrypted.
      </h2>
      {!isHide ? (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: amountInSubunits,
            currency: "usd",
          }}
        >
          <CheckoutPage amount={amountInSubunits} />
        </Elements>
      ) : (
        <div>
          <Dialog
            open={dialogOpen}
            // onClose={() => setDialogOpen(false)}
            onClose={null}
            maxWidth="md"
            PaperProps={{
              sx: {
                width: "600px",
                maxWidth: "100%",
                backgroundColor: "#fff",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#2E3B55",
                textAlign: "center",
                padding: "30px 0",
              }}
            >
              Payment Submitted
            </DialogTitle>
            <Divider sx={{ marginBottom: "20px" }} />
            <DialogContent sx={{ padding: "20px", position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  // top: "-50px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #4caf50, #8bc34a)",
                  borderRadius: "50%",
                  // padding: "30px",
                }}
              >
                <CheckCircleOutlineIcon
                  sx={{ fontSize: "4rem", color: "white" }}
                />
              </Box>
              <Box
                sx={{
                  fontSize: "1.1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "80px",
                  color: "#333",
                  fontWeight: "500",
                }}
              >
                Your payment has been successfully processed!
              </Box>
              <Stack sx={{ mt: 3 }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    fontWeight: "400",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Total paid:</span>{" "}
                  <span style={{ fontWeight: "600", color: "#4caf50" }}>
                    ${amount}
                  </span>
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    fontWeight: "400",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Payment Date:</span>{" "}
                  <span style={{ fontWeight: "600" }}>
                    {date.toLocaleDateString()}
                  </span>
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#555",
                    fontWeight: "400",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Package:</span>{" "}
                  {data && data?.packageName && (
                    <span style={{ fontWeight: "600" }}>
                      {data.packageName}
                    </span>
                  )}
                  {packageName && (
                    <span style={{ fontWeight: "600" }}>{packageName}</span>
                  )}
                </p>
              </Stack>
            </DialogContent>
            <Divider sx={{ marginTop: "20px" }} />
            <DialogActions sx={{ padding: "20px", justifyContent: "center" }}>
              <Button
                variant="contained"
                onClick={handelClose}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                    transform: "scale(1.05)",
                  },
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default Payment;
