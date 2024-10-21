import React, { memo, useCallback } from "react";
import { AdvancedMarker, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import MapMarkerPin from "./Pin";
import MarkerInfoWindow from "./InfoWindow";

const MapMarker = memo(
  ({
    id,
    lat,
    lng,
    setMarkerRef,
    imageUrl,
    label,
    address,
    city,
    state,
    zipCode,
  }: {
    id: string;
    imageUrl: string;
    lat: number;
    lng: number;
    label: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    setMarkerRef: any;
  }) => {
    const { dispatch } = useAppContext();
    const [markerRef, marker] = useAdvancedMarkerRef();

    const ref = useCallback(
      (marker: google.maps.marker.AdvancedMarkerElement) => {
        markerRef(marker)
        setMarkerRef(marker, id)
      },
      [setMarkerRef, id]
    );

    return (
      <>
        <AdvancedMarker
          key={id}
          onClick={() =>
            dispatch({ type: Actions.SELECTED_LOCATION, payload: id })
          }
          position={{ lat, lng }}
          style={{
            pointerEvents: "all",
          }}
          ref={ref}
        >
          <MapMarkerPin id={id} />
        </AdvancedMarker>
        <MarkerInfoWindow
          anchor={marker}
          imageUrl={imageUrl}
          id={id}
          label={label}
          address={address}
          city={city}
          state={state}
          zipCode={zipCode}
        />
      </>
    );
  }
);

export default MapMarker;
