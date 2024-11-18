import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { useThemeConfig } from "./theme";
import { Settings } from "../types";
import Generator from "./generator";
import { Box } from "@mui/material";

function App(props: Settings) {
  const state = props;

  return (
    <AppProvider value={state}>
      <Main />
    </AppProvider>
  );
}

const Main = () => {
  const widgetTheme = useThemeConfig();
  const isDevMode = process.env.NODE_ENV === "development";

  const styles = isDevMode
    ? {
        display: "grid",
        gridTemplateColumns: "1fr min-content",
        justifyContent: "center",
        alignItems: "center",
        justifyItems: "center"
      }
    : {};

  return (
    <ThemeProvider theme={widgetTheme}>
      <Box sx={styles}>
        <VariantSwitch />
        {isDevMode && <Generator />}
      </Box>
    </ThemeProvider>
  );
};

export default App;
