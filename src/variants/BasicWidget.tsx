import React, { useCallback, useEffect } from "react";
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

const BasicWidget = () => {
  const {
    state: {
      locations,
      selectedEvent,
      selectedLocation,
      locationIds,
      events,
      useMap,
      hideEventDateTime,
      clientId: ClientId = "",
      widgetKey: widgetkey = "",
      ...otherParams
    },
    dispatch,
  } = useAppContext();

  const fetchResults = useCallback(async () => {
    dispatch({ type: "loading", payload: true });

    if (!locationIds) return;

    try {
      const params = new URLSearchParams({
        eDataLocationId: locationIds?.split(","),
        widgetkey,
        eventdriven: widgetkey ? true : false,
      });

      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: "loading", payload: false });
      dispatch({ type: "events", payload: data });
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
    }
  }, [otherParams, locationIds, events]);

  const retrieveLocations = useCallback(async () => {
    const params = new URLSearchParams({
      ClientId,
      ArrayeDataLocationId: locationIds?.split(","),
      evid: selectedEvent,
      WidgetKey: widgetkey,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?${params}`
      );
      const data = await res.json();

      dispatch({ type: "locations", payload: data });
    } catch (error) {
      console.error(error.message);
    }
  }, [selectedEvent]);

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      return dispatch({ type: "locations", payload: null });
    }
    retrieveLocations();
  }, [selectedEvent]);

  const handleOnLocationChange = (_, data) => {
    dispatch({ type: "selected_location", payload: data?.props?.value });
    dispatch({ type: "focused_location", payload: data?.props?.value });
    updateParams("lot", data?.props?.value);
  };

  const handleOnEventChange = (event, data) => {
    if (data?.id) {
      dispatch({ type: "selected_event", payload: data?.id });
      updateParams("event", data?.id, true);
    } else {
      dispatch({ type: "selected_event", payload: null });
      updateParams(null, null, true);
    }
  };

  return (
    <Box>
      {events?.length > 0 && (
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
          options={events.map(({ EventId: id, EventName, EventDate }) => {
            let label = EventName;

            if (!hideEventDateTime) {
              const date = new Date(EventDate);
              const formatter = new Intl.DateTimeFormat("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              });

              label = `${EventName} - ${formatter.format(date)}`;
            }

            return {
              id,
              label,
            };
          })}
          renderInput={(params) => (
            <TextField {...params} label="Select Event" />
          )}
        />
      )}
      {useMap && <LazMap />}
      {locations?.length > 0 && (
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
            href={`https://go.lazparking.com/buynow?l=${selectedLocation}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=${widgetkey}`}
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
