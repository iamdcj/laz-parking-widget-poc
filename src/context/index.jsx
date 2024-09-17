import React, { createContext, useContext, useReducer } from "react";
import { appReducer, initialState } from "../state";

const AppContext = createContext();

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`Ye need a context.`);
  }
  return context;
}

function AppProvider({ value, children }) {
  const [state, dispatch] = useReducer(appReducer, {
    ...value,
    ...initialState,
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, useAppContext };
