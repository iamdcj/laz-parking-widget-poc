import { Box, Typography } from "@mui/material";
import React from "react";
import Icons from "./Icons";

const Header = ({ headerText }: { headerText: string }) => {
  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        backgroundColor: "primary.main",
      }}
    >
      <Box
        className="LAZ_WidgetHeader_Content"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 1.5,
          borderRadius: "0 0 4px 4px",
          mb: -0.5,
          position: "relative",
          zIndex: 1,
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
