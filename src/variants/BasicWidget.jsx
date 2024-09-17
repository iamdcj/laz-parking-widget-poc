import { APIProvider } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useState } from "react";
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
import { useAppContext } from "../context";

const BasicWidget = ({ results }) => {
  const {
    state: { locations, selectedEvent, selectedLocation },
    dispatch,
  } = useAppContext();

  const handleOnEventChange = (event, data) => {
    if (data?.id) {
      dispatch({ type: "selected_event", payload: data?.id });
      updateParams("event", data?.id, true);
    } else {
      dispatch({ type: "selected_event", payload: null });
      updateParams(null, null, true);
    }
  };

  const handleOnLocationChange = (_, data) => {
    dispatch({ type: "selected_location", payload: data?.props?.value });
    dispatch({ type: "focused_location", payload: data?.props?.value });
    updateParams("lot", data?.props?.value);
  };

  const retrieveLocations = useCallback(async () => {
    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?ClientId=&ArrayeDataLocationId=[35351,95744,55606,56660,56645,145618,145620,145941]&evid=${selectedEvent}&WidgetKey=4d7e669231e54990b6c1bbe70dd59758`
      );
      const data = await res.json();

      dispatch({ type: "locations", payload: data });
    } catch (error) {
      console.error(error.message);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (!selectedEvent) {
      return dispatch({ type: "locations", payload: null });
    }
    retrieveLocations();
  }, [selectedEvent]);

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
        <LazMap />
      </APIProvider>
      {locations?.length > 1 && (
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="location">Location</InputLabel>
          <Select
            labelId="location"
            id="location"
            value={selectedLocation}
            onChange={handleOnLocationChange}
            fullWidth
            label="Age"
          >
            {locations.map(({ ID, Name }) => (
              <MenuItem
                key={ID}
                value={ID}
                onMouseOver={() =>
                  dispatch({ type: "focused_location", payload: ID })
                }
              >
                {Name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <div>
        {selectedLocation && (
          <Button
            href={`https://go.lazparking.com/buynow?l=${selectedLocation}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=4d7e669231e54990b6c1bbe70dd59758&start=2024-09-12T20%3A10%3A47.172Z&end=2024-09-12T22%3A10%3A47.172Z`}
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
