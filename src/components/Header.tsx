import { Box, Typography } from "@mui/material";
import React from "react";
import Icons from "./Icons";
import { useTheme } from "@mui/material/styles";

const Header = ({ headerText }: { headerText: string }) => {
  const theme = useTheme();

  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        backgroundColor:
          theme.palette.custom.headerBackground || "primary.main",
        zIndex: 3,
        borderRadius: "0 0 4px 4px",
        position: "relative",
      }}
    >
      <Box
        className="LAZ_WidgetHeader_Content"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1.5,
          mb: -0.5,
        }}
      >
        {headerText ? (
          <Typography component="p" color="#fff">
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
