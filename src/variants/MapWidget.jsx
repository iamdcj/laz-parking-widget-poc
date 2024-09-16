import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const MapWidget = ({ results }) => {
  return (
    <APIProvider apiKey={""}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={ new window.google.maps.LatLng(results.map(({ Latitude, Longitude }) => [Latitude, Longitude]))}
        defaultZoom={4}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {results.map(({ Latitude, Longitude }) => (
          <Marker position={{ lat: Latitude, lng: Longitude }} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapWidget;
