import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import LazMap from "../components/Map";
import { Autocomplete, Box, TextField } from "@mui/material";
import { updateParams } from "../utils/location";

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
    if (!selectedEvent) {
      setMarkers(null);
    }
    retrieveLocations();
  }, [selectedEvent, retrieveLocations]);

  return (
    <Box>
      <Autocomplete
        disablePortal
        onChange={(event, data) => {
          if (data?.id) {
            setSelectedEvent(data?.id);
            updateParams("event", data?.id, true);
          } else {
            setSelectedEvent(null);
            updateParams(null, null, true);
          }
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
        sx={{ mb: 1 }}
        options={results.map(({ EventId: id, EventName, EventDate }) => {
          const date = new Date(EventDate);
          const formatter = new Intl.DateTimeFormat('en-US', { 
            dateStyle: 'short', timeStyle: 'short', });


          return {
            id,
            label: `${EventName} - ${formatter.format(date)}`,
          };
        })}
        renderInput={(params) => <TextField {...params} label="Select Event" />}
      />
      <APIProvider apiKey={""}>
        <LazMap markers={markers} eventId={selectedEvent} />
      </APIProvider>
    </Box>
  );
};

export default BasicWidget;
