import React from "react";
import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { theme } from "./theme";
import Loader from "./components/Loader";
import { Settings } from "./utils/misc";
import Icons from "./components/Icons";

function App(props: Settings) {
  const { isHeaderEnabled, headerText } = props;

  return (
    <ThemeProvider theme={theme}>
      <AppProvider value={props}>
        <Box>
          {isHeaderEnabled && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "primary.main",
                padding: 3,
                marginBottom: 2,
                borderRadius: "0 0 5px 5px",
              }}
            >
              {headerText ? (
                <Typography component="p" color="#fff">
                  {headerText}
                </Typography>
              ) : (
                <Icons type="logo" width={50} />
              )}
            </Box>
          )}
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
