import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [currentMatch, setCurrentMatch] = useState(null);

  return (
    <MatchContext.Provider value={{ currentMatch, setCurrentMatch }}>
      {children}
    </MatchContext.Provider>
  );
};
