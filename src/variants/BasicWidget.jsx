import { APIProvider } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";
import LazMap from "../components/Map";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { updateParams } from "./utils/location";

const BasicWidget = ({ results }) => {
  const [markers, setMarkers] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleOnEventChange = (event, data) => {
    if (data?.id) {
      setSelectedEvent(data?.id);
      updateParams("event", data?.id, true);
    } else {
      setSelectedEvent(null);
      updateParams(null, null, true);
    }
  }

  const handleOnLocationChange = (_, data) => {
    setSelected(data?.props?.value);
    setFocused(data?.props?.value);
    updateParams("lot", data?.props?.value);
  };

  const retrieveLocations = useCallback(async () => {
    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?ClientId=&ArrayeDataLocationId=[35351,95744,55606,56660,56645,145618,145620,145941]&evid=${selectedEvent}&WidgetKey=4d7e669231e54990b6c1bbe70dd59758`
      );
      const data = await res.json();

      setMarkers(data);
    } catch (error) {
      console.error(error.message);
    }
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
        onChange={handleOnEventChange}
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
          const formatter = new Intl.DateTimeFormat("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          });

          return {
            id,
            label: `${EventName} - ${formatter.format(date)}`,
          };
        })}
        renderInput={(params) => <TextField {...params} label="Select Event" />}
      />
      <APIProvider apiKey={""}>
        <LazMap
          markers={markers}
          setSelected={setSelected}
          focused={focused}
          setFocused={setFocused}
        />
      </APIProvider>

      {markers?.length > 1 && (
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selected ? selected : ""}
            onChange={handleOnLocationChange}
            fullWidth
            label="Age"
          >
            {markers.map(({ ID, Name }) => (
              <MenuItem key={ID} value={ID} onMouseOver={() => setFocused(ID)}>
                {Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <div>
        {selected && (
          <Button
            href={`https://go.lazparking.com/buynow?l=${selected}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=4d7e669231e54990b6c1bbe70dd59758&start=2024-09-12T20%3A10%3A47.172Z&end=2024-09-12T22%3A10%3A47.172Z`}
            variant="outlined"
            fullWidth
            target="_blank"
            rel="noreferer"
          >
            Reserve
          </Button>
        )}
      </div>
    </Box>
  );
};

export default BasicWidget;
