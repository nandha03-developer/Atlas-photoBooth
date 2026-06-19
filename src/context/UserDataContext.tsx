import axios from 'axios';
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

interface UserContextType {
  loading: boolean;
  email: string;
  username: string;
  customer:any;
  setCustomer:any;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  fetchUser: ()=>void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userSub, setUserSub] = useState<string>('');
  const [userId, setUserId] = useState(null);  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  //   new
  useEffect(() => {
    const storedUserId:any = typeof window!==undefined &&localStorage.getItem("userEmail");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
  const fetchUser = useCallback(async () => {
    // alert("Fetching user data");
    setLoading(true);
    if (!userId) {
      return;
    }
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
      "x-api-key":  process.env.NEXT_PUBLIC_X_API_KEY,
      "Content-Type": "application/json",
    };
    // const endPoint =
    //   "https://qi2dleyd55acridbizbfbfcesa.appsync-api.us-east-2.amazonaws.com/graphql";
    const endPoint:any = process.env.NEXT_PUBLIC_API_URL;
    axios
      .post(endPoint, { query }, { headers })
      .then((res) => {
        const userDetails = res.data?.data?.listCustomers?.items || [];
        
        const userDatas = localStorage.getItem("userEmail");
        const email = userDetails.map((item:any) => item?.Email)
        
        if (userDatas) {
          const getUserDataByEmail = (email:any) =>
            userDetails.find((item:any) => item?.Email === email);
          const userData = getUserDataByEmail(userDatas);

          if (userData?.Email) {
            setCustomer(userData);
            setEmail(userData?.Email);

            return userData
          } else {
            console.log("User not found context");
          }
        } else {
          console.log("No user data in localStorage");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
      setLoading(false);
  }, [userId]);
  const contextData = {
    email,
    setEmail,
    username,
    setUsername,
    fetchUser,
    customer,
    setCustomer,
    loading
  }
  return (
    <UserContext.Provider
      value={contextData}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
