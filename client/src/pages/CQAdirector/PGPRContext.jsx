// PGPRContext.js
import React, { createContext, useContext, useState } from "react";

const PGPRContext = createContext();

export const PGPRProvider = ({ children }) => {
  const [ongoingPGPRCount, setOngoingPGPRCount] = useState(0);

  return (
    <PGPRContext.Provider value={{ ongoingPGPRCount, setOngoingPGPRCount }}>
      {children}
    </PGPRContext.Provider>
  );
};

export const usePGPR = () => {
  return useContext(PGPRContext);
};
