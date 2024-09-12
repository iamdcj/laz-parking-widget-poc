import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import LazMap from "../components/Map";

const BasicWidget = ({ results }) => {
  const [event, selectEvent] = useState(null);
  const [markers, setMarkers] = useState(null);

  const retrieveLocations = async (EventId) => {
    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?ClientId=&ArrayeDataLocationId=[35351,95744,55606,56660,56645,145618,145620,145941]&evid=${EventId}&WidgetKey=4d7e669231e54990b6c1bbe70dd59758`
      );
      const data = await res.json();

      setMarkers(data);
    } catch (error) {}
  };


  return (
    <div>
      <select onChange={(event) => retrieveLocations(event.target.value)}>
        {results.map((event, index) => (
          <option value={event.EventId}>{event.EventName}</option>
        ))}
      </select>
      {markers?.length > 0 && (
        <APIProvider apiKey={""}>
          <LazMap markers={markers} />
        </APIProvider>
      )}
    </div>
  );
};

export default BasicWidget;
