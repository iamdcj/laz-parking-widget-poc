import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
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
      {events?.length > 0 && <EventPicker refetchEvents={false} />}
      {locations?.length > 0 && <LocationPicker />}
      <PurchaseButton />
    </Box>
  );
};

export default EventsLayout;
