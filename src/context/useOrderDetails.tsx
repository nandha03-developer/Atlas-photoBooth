// contexts/DataContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the context data
interface DataContextType {
  orderDetails: any | null;
  setOrderDetails: (data: any) => void;
  sharedData: any | null;
  setSharedData: (data: any) => void;
}

// Create the context with default values
export const DataContext = createContext<DataContextType>({
  orderDetails: null,
  setOrderDetails: () => {},
  sharedData: null,
  setSharedData: () => {},
});

// Create the provider component
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [sharedData, setSharedData] = useState<any | null>(null);
  const [orderDetails, setOrderDetails] = useState<any | null>(null);
  // useEffect(() => {
  //   localStorage.setItem('pricing', sharedData?.pricing)
  // },[])
  return (
    <DataContext.Provider value={{ sharedData, setSharedData, orderDetails, setOrderDetails }}>
      {children}
    </DataContext.Provider>
  );
};
