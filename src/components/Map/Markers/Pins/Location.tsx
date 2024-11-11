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
        opacity: isActive ? 1 : 0.8,
        willChange: "transform",
      }}
    >
      <Icons
        type="pin"
        width={35}
        height={54}
        fill={theme.palette.primary.main}
      />
      <Icons
        type="logo"
        width={20}
        style={{
          position: "absolute",
          top: 15,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </Box>
  );
});

export default LocationPin;
