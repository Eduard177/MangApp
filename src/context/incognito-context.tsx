import React, { createContext, useContext, useState } from 'react';

const IncognitoContext = createContext<{
  incognito: boolean;
  toggleIncognito: () => void;
}>({ incognito: false, toggleIncognito: () => {} });

export const IncognitoProvider = ({ children }: any) => {
  const [incognito, setIncognito] = useState(false);
  const toggleIncognito = () => setIncognito((prev) => !prev);
  const value = React.useMemo(() => ({ incognito, toggleIncognito }), [incognito, toggleIncognito]);

  return (
    <IncognitoContext.Provider value={value}>
      {children}
    </IncognitoContext.Provider>
  );
};

export const useIncognito = () => useContext(IncognitoContext);
