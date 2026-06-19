// UserContext.tsx
import React, { createContext, useState, useContext } from 'react';


const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);

  const setUser = (email, token) => {
    setEmail(email);
    setToken(token);
  };

  return (
    <UserContext.Provider value={{ email, token, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
