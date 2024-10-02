import React, { useEffect } from "react";
import { Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../../variants/utils/maps";
import { Box } from "@mui/material";
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

  if (!locations) return null;

  return (
    <Map
      mapId="basic-map"
      style={{ height: "100%" }}
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
            address,
            city,
            state,
            zipCode,
            imageUrl,
          }: {
            id: string;
            lat: number;
            lng: number;
            label: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            imageUrl: string;
          }) => (
            <MapMarker
              key={`${id}-map-marker`}
              id={id}
              imageUrl={imageUrl}
              lat={lat}
              lng={lng}
              label={label}
              address={address}
              city={city}
              state={state}
              zipCode={zipCode}
            />
          )
        )}
    </Map>
  );
};

export default LazMap;
