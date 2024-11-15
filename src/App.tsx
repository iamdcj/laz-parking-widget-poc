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

  return (
    <ThemeProvider theme={widgetTheme}>
      <Box
        display="grid"
        gridTemplateColumns="400px 400px"
        justifyContent="center"
      >
        <VariantSwitch />
        <Generator />
      </Box>
    </ThemeProvider>
  );
};

export default App;
