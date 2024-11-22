import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
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
  return <MapComponent height={height} width={width} />;
};

const MapComponent = ({
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
  const isMap = variant === "map";
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
        console.log(detail);
        
        dispatch({ type: Actions.SET_ZOOM, payload: detail.zoom });
      }}
      zoom={mapZoom}
    >
      {mapLocationText && (
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            px: 2,
            py: 1,
            pl: 1,
            top: 5,
            left: isMap ? "auto" : 5,
            right: isMap ? 20 : "auto",
            zIndex: 1,
            background: "#fff",
            fontSize: 12,
            borderRadius: 2,
          }}
        >
          <PlacePin size={12} />
          <Typography>{mapLocationText}</Typography>
        </Box>
      )}
      <MapControls recenter={recenter} />
      {locations?.length > 0 && <MapMarkers />}
    </Map>
  );
};

export default LazMap;
