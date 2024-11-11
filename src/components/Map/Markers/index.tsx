import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { useAppContext } from "../../../context";
import MapMarker from "./Marker";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";

const MapMarkers = memo(() => {
  const {
    state: { locations },
  } = useAppContext();
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({
      map,
      renderer: {
        render({ count, position }, stats) {
          const color =
            count >= Math.max(10, stats.clusters.markers.mean)
              ? "#006cba"
              : "#36aefa";

          // create svg url with fill color
          const svg = window.btoa(`
          <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
            <circle cx="120" cy="120" opacity=".6" r="70" />
            <circle cx="120" cy="120" opacity=".3" r="90" />
            <circle cx="120" cy="120" opacity=".2" r="110" />
            <circle cx="120" cy="120" opacity=".1" r="130" />
          </svg>`);

          // create marker using svg icon
          return new google.maps.Marker({
            position,
            icon: {
              url: `data:image/svg+xml;base64,${svg}`,
              scaledSize: new google.maps.Size(80, 80),
            },
            label: {
              text: String(count),
              color: "rgba(255,255,255,0.9)",
              fontSize: "16px",
            },
          });
        },
      },
    });
  }, [map]);

  // useEffect(() => {
  //   if (!clusterer) return;

  //   clusterer.clearMarkers();
  //   clusterer.addMarkers(Object.values(markers));
  // }, [markers]);

  const setMarkerRef = useCallback(
    (marker: Marker | null, id: string) => {
      if (marker && markers[id]) return;
      if (!marker && !markers[id]) return;

      setMarkers((prev) => {
        if (marker) {
          return { ...prev, [id]: marker };
        } else {
          const newMarkers = { ...prev };
          delete newMarkers[id];
          return newMarkers;
        }
      });
    },
    [markers]
  );

  return locations.map(
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
      isPlace
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
      isPlace: boolean
    }) => (
      <MapMarker
        setMarkerRef={setMarkerRef}
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
        isPlace={isPlace}
      />
    )
  );
});

export default MapMarkers;
