import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { APIProvider, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import LazMap from "../../components/Map";
import { Box } from "@mui/material";
import { getUrlParam, returnParams } from "../../utils/urls";
import { Actions } from "../../state";
import { Location } from "../../../types";
import MapSidebar from "../../components/Map/Sidebar";

const MapWidget = () => {
  const { dispatch } = useAppContext();
  const geocoding = useMapsLibrary("geocoding");

  useEffect(() => {
    const { location } = getUrlParam();

    async function getAddressPosition() {
      if (geocoding) {
        const geocoder = new geocoding.Geocoder();
        const response = await geocoder.geocode({ address: location });

        const res = await fetch(
          "https://xpark.lazparking.com/api/v1/Locations/FindLocationsByLatLng?nelat=40.9175771&nelng=-73.7002721&swlat=40.4773991&swlng=-74.2590899&_=1621281148859&key=cea8dee4-01b6-44e6-8655-02ac0161145d"
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
            }: Location) => ({
              id: ID,
              modes: DefaultWidgetType,
              label: Name,
              rid: RateID,
              lat: Latitude,
              lng: Longitude,
            })
          ),
        });
      }
    }

    getAddressPosition();
  }, [geocoding]);

  return (
    <Box display="grid" gridTemplateColumns="1fr 3fr">
      <MapSidebar />
      <LazMap />
    </Box>
  );
};

export default MapWidget;
