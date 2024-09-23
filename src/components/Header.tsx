import { Box, Typography } from "@mui/material";
import React from "react";
import Icons from "./Icons";

const Header = ({ headerText }: { headerText: string }) => {
  return (
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
  );
};

export default Header;
