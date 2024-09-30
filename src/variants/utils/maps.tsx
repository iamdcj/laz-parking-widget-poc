import { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useAppContext } from "../../context";

export const useMapSetup = () => {
  const {
    state: { locations },
  } = useAppContext();
  const map = useMap();
  const core = useMapsLibrary("core");
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (!core || !locations) return;

    const bound = new core.LatLngBounds();

    console.log("locations: ", locations);

    locations.forEach(({ lat, lng }: { lat: number; lng: number }) => {
      bound.extend(new core.LatLng(lat, lng));
    });

    setCenter(bound);
  }, [core, locations]);

  useEffect(() => {
    if (!map || !center) return;

    map.fitBounds(center);
  }, [map, center]);

  return [center, () => map.fitBounds(center)];
};
