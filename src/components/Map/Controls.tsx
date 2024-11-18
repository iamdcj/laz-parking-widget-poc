import React from "react";
import { Box, Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import { useTheme } from "@mui/material/styles";

const MapControls = ({ recenter }: { recenter: () => void }) => {
  const {
    state: { locations, mapZoom, variant },
    dispatch,
  } = useAppContext();
  const theme = useTheme();
  const isMap = variant === "map";

  return (
    <Box
      sx={{
        position: "absolute",
        padding: 1,
        top: 0,
        right: 0,
        zIndex: 1,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: `calc(100% - 12px)`,
        justifyContent: "end",
      }}
    >
      {locations?.length > 1 && (
        <Button
          variant="contained"
          aria-label="delete"
          onClick={recenter}
          sx={{
            backgroundColor: "#fff",
            color: "#25272C",
            minWidth: "auto",
            width: 30,
            height: 30,
            mb: 0.75,
            padding: 0,
          }}
        >
          <MyLocationIcon sx={{ fontSize: 14 }} />
        </Button>
      )}
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          variant="contained"
          onClick={() =>
            dispatch({ type: Actions.SET_ZOOM, payload: mapZoom + 1 })
          }
          sx={{
            minWidth: "auto",
            backgroundColor: "#fff",
            color: "#25272C",
            width: 30,
            height: 30,
            padding: 0,
            mb: 0.1,
            borderRadius: "4px 4px 0 0",
          }}
        >
          +
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            dispatch({ type: Actions.SET_ZOOM, payload: mapZoom - 1 })
          }
          sx={{
            minWidth: "auto",
            backgroundColor: "#fff",
            color: "#25272C",
            width: 30,
            height: 30,
            padding: 0,
            borderRadius: "0 0 4px 4px",
          }}
        >
          -
        </Button>
      </Box>
    </Box>
  );
};

export default MapControls;
