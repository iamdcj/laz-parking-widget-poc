import React, { useEffect } from "react";
import LazMap from "../../../components/Map";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { APIProvider } from "@vis.gl/react-google-maps";
import EventPicker from "../../../components/EventPicker";
import LocationPicker from "../../../components/LocationPicker";
import useApi from "../../../hooks/useApi";
import PurchaseButton from "../../../components/PurchaseButton";

const EventsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent,
      locationIds,
      events,
      selectedLocation,
      useMap,
    },
    dispatch,
  } = useAppContext();

  const { retrieveEvents, retrieveLocations } = useApi();

  useEffect(() => {
    retrieveEvents(locationIds);
  }, []);

  useEffect(() => {
    if (!selectedEvent) {
      dispatch({ type: Actions.SET_LOCATIONS, payload: null });
    } else {
      retrieveLocations();
    }
  }, [selectedEvent?.id]);

  return (
    <Box>
      {events?.length > 0 && <EventPicker />}
      {locations?.length > 0 && (
        <>
          {useMap && <LazMap />}
          <LocationPicker />
        </>
      )}
      <PurchaseButton />
    </Box>
  );
};

export default EventsLayout;
