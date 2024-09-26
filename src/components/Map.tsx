import React, { useEffect, useState } from "react";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../variants/utils/maps";
import { Box, Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useAppContext } from "../context";
import { Actions } from "../state";
import Icons from "./Icons";
import { useTheme } from "@mui/material/styles";

const LazMap = () => {
  const {
    state: {
      locations,
      focusedLocation,
      selectedEvent,
      selectedLocation,
      mapZoom,
      mapLat,
      mapLng,
    },
    dispatch,
  } = useAppContext();
  const [center, recenter] = useMapSetup();
  const [zoomLevel, setZoomLevel] = useState(mapZoom);
  const theme = useTheme();

  useEffect(() => {
    if (!selectedEvent) {
      dispatch({
        type: Actions.SELECTED_LOCATION,
        payload: null,
      });
    }
  }, [selectedEvent?.id]);

  return (
    <Map
      mapId="basic-map"
      style={{ width: "100%", height: "60vh", marginBottom: 10 }}
      defaultCenter={center ? center.getCenter() : { lat: mapLat, lng: mapLng }}
      gestureHandling={"greedy"}
      clickableIcons={false}
      disableDefaultUI={true}
      onZoomChanged={({ detail }) => {
        setZoomLevel(detail.zoom);
      }}
      zoom={zoomLevel}
    >
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
          height: `calc(100% - 14px)`,
          justifyContent: "end",
        }}
      >
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
            onClick={() => setZoomLevel(zoomLevel + 1)}
            sx={{
              minWidth: "auto",
              width: 30,
              height: 30,
              padding: 0,
              mb: 0.1,
            }}
          >
            +
          </Button>
          <Button
            variant="contained"
            onClick={() => setZoomLevel(zoomLevel - 1)}
            sx={{ minWidth: "auto", width: 30, height: 30, padding: 0 }}
          >
            -
          </Button>
        </Box>
      </Box>
      {locations?.length > 0 &&
        locations.map(
          ({
            ID,
            Latitude,
            Longitude,
          }: {
            ID: string;
            Latitude: number;
            Longitude: number;
          }) => {
            const isActive = ID === focusedLocation || ID === selectedLocation;

            return (
              <AdvancedMarker
                onClick={() =>
                  dispatch({ type: Actions.SELECTED_LOCATION, payload: ID })
                }
                key={ID}
                position={{ lat: Latitude, lng: Longitude }}
                style={{
                  pointerEvents: "all",
                }}
              >
                <Box
                  onMouseOver={() =>
                    dispatch({ type: Actions.FOCUSED_LOCATION, payload: ID })
                  }
                  onMouseLeave={() =>
                    dispatch({ type: Actions.FOCUSED_LOCATION, payload: null })
                  }
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
                  <svg width={42} height={62} viewBox="0 0 41.65 61.41">
                    <path
                      fill={theme.palette.primary.main}
                      d="M20.69 61.41 36.77 34.2A20.82 20.82 0 1 0 0 20.82a20.63 20.63 0 0 0 1.51 7.76h-.18l.75 1.27a19.94 19.94 0 0 0 1.79 3Z"
                    />
                  </svg>
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
                </Box>
              </AdvancedMarker>
            );
          }
        )}
    </Map>
  );
};

export default LazMap;
