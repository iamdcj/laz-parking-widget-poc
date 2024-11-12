import { Box, Typography } from "@mui/material";
import React from "react";
import Icons from "./Icons";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "../context";

const Header = () => {
  const {
    state: { headerText, logo },
  } = useAppContext();
  const theme = useTheme();

  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        backgroundColor: "primary.main",
        zIndex: 3,
        borderRadius: "0 0 4px 4px",
        position: "relative",
      }}
    >
      <Box
        className="LAZ_WidgetHeader_Content"
        height={48}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1.5,
          mb: -0.5,
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt="Client Logo"
            style={{ height: 30, width: "auto" }}
          />
        ) : headerText ? (
          <Typography component="p" color={theme.palette.primary.contrastText}>
            {headerText}
          </Typography>
        ) : (
          <Icons type="logo" width={45} />
        )}
      </Box>
    </Box>
  );
};

export default Header;
