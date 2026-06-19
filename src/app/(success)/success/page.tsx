"use client";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { DataContext } from "../../../context/useOrderDetails";
import { useRouter } from "next/navigation";
// import { setTime } from "react-datepicker/dist/date_utils";

const PaymentSuccess = () => {
  const router = useRouter();
  const [params, setParams] = useState<any>(null);
  if(typeof window !== "undefined"){
    const param = new URLSearchParams(window.location.search);
    setParams(param)
  }
  const firstName = params?.get("firstName");
  const lastName = params?.get("lastName");
  const email = params?.get("email");
  const phone = params?.get("phone");
  const address = params?.get("address");
  const city = params?.get("city");
  const state = params?.get("state");
  const orderDate = params?.get("orderDate");
  const country = params?.get("country");
  const door = params?.get("door");
  const amounts = params?.get("amount");
  const occasion = params?.get("occasion");
  const packageName = params?.get("package");
  const postalCode = params?.get("postal");
  const duration = params?.get("duration");
  const addOns = params?.get("addOns");
  const [packageData, setPackageData] = useState<any>(packageName);
  const [amountData, setAmountData] = useState<any>(amounts);
  const currentDate = new Date();
  const days = String(currentDate.getDate()).padStart(2, "0");
  const months = String(currentDate.getMonth() + 1).padStart(2, "0");
  const years = currentDate.getFullYear();
  let hours = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  const time = `${formattedHours}:${minutes} ${period}`;
  const today = `${months}-${days}-${years}${" "} ${time}`;
  const hasSubmitted = useRef(false);

  useEffect(() => {
    // Check if the function has already been called
    if (!hasSubmitted.current) {
      onSubmit();
      hasSubmitted.current = true; // Mark as submitted
    }
  }, []);

  const onSubmit = async () => {
    const mutation = `
      mutation create {
        createOrderDetails(input: {Address: "${address}", Bil_Amount: "", Cityname: "${city}", CountryName: "${country}", DoorNo: "${door}", Email: "${email}", Event_Date:"${orderDate}", FirstName: "${firstName}", LastName: "${lastName}", Occassion: "${occasion}", Package_Name: "${packageName}", Ordered_Date:"${today}", PhoneNo: "${phone}", PostalCode: "${postalCode}", Pricing: "${amounts}", Rental_Duration: "${duration}", State: "${state}", AddOn:"${addOns}"}) {
          id
        }
      }
    `;

    const requestBody = {
      query: mutation,
    };

    // const headers = {
    //   "x-api-key": "da2-ayrlrqjwu5dazeu6zzoaz3notu",
    //   "Content-Type": "application/json",
    // };
    const headers = {
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    const endPoint:any = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await axios.post(endPoint, requestBody, { headers });
      if (res.data?.errors) {
        const errorMessage = res?.data?.errors[0]?.message;
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
  };

  return (
    <>
      {/* <div></div> */}
      <div
        style={{
          height: "100vh",
          maxWidth: "600px", // Set a maximum width for better visual appeal
          margin: "auto",
          // padding: "20px",
          color: "#ffffff",
          textAlign: "center",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // marginTop: "1%", // Add a top margin for spacing
          // marginBottom: "1%", // Optional: Add a bottom margin for spacing
        }}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
          <h2 className="text-2xl">You successfully sent</h2>

          <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
            Your order of ${amountData} and package {packageData} has been
            placed.
          </div>
        </div>

        <div>
          <div>
            <button onClick={() => router.push("/")} className="go-back-home">
              Go back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PaymentSuccess;
