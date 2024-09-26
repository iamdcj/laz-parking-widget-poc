import React from "react";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { useThemeConfig } from "./theme";
import Loader from "./components/Loader";
import { Settings } from "./utils/misc";
import Header from "./components/Header";

function App(props: Settings) {
  const { isHeaderEnabled, headerText, ...state } = props;
  const widgetTheme = useThemeConfig();

  return (
    <ThemeProvider theme={widgetTheme}>
      <AppProvider value={state}>
        <Box>
          {isHeaderEnabled && <Header headerText={headerText} />}
          <Box position="relative">
            <Loader />
            <VariantSwitch />
          </Box>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
