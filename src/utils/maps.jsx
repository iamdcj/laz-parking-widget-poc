import { useEffect, useState } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

export const useMapSetup = (locations) => {
  const map = useMap();
  const core = useMapsLibrary("core");
  const [center, setCenter] = useState(null);

  useEffect(() => {
    if (!core || !locations) return;

    const bound = new core.LatLngBounds();

    locations.forEach(({ Latitude, Longitude }) => {
      bound.extend(new core.LatLng(Latitude, Longitude));
    });

    setCenter(bound);
  }, [core, locations]);

  useEffect(() => {
    if (!map || !center) return;

    map.fitBounds(center);
  }, [map, center]);

  return [center, () => map.fitBounds(center)];
};
