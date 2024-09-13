import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import LazMap from "../components/Map";
import { Autocomplete, Box, TextField } from "@mui/material";

const BasicWidget = ({ results }) => {
  const [markers, setMarkers] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const retrieveLocations = useCallback(async () => {
    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?ClientId=&ArrayeDataLocationId=[35351,95744,55606,56660,56645,145618,145620,145941]&evid=${selectedEvent}&WidgetKey=4d7e669231e54990b6c1bbe70dd59758`
      );
      const data = await res.json();

      setMarkers(data);
    } catch (error) {}
  }, [selectedEvent]);

  useEffect(() => {
    retrieveLocations();
  }, [selectedEvent, retrieveLocations]);

  return (
    <Box>
      <Autocomplete
        disablePortal
        onChange={(event, data) => {
          setSelectedEvent(data?.id)
        }}
        sx={{ mb: 1 }}
        options={results.map(({ EventId: id, EventName: label }) => ({
          id,
          label,
        }))}
        renderInput={(params) => <TextField {...params} label="Select Event" />}
      />
      <APIProvider apiKey={""}>
        <LazMap markers={markers} eventId={selectedEvent} />
      </APIProvider>
    </Box>
  );
};

export default BasicWidget;
