import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import Icons from "../../../Icons";

const LocationPin = memo(({ isActive }: { isActive: boolean }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        transition: "all ease-in  200ms",
        transform: isActive ? "scale(1.35)" : "scale(1)",
        transformOrigin: "center center",
        pointerEvents: "all",
        borderRadius: 2,
        willChange: "transform",
        background: theme.palette.primary.main,
        fontSize: 14,
        color: isActive ? "#fff" : theme.palette.primary.main,
        padding: 0.5,
        zIndex: isActive ? 10 : 2,
        width: 42,
        height: 62,
        fill: theme.palette.primary.dark,
      }}
    >
      <Icons type="logo" width={25} style={{}} />
    </Box>
  );
});

export default LocationPin;
