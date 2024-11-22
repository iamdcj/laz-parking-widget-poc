import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider, useAppContext } from "./context";
import { useThemeConfig } from "./theme";
import { Settings } from "../types";
import Generator from "./generator";
import { Box } from "@mui/material";
import useApi from "./hooks/useApi";

function App(props: Settings) {
  const state = props;

  return (
    <AppProvider value={state}>
      <Main />
    </AppProvider>
  );
}

const Main = () => {
  const { retrieveLanguages } = useApi();
  const {
    state: { isInitializing },
  } = useAppContext();

  const widgetTheme = useThemeConfig();
  const isDevMode = process.env.NODE_ENV === "development";

  useEffect(() => {
    retrieveLanguages();
  }, []);

  if (isInitializing) {
    return null;
  }
  return (
    <ThemeProvider theme={widgetTheme}>
      {isDevMode ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr min-content",
            justifyContent: "center",
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          <VariantSwitch />
          <Generator />
        </Box>
      ) : (
        <VariantSwitch />
      )}
    </ThemeProvider>
  );
};

export default App;
