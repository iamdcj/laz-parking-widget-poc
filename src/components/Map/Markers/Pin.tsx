import React, { memo, useMemo } from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import Icons from "../../Icons";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const MapMarkerPin = memo(
  ({ id, isPlace }: { id: string; isPlace: boolean }) => {
    const {
      state: { focusedLocation, selectedLocation },
      dispatch,
    } = useAppContext();
    const theme = useTheme();
    const isActive = useMemo(() => {
      return id === focusedLocation || id === selectedLocation;
    }, [focusedLocation, selectedLocation]);

    const pinStyles = isPlace
      ? {
          width: 30,
          height: 30,
          fill: theme.palette.warning.main,
        }
      : {
          width: 42,
          height: 62,
          fill: theme.palette.primary.dark,
        };

    return (
      <Box
        onMouseOver={() =>
          dispatch({ type: Actions.FOCUSED_LOCATION, payload: id })
        }
        onMouseLeave={() =>
          dispatch({
            type: Actions.FOCUSED_LOCATION,
            payload: null,
          })
        }
        sx={{
          display: "flex",
          alignItems: "center",
          transition: "all ease-in  200ms",
          transform: isActive ? "scale(1.35)" : "scale(1)",
          transformOrigin: "center center",
          pointerEvents: "all",
          opacity: isPlace ? 1 : isActive ? 1 : 0.8,
          willChange: "transform",
        }}
      >
        <svg {...pinStyles} viewBox="0 0 41.65 61.41">
          <path
            fill={pinStyles.fill}
            d="M20.69 61.41 36.77 34.2A20.82 20.82 0 1 0 0 20.82a20.63 20.63 0 0 0 1.51 7.76h-.18l.75 1.27a19.94 19.94 0 0 0 1.79 3Z"
          />
        </svg>
        {!isPlace && (
          <Icons
            type="logo"
            width={25}
            style={{
              position: "absolute",
              top: 15,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </Box>
    );
  }
);

export default MapMarkerPin;
