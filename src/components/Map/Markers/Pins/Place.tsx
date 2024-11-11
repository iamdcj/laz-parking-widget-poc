import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../context";
import Icons from "../../../Icons";

const PlacePin = memo(({ isActive }: { isActive: boolean }) => {
  const {
    state: { mapLocationText },
  } = useAppContext();
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
        fontSize: 14,
        color: isActive ? "#fff" : theme.palette.accent.main,
        padding: 0.5,
        zIndex: isActive ? 10 : 2,
      }}
    >
      <Icons
        type="pin"
        width={30}
        height={48}
        fill={theme.palette.secondary.main}
      />
      {mapLocationText && (
        <Typography
          color="#fff"
          fontSize={8}
          sx={{
            position: "absolute",
            top: 15,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {mapLocationText}
        </Typography>
      )}
    </Box>
  );
});

export default PlacePin;
