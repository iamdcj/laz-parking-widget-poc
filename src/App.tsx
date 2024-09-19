import React from "react";
import { Box, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import VariantSwitch from "./components/VariantSwitch";
import { AppProvider } from "./context";
import { theme } from "./theme";
import Loader from "./components/Loader";
import { Settings } from "./utils";

function App(props: Settings) {
  const { isHeaderEnabled, headerText } = props;

  return (
    <ThemeProvider theme={theme}>
      <AppProvider value={props}>
        <div
        >
          {isHeaderEnabled && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#007dba",
                padding: 3,
                marginBottom: 1,
                borderRadius: "0 0 5px 5px",
              }}
            >
              {headerText ? (
                <Typography component="p" color="#fff">
                  {headerText}
                </Typography>
              ) : (
                <img
                  src="https://go.lazparking.com/static/media/laz-logo.a4d328f3134864d713456684b16773d9.svg"
                  id="laz-logo"
                  className="laz-header-logo"
                  alt=""
                  width={50}
                />
              )}
            </Box>
          )}
          <Box position="relative">
            <Loader />
            <VariantSwitch />
          </Box>
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
