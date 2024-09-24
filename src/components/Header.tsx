import { Box, Typography } from "@mui/material";
import React from "react";
import Icons from "./Icons";

const Header = ({ headerText }: { headerText: string }) => {
  return (
    <Box
      id="LAZ_WidgetHeader"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.main",
        padding: 1.5,
        marginBottom: 2,
        borderRadius: "0 0 5px 5px",
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
  );
};

export default Header;