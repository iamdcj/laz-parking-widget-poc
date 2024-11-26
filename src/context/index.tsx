import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import { appReducer, initialState } from "../state";
import { AppDefaults, InitialState } from "../../types";
import { returnOverrideState } from "./_utils";

const AppContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<{ type: any; payload: any }>;
} | null>(null);

function useAppContext(): any {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("No context provided");
  }
  return context;
}

function AppProvider({
  value,
  children,
}: {
  value: AppDefaults;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    ...returnOverrideState(value),
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, useAppContext };
