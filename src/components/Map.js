import { Map, Marker } from "@vis.gl/react-google-maps";
import { useGetCenter } from "../utils/maps";

const LazMap = ({ markers }) => {
  const center = useGetCenter(markers);

  if (!center) {
    return null;
  }

  return (
    <Map
      style={{ width: "100vw", height: "100vh" }}
      defaultCenter={center.getCenter()}
      gestureHandling={"greedy"}
      defaultZoom={12}
    >
      {markers.map(({ LocationId, Latitude, Longitude }) => (
        <Marker key={LocationId} position={{ lat: Latitude, lng: Longitude }} />
      ))}
    </Map>
  );
};

export default LazMap;
