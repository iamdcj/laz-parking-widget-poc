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
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26 13C26 22 16 29 16 29C16 29 6 22 6 13C6 10.3478 7.05357 7.8043 8.92893 5.92893C10.8043 4.05357 13.3478 3 16 3C18.6522 3 21.1957 4.05357 23.0711 5.92893C24.9464 7.8043 26 10.3478 26 13Z"
          fill="#FF233D"
          stroke="#FF233D"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 17C18.2091 17 20 15.2091 20 13C20 10.7909 18.2091 9 16 9C13.7909 9 12 10.7909 12 13C12 15.2091 13.7909 17 16 17Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

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
