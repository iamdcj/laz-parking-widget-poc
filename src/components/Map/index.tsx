import React, { useEffect } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../../variants/utils/maps";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import MapControls from "./Controls";
import MapMarker from "./Marker";

const LazMap = () => {
  const {
    state: { locations, selectedEvent, mapZoom, mapLat, mapLng },
    dispatch,
  } = useAppContext();
  const [center, recenter] = useMapSetup();

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
      style={{ width: "100%", height: "100vh" }}
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
      {locations?.length > 0 &&
        locations.map(
          ({
            id,
            lat,
            lng,
            label,
          }: {
            id: string;
            lat: number;
            lng: number;
            label: string;
          }) => <MapMarker id={id} lat={lat} lng={lng} label={label} />
        )}
    </Map>
  );
};

export default LazMap;
