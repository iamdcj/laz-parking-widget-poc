import React, { memo, useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const RatePin = memo(
  ({ isActive, rate }: { isActive: boolean; rate: string }) => {
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
          "&:after, &:before": {
            content: '""',
            position: "absolute",
            top: "calc(100% - 1px)",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            transition: "all ease-in 200ms",
            background: isActive ? theme.palette.primary.main : "#fff",
            border: `1px solid ${theme.palette.primary.main}`,
            borderTop: `5px solid ${
              isActive ? theme.palette.primary.main : "#fff"
            }`,
          },
          "&:before": {
            top: "calc(100% + 1px)",
            borderTop: `6px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        {rate}
      </Box>
    );
  }
);

export default RatePin;
