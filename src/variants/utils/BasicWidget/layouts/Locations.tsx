import React, { useCallback, useEffect } from "react";
import LazMap from "../../../../components/Map";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../../context";
import { Actions } from "../../../../state";
import { APIProvider } from "@vis.gl/react-google-maps";
import DateTimePicker from "../../../../components/DateTimePicker";
import EventPicker from "../../../../components/EventPicker";
import LocationPicker from "../../../../components/LocationPicker";

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent = "",
      selectedLocation = "",
      locationIds,
      events,
      useMap,
      selectedTime,
      hideEventDateTime,
      clientId: ClientId = "",
      widgetKey: widgetkey = "",
      ...otherParams
    },
    dispatch,
  } = useAppContext();

  const retrieveEvents = useCallback(async () => {
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
    retrieveLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      dispatch({ type: Actions.SET_EVENTS, payload: null });
    } else {
      retrieveEvents();
    }
  }, [selectedLocation]);

  return (
    <Box>
      {locations?.length > 0 && <LocationPicker />}
      {selectedLocation && (
        <>
          {events?.length > 0 && (
            <>
              <EventPicker />
              <p>or</p>
            </>
          )}
          <DateTimePicker />
        </>
      )}
      <div>
        {selectedEvent ||
          (selectedTime && (
            <Button
              href={`https://go.lazparking.com/buynow?l=${selectedLocation}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=${widgetkey}`}
              variant="outlined"
              fullWidth
              target="_blank"
              rel="noreferer"
            >
              Reserve
            </Button>
          ))}
      </div>
    </Box>
  );
};

export default LocationsLayout;
