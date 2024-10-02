import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import LazMap from "../../components/Map";
import { Box } from "@mui/material";
import { getUrlParam } from "../../utils/urls";
import { Actions } from "../../state";
import { Location } from "../../../types";
import MapSidebar from "../../components/Map/Sidebar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MapSidebarHeader from "../../components/Map/Sidebar/SidebarHeader";

const MapWidget = () => {
  const {
    state: { apiKey: key, locations },
    dispatch,
  } = useAppContext();
  const [view, setView] = useState("list");
  const geocoding = useMapsLibrary("geocoding");
  const { location: geolocation } = getUrlParam();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const gridLayout = !isMobile ? "minmax(400px,1fr) 3fr" : "1fr";

  useEffect(() => {
    async function getAddressPosition() {
      if (geocoding) {
        const address = geolocation ? geolocation : "New York,USA";

        try {
          const geocoder = new geocoding.Geocoder();
          const response = await geocoder.geocode({ address });

          if (!response.results || response.results.length < 1) {
            throw new Error("Unable to perform geocode lookup");
          }

          const location = response.results[0];
          const neCoords = location.geometry.bounds.getNorthEast();
          const swCoorsds = location.geometry.bounds.getSouthWest();
          const searchParams = new URLSearchParams({
            nelat: neCoords.lat().toString(),
            nelng: neCoords.lng().toString(),
            swlat: swCoorsds.lat().toString(),
            swlng: swCoorsds.lng().toString(),
            _: "1621281148859",
            key,
          });

          const res = await fetch(
            `https://xpark.lazparking.com/api/v1/Locations/FindLocationsByLatLng?${searchParams}`
          );

          if (!res.ok) {
            throw new Error("Unable to retrieve locations");
          }

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
                Address1,
                City,
                State,
                Zip,
              }: Location) => ({
                id: ID,
                modes: DefaultWidgetType,
                label: Name,
                rid: RateID,
                lat: Latitude,
                lng: Longitude,
                imageUrl: ImageUrl,
                address: Address1,
                city: City,
                state: State,
                zipCode: Zip,
              })
            ),
          });
        } catch (error) {
          console.error(error.message);
        }
      }
    }

    getAddressPosition();
  }, [geocoding]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={gridLayout}
      gridTemplateRows="50vh"
    >
      {isMobile ? (
        <>
          {view === "map" ? (
            <>
              <MapSidebarHeader
                setView={setView}
                view={view}
                count={locations.length}
              />
              <LazMap />
            </>
          ) : (
            <MapSidebar setView={setView} view={view} />
          )}
        </>
      ) : (
        <>
          <MapSidebar />
          <LazMap />
        </>
      )}
    </Box>
  );
};

export default MapWidget;
