import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import LazMap from "../../components/Map";
import { Box } from "@mui/material";
import { getUrlParam } from "../../utils/urls";
import { Actions } from "../../state";
import { Location } from "../../../types";
import MapSidebar from "../../components/Map/Sidebar";

const MapWidget = () => {
  const { dispatch } = useAppContext();
  const geocoding = useMapsLibrary("geocoding");
  const { location: geolocation } = getUrlParam();

  useEffect(() => {
    async function getAddressPosition() {
      if (geolocation && geocoding) {
        const geocoder = new geocoding.Geocoder();
        const response = await geocoder.geocode({ address: geolocation });

        const location = response.results[0];
        const neCoords = location.geometry.bounds.getNorthEast();
        const swCoorsds = location.geometry.bounds.getSouthWest();

        const searchParams = new URLSearchParams({
          nelat: neCoords.lat().toString(),
          nelng: neCoords.lng().toString(),
          swlat: swCoorsds.lat().toString(),
          swlng: swCoorsds.lng().toString(),
          _: "1621281148859",
          key: "cea8dee4-01b6-44e6-8655-02ac0161145d",
        });

        const res = await fetch(
          `https://xpark.lazparking.com/api/v1/Locations/FindLocationsByLatLng?${searchParams}`
        );
        const data = await res.json();

        dispatch({
          type: Actions.SET_LOCATIONS,
          payload: data.map(
            ({
              DefaultWidgetType,
              ID,
              Name,
              RateID,
              Latitude,
              Longitude,
              ImageUrl,
            }: Location) => ({
              id: ID,
              modes: DefaultWidgetType,
              label: Name,
              rid: RateID,
              lat: Latitude,
              lng: Longitude,
              imageUrl: ImageUrl,
            })
          ),
        });
      }
    }

    getAddressPosition();
  }, [geocoding]);

  if (!geolocation) {
    return null;
  }

  return (
    <Box display="grid" gridTemplateColumns="1fr 3fr">
      <MapSidebar />
      <LazMap />
    </Box>
  );
};

export default MapWidget;
