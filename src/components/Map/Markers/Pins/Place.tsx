import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const PlacePin = memo(({ isActive }: { isActive: boolean }) => {
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
        width: 30,
        height: 30,
        fill: theme.palette.warning.main,
      }}
    ></Box>
  );
});

export default PlacePin;
