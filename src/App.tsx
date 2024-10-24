import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { useThemeConfig } from "./theme";
import Loader from "./components/Loader";
import { Settings } from "../types";
import Header from "./components/Header";

function App(props: Settings) {
  const { isHeaderEnabled, headerText, ...state } = props;
  const widgetTheme = useThemeConfig();

  return (
    <ThemeProvider theme={widgetTheme}>
      <AppProvider value={state}>
        <Box width={400} border={`1px solid ${widgetTheme.palette.accent.light}`} borderRadius={1}>
          {isHeaderEnabled && <Header headerText={headerText} />}
          <Box position="relative" padding={2}>
            <Loader />
            <VariantSwitch />
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
