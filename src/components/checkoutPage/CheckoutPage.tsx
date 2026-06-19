"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { DataContext } from "../../context/useOrderDetails";
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
import { useRouter } from "next/navigation";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";

const CheckoutPage = ({ amount }: { amount: number }) => {
  const { sharedData } = useContext(DataContext);
  const currentDate = new Date();
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(currentDate);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
    const url = fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);
  useEffect(() => {
    setData(sharedData);
    localStorage.setItem("amount", sharedData?.pricing);
  }, [sharedData]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
    // const { error } = await stripe.confirmPayment({
    //   elements,
    //   clientSecret,
    //   confirmParams: {
    //     return_url: `${baseUrl}/success?amount=${amount}&firstName=${sharedData.firstName}&lastName=${sharedData.lastName}&email=${sharedData.email}&phone=${sharedData.PhoneNo}&address=${sharedData.address}&city=${sharedData.cityname}&state=${sharedData.state}&orderDate=${sharedData.formattedDate}&country=${sharedData.countryName}&duration=${sharedData.duration}&door=${sharedData.doorNo}&endTime=${sharedData.endTime}&startTime=${sharedData.startTime}&occasion=${sharedData.occasion}&postal=${sharedData.postalCode}&package=${sharedData.packageName}&amount=${sharedData.pricing}&orderDate=${sharedData.today}&addOns=${sharedData.addOns}`,
    //   },
    // });
    // if (error) {
    //   setErrorMessage(error.message);
    // } else {
    //   setDialogOpen(true);
    // }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${baseUrl}/payment`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      // Payment successful, open the dialog
      setDialogOpen(true);
      onSubmit();
    }

    setLoading(false);
  };
  if (!clientSecret || !stripe || !elements) {
    return <CircularProgress />;
  }
  const onSubmit = async () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const today = `${month}-${day}-${year}`;
    if (data) {
      const mutation = `
      mutation create {
        createOrderDetails(input: {Address: "${data.address}", Bil_Amount: "", Cityname: "${data.cityname}", CountryName: "${data.countryName}", DoorNo: "${data.doorNo}", Email: "${data.email}", Event_Date:"${data.formattedDate}", FirstName: "${data.firstName}", LastName: "${data.lastName}", Occassion: "${data.occasion}", Package_Name: "${data.packageName}", Ordered_Date:"${today}", PhoneNo: "${data.PhoneNo}", PostalCode: "${data.postalCode}", Pricing: "${amount}", Rental_Duration: "${data.duration}", State: "${data.state}", AddOn:"${data.addOns}"}) {
          id
        }
      }
    `;

      const requestBody = {
        query: mutation,
      };

      const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "Content-Type": "application/json",
      };
      const endPoint: any = process.env.NEXT_PUBLIC_API_URL;
      try {
        const res = await axios.post(endPoint, requestBody, { headers });
        if (res.data.errors) {
          const errorMessage = res.data.errors[0].message;
          // toast.error(errorMessage);
        } else {
          // toast.success("Order Placed successfully");
          // setLoading(false);
          // router.push("/thankyou");
          // router.push("/")
        }
      } catch (err) {
        console.error("Error saving data:", err);
        // toast.error("Error saving data");
      }
    }
  };
  const handelClose = () => {
    // router.push("/");
    window.location.href = "/";
    localStorage.removeItem("amount");
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
        {clientSecret && <PaymentElement />}

        {errorMessage && <div>{errorMessage}</div>}
        <button
          disabled={!stripe || loading}
          style={{
            color: "white",
            width: "100%",
            padding: "10px",
            backgroundColor: "black",
            marginTop: "8px",
            borderRadius: "8px",
            fontWeight: "bold",
            opacity: loading ? 0.5 : 1,
            cursor: !stripe || loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s ease",
          }}
        >
          {!loading ? `Pay $${amount}` : "Processing..."}
        </button>
        {/* <div>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          PaperProps={{
            sx: {
              width: "600px",
              maxWidth: "100%",
              backgroundColor: 'rgba(255, 255, 255, 1)', 
              backdropFilter: 'blur(10px)', 
            },
          }}
        >
          <DialogTitle>Payment Submitted</DialogTitle>
          <Divider />
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CheckCircleOutlineIcon
                sx={{ fontSize: "5rem", color: "green" }}
              />
            </Box>
            <Box sx={{fontSize: "1.2rem", display: "flex", justifyContent: "center", alignItems: "center"}}>
            Your payment has been successfully processed!
            </Box>
            <Stack sx={{ mt: 2 }}>
              <p>
                <span style={{ fontWeight: 400, fontSize: "12px" }}>
                  Total paid:
                </span>
                {" "}<span style={{ fontWeight: 400, fontSize: "12px" }}>${amount}</span>{" "}
              </p>
              <p>
                <span style={{ fontWeight: 400, fontSize: "12px" }}>
                  Payment Date:
                </span>
                {" "}<span style={{ fontWeight: 400, fontSize: "12px" }}>{date.toLocaleDateString()}</span>{" "}
              </p>
              <p>
                <span style={{ fontWeight: 400, fontSize: "12px" }}>
                  Package:
                </span>
                {" "}<span style={{ fontWeight: 400, fontSize: "12px" }}>{data?.packageName}</span>{" "}
              </p>
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button
              variant="contained"
              onClick={handelClose}
              sx={{
                backgroundColor: "#800080",
                "&:hover": {
                  backgroundColor: "#5441ad",
                },
                transition: "background-color 0.3s ease",
              }}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div> */}
        {/* <div>
  <Dialog
    open={dialogOpen}
    onClose={() => setDialogOpen(false)}
    maxWidth="md"
    PaperProps={{
      sx: {
        width: "600px",
        maxWidth: "100%",
        backgroundColor: "rgba(255, 255, 255, 1)",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
      },
    }}
  >
    <DialogTitle
      sx={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
      }}
    >
      Payment Submitted
    </DialogTitle>
    <Divider />
    <DialogContent sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: "6rem", color: "green" }} />
      </Box>
      <Box
        sx={{
          fontSize: "1.2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
          color: "#555",
        }}
      >
        Your payment has been successfully processed!
      </Box>
      <Stack sx={{ mt: 3 }}>
        <p
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Total paid:</span>{" "}
          <span style={{ fontWeight: 600 }}>${amount}</span>
        </p>
        <p
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Payment Date:</span>{" "}
          <span style={{ fontWeight: 600 }}>
            {date.toLocaleDateString()}
          </span>
        </p>
        <p
          style={{
            fontWeight: 500,
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Package:</span>{" "}
          <span style={{ fontWeight: 600 }}>{data?.packageName}</span>
        </p>
      </Stack>
    </DialogContent>
    <Divider />
    <DialogActions sx={{ padding: "20px" }}>
      <Button
        variant="contained"
        onClick={handelClose}
        sx={{
          backgroundColor: "#800080",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#6A2C8B",
          },
          borderRadius: "4px",
          padding: "10px 20px",
          transition: "background-color 0.3s ease",
        }}
      >
        Done
      </Button>
    </DialogActions>
  </Dialog>
</div> */}
        <div>
          <Dialog
            open={dialogOpen}
            // onClose={() => setDialogOpen(false)}
            // onClose={null}
            onClose={()=>{}}
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
                  <span style={{ fontWeight: "600" }}>{data?.packageName}</span>
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
      </form>
    </>
  );
};

export default CheckoutPage;
