import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import EventPicker from "../../../components/Modes/EventPicker";
import LocationPicker from "../../../components/Modes/LocationPicker";
import useApi from "../../../hooks/useApi";
import PurchaseButton from "../../../components/PurchaseButton";

const EventsLayout = () => {
  const {
    state: { locations, selectedEvent, locationIds, events },
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
    <>
      {events?.length > 0 && (
        <EventPicker refetchEvents={false} marginBottom={2} />
      )}
      {locations?.length > 0 && (
        <LocationPicker
          isDisabled={!selectedEvent ? true : false}
          marginBottom={2}
        />
      )}
    </>
  );
};

export default EventsLayout;
