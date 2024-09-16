import React, { createContext, useContext } from "react";

const AppContext = createContext();

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`Ye need a context.`);
  }
  return context;
}

function AppProvider({ value, children }) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export { AppProvider, useAppContext };
