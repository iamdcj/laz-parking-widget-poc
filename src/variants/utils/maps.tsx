import { useCallback, useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAppContext } from "../../context";
import { getUrlParam } from "../../utils/urls";
import useApi from "../../hooks/useApi";
import { Actions } from "../../state";

export const useMapSetup = (useLocations = false) => {
  const {
    state: { locations, bounds, variant },
    dispatch,
  } = useAppContext();
  const map = useMap();
  const core = useMapsLibrary("core");
  const [center, setCenter] = useState(null);
  const geocoding = useMapsLibrary("geocoding");
  const { location: geolocation } = getUrlParam();
  const { retrieveLocationsByBounds } = useApi();
  const isMap = variant === "map";

  async function getAddressPosition() {
    const address = geolocation ? geolocation : "New York, USA";

    try {
      const geocoder = new geocoding.Geocoder();
      const response = await geocoder.geocode({ address });

      if (!response.results || response.results.length < 1) {
        throw new Error("Unable to perform geocode lookup");
      }

      const location = response.results[0];
      const bounds = location.geometry.bounds.toJSON();

      setCenter(location.geometry.bounds.getCenter());

      dispatch({
        type: Actions.SET_BOUNDS,
        payload: bounds,
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  const fitMapBoundsUsingLocations = useCallback(() => {
    const bound = new core.LatLngBounds();

    locations.forEach(({ lat, lng }: { lat: number; lng: number }) => {
      bound.extend(new core.LatLng(lat, lng));
    });

    return map.fitBounds(bound, { left: useLocations ? 0 : 300 });
  }, [core, locations, map]);

  useEffect(() => {
    if (useLocations || !geocoding || !isMap) return;

    getAddressPosition();
  }, [geocoding]);

  useEffect(() => {
    if (useLocations || !bounds) return;

    retrieveLocationsByBounds({
      nelat: bounds.north,
      nelng: bounds.east,
      swlat: bounds.south,
      swlng: bounds.west,
    });
  }, [bounds?.north]);

  useEffect(() => {
    if (!useLocations || !core || !locations || !map) return;

    fitMapBoundsUsingLocations();
  }, [locations, core, map]);

  return [center, fitMapBoundsUsingLocations];
};
