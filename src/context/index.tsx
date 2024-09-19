import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { appReducer, InitialState, initialState } from "../state";
import { Settings } from "../utils/misc";

const AppContext = createContext<{
  state: InitialState,
  dispatch: Dispatch<{ type: any; payload: any; }>
} | null>(null);

function useAppContext(): any {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('No context provided');
  }
  return context;
}

function AppProvider({
  value,
  children,
}: {
  value: Settings;
  children: ReactNode;
}) {
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
