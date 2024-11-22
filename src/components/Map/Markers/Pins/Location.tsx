import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

const LocationPin = memo(
  ({
    isActive,
    isFocused,
    size = 32,
  }: {
    isActive: boolean;
    isFocused: boolean;
    size?: number;
  }) => {
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
          willChange: "transform",
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26 13C26 22 16 29 16 29C16 29 6 22 6 13C6 10.3478 7.05357 7.8043 8.92893 5.92893C10.8043 4.05357 13.3478 3 16 3C18.6522 3 21.1957 4.05357 23.0711 5.92893C24.9464 7.8043 26 10.3478 26 13Z"
            fill={
              isActive
                ? theme.palette.primary.main
                : isFocused
                ? theme.palette.primary.light
                : "#fff"
            }
            stroke={
              isActive
                ? theme.palette.primary.main
                : theme.palette.primary.light
            }
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 19V10H16.5547C17.2292 10 17.8262 10.1286 18.3457 10.3857C18.8652 10.6343 19.2708 10.9857 19.5625 11.44C19.8542 11.8857 20 12.4043 20 12.9957C20 13.5786 19.8587 14.0971 19.5762 14.5514C19.2936 15.0057 18.9063 15.3657 18.4141 15.6314C17.9219 15.8886 17.3522 16.0171 16.7051 16.0171H14.873V19H13ZM14.873 14.3971H16.6641C17.0833 14.3971 17.4251 14.2686 17.6895 14.0114C17.9629 13.7457 18.0996 13.4071 18.0996 12.9957C18.0996 12.5843 17.9492 12.25 17.6484 11.9929C17.3568 11.7357 16.9785 11.6071 16.5137 11.6071H14.873V14.3971Z"
            fill={isActive || isFocused ? "#fff" : theme.palette.primary.main}
          />
        </svg>
      </Box>
    );
  }
);

export default LocationPin;
