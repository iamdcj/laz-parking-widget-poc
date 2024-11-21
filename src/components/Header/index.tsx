import { Box, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "../../context";
import NavigationMenu from "./NavigationMenu";

const Header = () => {
  const {
    state: { headerText, logo, labels, isHeaderEnabled },
  } = useAppContext();
  const theme = useTheme();

  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        backgroundColor: isHeaderEnabled ? "primary.dark" : "none",
        borderRadius: "4px 4px 0 0",
        position: "relative",
      }}
    >
      <Box
        className="LAZ_WidgetHeader_Content"
        height={36}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <NavigationMenu />
        {isHeaderEnabled && (
          <Box>
            {logo ? (
              <img
                src={logo}
                alt="Client Logo"
                style={{ height: 20, width: "auto" }}
              />
            ) : (
              <Typography
                component="p"
                fontWeight={600}
                color={theme.palette.primary.contrastText}
              >
                {headerText || labels.RESERVEPARKING}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
