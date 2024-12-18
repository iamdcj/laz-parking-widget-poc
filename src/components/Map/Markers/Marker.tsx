import React, { memo, useCallback, useMemo } from "react";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
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
    isPlace,
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
    isPlace: boolean;
  }) => {
    const {
      dispatch,
      state: { variant, focusedLocation, selectedLocation },
    } = useAppContext();
    const [markerRef, marker] = useAdvancedMarkerRef();
    const isActive = useMemo(() => {
      return (id === id) === selectedLocation?.id;
    }, [selectedLocation?.id]);

    const isMap = variant === "map";

    const ref = useCallback(
      (marker: google.maps.marker.AdvancedMarkerElement) => {
        markerRef(marker);
        setMarkerRef(marker, id);
      },
      [marker, id]
    );

    return (
      <>
        <AdvancedMarker
          key={`map-marker-${id || label}`}
          clickable={!isPlace}
          onClick={() => {
            if (isPlace) {
              return;
            }

            dispatch({
              type: Actions.SELECTED_LOCATION,
              payload: { label, id },
            });
          }}
          position={{ lat, lng }}
          zIndex={isActive ? 20 : 10}
          ref={ref}
          style={{ cursor: isPlace ? "default" : "pointer" }}
        >
          <MapMarkerPin id={id} isPlace={isPlace} />
        </AdvancedMarker>
        {isMap && !isPlace && (
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
        )}
      </>
    );
  }
);

export default MapMarker;
