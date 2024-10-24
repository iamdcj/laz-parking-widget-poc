import React, { useEffect } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../../variants/utils/maps";
import { Box } from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import MapControls from "./Controls";
import MapMarkers from "./Markers";

const LazMap = () => {
  const {
    state: { locations, mapZoom, mapLat, mapLng },
    dispatch,
  } = useAppContext();
  const [center, recenter] = useMapSetup();

  if (!locations) return null;
  
  return (
    <Map
      mapId="basic-map"
      style={{ height: "calc(50vh - 49px)" }}
      defaultCenter={center ? center.getCenter() : { lat: mapLat, lng: mapLng }}
      gestureHandling={"greedy"}
      clickableIcons={false}
      disableDefaultUI={true}
      onZoomChanged={({ detail }) => {
        dispatch({ type: Actions.SET_ZOOM, payload: detail.zoom });
      }}
      zoom={mapZoom}
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
