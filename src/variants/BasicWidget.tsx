import React, { SyntheticEvent, useCallback, useEffect } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { updateParams } from "./utils/location";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { APIProvider } from "@vis.gl/react-google-maps";

const BasicWidget = () => {
  const {
    state: {
      locations,
      selectedEvent,
      selectedLocation = "",
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
    dispatch({ type: Actions.LOADING, payload: true });

    if (!locationIds) return;

    try {
      const params = new URLSearchParams({
        eDataLocationId: locationIds?.split(","),
        widgetkey,
        eventdriven: widgetkey ? "true" : "false",
      });

      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: Actions.SET_EVENTS, payload: data });
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
      dispatch({ type: Actions.LOADING, payload: false });
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

      dispatch({ type: Actions.SET_LOCATIONS, payload: data });
    } catch (error) {
      console.error(error.message);
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [selectedEvent]);

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    
    if (!selectedEvent) {
      dispatch({ type: Actions.SET_LOCATIONS, payload: null });
    } else {
      retrieveLocations();
    }
  }, [selectedEvent]);

  const handleOnLocationChange = (event: SelectChangeEvent<any>) => {
    dispatch({ type: Actions.SELECTED_LOCATION, payload: event?.target?.value });
    dispatch({ type: Actions.FOCUSED_LOCATION, payload: event?.target?.value });
    updateParams("lot", event?.target?.value);
  };

  const handleOnEventChange = (
    event: SyntheticEvent<Element, Event>,
    data: Record<string, any>
  ) => {
    if (data?.id) {
      dispatch({ type: Actions.SELECTED_EVENT, payload: data?.id });
      updateParams("event", data?.id, true);
    } else {
      dispatch({ type: Actions.SELECTED_EVENT, payload: null });
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
          options={events.map(
            ({
              EventId: id,
              EventName,
              EventDate,
            }: {
              EventId: string;
              EventName: string;
              EventDate: string;
            }) => {
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
            }
          )}
          renderInput={(params) => (
            <TextField {...params} label="Select Event" />
          )}
        />
      )}
      {useMap && <APIProvider apiKey=""><LazMap /></APIProvider>}
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
            {locations.map(({ ID, Name }: { ID: string; Name: string }) => (
              <MenuItem
                key={ID}
                value={ID}
                onMouseOver={() =>
                  dispatch({ type: Actions.FOCUSED_LOCATION, payload: ID })
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
