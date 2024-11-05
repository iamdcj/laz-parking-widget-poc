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
        <Box width={400}>
          {isHeaderEnabled && <Header headerText={headerText} />}
          <Box
            position="relative"
            p={2}
            pt={3}
            border={`1px solid ${widgetTheme.palette.accent.light}`}
            borderRadius="0 0 4px 4px"
          >
            <Loader />
            <VariantSwitch />
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
