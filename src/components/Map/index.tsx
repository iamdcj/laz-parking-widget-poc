import React from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../../variants/utils/maps";
import { Box, Typography } from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import MapControls from "./Controls";
import MapMarkers from "./Markers";
import { ColorScheme } from "@vis.gl/react-google-maps";
import PlacePin from "./Markers/Pins/Place";

const LazMap = ({
  height = 300,
  width = "100%",
}: {
  height?: string | number;
  width?: string | number;
}) => {
  const {
    state: { locations, mapZoom, useMap, mapLocationText, variant },
    dispatch,
  } = useAppContext();
  const renderMap = variant === "map" || useMap;

  const [center, recenter] = useMapSetup(renderMap);

  if (!renderMap) return null;

  return (
    <Map
      mapId="basic-map"
      style={{ height, width }}
      defaultCenter={center}
      gestureHandling={"greedy"}
      clickableIcons={false}
      disableDefaultUI={true}
      colorScheme={ColorScheme.LIGHT}
      onIdle={(param) => {
        dispatch({
          type: Actions.SET_BOUNDS,
          payload: param?.map?.getBounds()?.toJSON(),
        });
      }}
      onZoomChanged={({ detail }) => {
        dispatch({ type: Actions.SET_ZOOM, payload: detail.zoom });
      }}
      zoom={mapZoom}
    >
      {mapLocationText && (
        <Typography
          sx={{
            display: "flex",
            position: "absolute",
            padding: 0.5,
            top: 5,
            left: 5,
            zIndex: 1,
            background: "#fff",
            fontSize: 12,
            borderRadius: 2,
          }}
        >
          <PlacePin size={12} />
          {mapLocationText}
        </Typography>
      )}
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
          height: `calc(100% - 24px)`,
          justifyContent: "end",
        }}
      >
        <MapControls recenter={recenter} />
      </Box>
      {locations?.length > 0 && <MapMarkers />}
    </Map>
  );
};

export default LazMap;
