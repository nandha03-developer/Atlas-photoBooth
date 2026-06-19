import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt from "jsonwebtoken";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
// import { useLanguage } from "@/context/languageContext";
import { AnyARecord } from "dns";
import { useUser } from "../../context/UserDataContext";

interface DecodedData {
  email: any;
  given_name: any;
  family_name: any;
  picture: any;
}

interface CredentialResponse {
  credential: string;
}

interface Customer {
  Email: string;
  CognitoId: string;
  DOB: string;
  FirstName: string;
  LastName: string;
  ProfileImg: string;
  Role: boolean;
  Id: string;
}

export default function GoogleSignIn() {
  const router = useRouter();
  const { customer, setCustomer } = useUser();
  // const { langCode } = useLanguage();

  //    const handleSuccess = async (credentialResponse : any) => {
  //        const idToken = credentialResponse.credential;
  //        const decodedData:any = decodeToken(idToken);
  //        if(decodedData){
  //         try{
  //             const email: any = String(decodedData?.email);
  //             const response = await fetch(
  //                 `/List_api_tables?table_name=Customer&emailid_contains=${email}`
  //               );
  //               const data = await response.json();
  //               if(data && data.Data.length > 0){
  //                 localStorage.setItem("cusId", JSON.stringify(data.Data[0].id));
  //                 router.push(`/${langCode}`);
  //               } else {
  //                 const body = {
  //                     city: "",
  //                     country: "",
  //                     district: "",
  //                     dob: 0,
  //                     emailid: decodedData.email,
  //                     firstname: decodedData.given_name,
  //                     gender: "",
  //                     interest: "",
  //                     iseverified: decodedData.email_verified,
  //                     ismverified: false,
  //                     joindate: 0,
  //                     lastname: decodedData.family_name,
  //                     mobileno: 0,
  //                     password: "",
  //                     postcode: 0,
  //                     profileimage: decodedData.picture,
  //                     state: "",
  //                     cognitoid: "google",
  //                 }
  //                 sendToApi(body);
  //               }
  //         } catch (error){
  //             console.error("Error fetching or sending data:", error);
  //         }
  //        }
  //    };

  const fetchUser = async () => {
    // alert("Fetching user data");

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
      "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint: any = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listCustomers?.items || [];
        const userDatas = typeof window!==undefined &&localStorage.getItem("userEmail");
        // const userDatas = userId;
        const email = userDetails.map((item: any) => item.Email);

        if (userDatas) {
          const getUserDataByEmail = (email: any) =>
            userDetails.find((item: any) => item.Email === email);
          const userData = getUserDataByEmail(userDatas);

          if (userData) {
            setCustomer(userData);

            return userData;
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
  };

  const decodeToken: any = (credentialResponse: any) => {
    try {
      const decoded = jwt.decode(credentialResponse);

      return decoded;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };
  // const handleSuccess = async (credentialResponse: CredentialResponse) => {
  //   // const router = useRouter();
  //   const idToken = credentialResponse.credential;
  //   const decodedData: DecodedData | null = decodeToken(idToken);

  //   if (!decodedData || !decodedData.email) {
  //     console.error("No email found in Google sign-in data");
  //     return;
  //   }

  //   const fetchData = async (email: string, decodedData: DecodedData) => {
  //     const query = `
  //       query list {
  //         listCustomers {
  //           items {
  //             Email
  //             CognitoId
  //             DOB
  //             FirstName
  //             LastName
  //             ProfileImg
  //             Role
  //             Id
  //           }
  //         }
  //       }
  //     `;

  //     const headers = {
  //       "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
  //       "Content-Type": "application/json",
  //     };

  //     const endPoint = process.env.NEXT_PUBLIC_API_URL as string;

  //     try {
  //       const res = await axios.post<{ data: { listCustomers: { items: Customer[] } } }>(endPoint, { query }, { headers });
  //       const userDetails = res.data?.data?.listCustomers?.items || [];

  //       const existingUser = userDetails.find((user) => user.Email === email);

  //       if (existingUser) {
  //         localStorage.setItem("cusId", JSON.stringify(existingUser.Id));
  //         localStorage.setItem("userEmail", existingUser.Email);
  //         toast.success("Welcome back!");
  //         router.push(`/`);
  //       } else {
  //         const mutation = `
  //           mutation create {
  //             createCustomer(input: {
  //               CognitoId: "google",
  //               DOB: "",
  //               Email: "${email}",
  //               FirstName: "${decodedData.given_name}",
  //               LastName: "${decodedData.family_name}",
  //               ProfileImg: "${decodedData.picture}",
  //               Role: false
  //             }) {
  //               CognitoId
  //               DOB
  //               Email
  //               FirstName
  //               Id
  //               LastName
  //               ProfileImg
  //               Role
  //             }
  //           }
  //         `;

  //         const requestBody = { query: mutation };
  //         await axios.post(endPoint, requestBody, { headers });
  //         localStorage.setItem("usersubToken", "google");

  //         toast.success("Account successfully created!");

  //         localStorage.setItem("userName", `${decodedData.given_name} ${decodedData.family_name}`);
  //         localStorage.setItem("userEmail", email);
  //         router.push(`/`);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching or sending data:", error);
  //     }
  //   };

  //   await fetchData(decodedData.email, decodedData);
  // };
  //   const handleSuccess = async (credentialResponse: CredentialResponse) => {
  //     const idToken = credentialResponse.credential;
  //     const decodedData: DecodedData | null = decodeToken(idToken);

  //     if (!decodedData || !decodedData.email) {
  //       console.error("No email found in Google sign-in data");
  //       return;
  //     }

  //     const fetchData = async (email: string, decodedData: DecodedData) => {
  //       const query = `
  //         query list {
  //           listCustomers {
  //             items {
  //               Email
  //               CognitoId
  //               DOB
  //               FirstName
  //               LastName
  //               ProfileImg
  //               Role
  //               Id
  //             }
  //           }
  //         }
  //       `;

  //       const headers = {
  //         "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
  //         "Content-Type": "application/json",
  //       };

  //       const endPoint = process.env.NEXT_PUBLIC_API_URL as string;

  //       try {
  //         const res = await axios.post<{ data: { listCustomers: { items: Customer[] } } }>(endPoint, { query }, { headers });
  //         const userDetails = res.data?.data?.listCustomers?.items || [];

  //         const existingUser = userDetails.find((user) => user.Email === email);

  //         if (existingUser) {
  //           localStorage.setItem("cusId", JSON.stringify(existingUser.Id));
  //           localStorage.setItem("userEmail", existingUser.Email);
  //           toast.success("Welcome back!");
  //           router.push(`/`);
  //         } else {
  //           const mutation = `
  //             mutation create {
  //               createCustomer(input: {
  //                 CognitoId: "google",
  //                 DOB: "",
  //                 Email: "${email}",
  //                 FirstName: "${decodedData.given_name}",
  //                 LastName: "${decodedData.family_name}",
  //                 ProfileImg: "${decodedData.picture}",
  //                 Role: false
  //               }) {
  //                 CognitoId
  //                 DOB
  //                 Email
  //                 FirstName
  //                 Id
  //                 LastName
  //                 ProfileImg
  //                 Role
  //               }
  //             }
  //           `;

  //           const requestBody = { query: mutation };
  //           await axios.post(endPoint, requestBody, { headers });
  //           localStorage.setItem("usersubToken", "google");

  //           toast.success("Account successfully created!");

  //           localStorage.setItem("userName", `${decodedData.given_name} ${decodedData.family_name}`);
  //           localStorage.setItem("userEmail", email);
  //           router.push(`/`);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching or sending data:", error);
  //       }
  //     };

  //     await fetchData(decodedData.email, decodedData);
  // };
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    // const router = useRouter();
    const idToken = credentialResponse.credential;
    const decodedData: DecodedData | null = decodeToken(idToken);

    if (!decodedData || !decodedData.email) {
      console.error("No email found in Google sign-in data");
      return;
    }

    const fetchData = async (email: string, decodedData: DecodedData) => {
      const query = `
            query list {
              listCustomers {
                items {
                  Email
                  CognitoId
                  DOB
                  FirstName
                  LastName
                  ProfileImg
                  Role
                  Id
                }
              }
            }
          `;

      const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY as string,
        "Content-Type": "application/json",
      };

      const endPoint = process.env.NEXT_PUBLIC_API_URL as string;

      try {
        const res = await axios.post<{
          data: { listCustomers: { items: Customer[] } };
        }>(endPoint, { query }, { headers });
        const userDetails = res.data?.data?.listCustomers?.items || [];

        const existingUser = userDetails.find((user) => user.Email === email);
        if (existingUser) {
          typeof window!==undefined &&localStorage.setItem("cusId", JSON.stringify(existingUser.Id));
          typeof window!==undefined &&localStorage.setItem("usersubToken", "google");
          typeof window!==undefined &&localStorage.setItem("userEmail", existingUser.Email);
          toast.success("Welcome back!");
          setCustomer(existingUser);
          router.push(`/`);
        } else {
          const mutation = `
                mutation create {
                  createCustomer(input: {
                    CognitoId: "google",
                    DOB: "",
                    Email: "${email}",
                    FirstName: "${decodedData.given_name}",
                    LastName: "${decodedData.family_name}",
                    ProfileImg: "${decodedData.picture}",
                    Role: false
                  }) {
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
              `;

          const requestBody = { query: mutation };
          await axios.post(endPoint, requestBody, { headers });
          typeof window!==undefined &&localStorage.setItem("usersubToken", "google");
          setCustomer(null);
          toast.success("Account successfully created!");

          typeof window!==undefined && localStorage.setItem(
            "userName",
            `${decodedData.given_name} ${decodedData.family_name}`
          );
          typeof window!==undefined && localStorage.setItem("userEmail", email);
          router.push(`/`);
          const data = await fetchUser();
          console.log("new signup",data)
          setCustomer(data)
        }
      } catch (error) {
        console.error("Error fetching or sending data:", error);
      }
    };

    await fetchData(decodedData.email, decodedData);
  };

  const sendToApi = async (body: any) => {
    try {
      const response = await axios.post("/api/customer", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        typeof window!==undefined && localStorage.setItem("cusId", JSON.stringify(response.data.id));
        // router.push(`/${langCode}`);
      } else {
        toast.error("Failed to add data.");
      }
    } catch (error: any) {
      console.error("Error adding data:", error);
      toast.error("Failed to add data.");
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="995475198331-jbs2ma2qmf5be36m6bp5uc11kltadgkt.apps.googleusercontent.com">
      <GoogleLogin
        // onSuccess={handleSuccess}
        onSuccess={(credResponse: any) =>
          handleSuccess(credResponse).catch(handleError)
        }
        onError={handleError}
      />
    </GoogleOAuthProvider>
  );
}
