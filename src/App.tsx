import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { useThemeConfig } from "./theme";
import Loader from "./components/Loader";
import { Settings } from "../types";

function App(props: Settings) {
  const { theme, ...state } = props;
  const widgetTheme = useThemeConfig(theme);

  return (
    <ThemeProvider theme={widgetTheme}>
      <AppProvider value={state}>
        <Loader />
        <VariantSwitch />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
