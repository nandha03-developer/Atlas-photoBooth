import React from "react";
import { UserProvider } from "../context/UserDataContext";
import { DataProvider } from "../context/useOrderDetails";

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <UserProvider>
      <DataProvider>{children}</DataProvider>
    </UserProvider>
  );
};

export default GlobalProvider;
