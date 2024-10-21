import React from "react";
import { Box, Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useAppContext } from "../../context";
import { Actions } from "../../state";

const MapControls = ({ recenter }: { recenter: () => void }) => {
  const {
    state: { locations, mapZoom, variant },
    dispatch,
  } = useAppContext();

  const isMap = variant === 'map'
  

  return (
    <>
      {locations?.length > 1 && (
        <Button
          variant="contained"
          aria-label="delete"
          onClick={recenter}
          sx={{
            color: "#fff",
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
            width: 30,
            height: 30,
            padding: 0,
            borderRadius: "0 0 4px 4px",
          }}
        >
          -
        </Button>
      </Box>
    </>
  );
};

export default MapControls;
