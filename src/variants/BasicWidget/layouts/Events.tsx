import React, { useEffect } from "react";
import LazMap from "../../../components/Map";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { APIProvider } from "@vis.gl/react-google-maps";
import EventPicker from "../../../components/EventPicker";
import LocationPicker from "../../../components/LocationPicker";
import useApi from "../../../hooks/useApi";
import { constructBuyLink } from "../../../utils/urls";
import PurchaseButton from "../../../components/PurchaseButton";

const EventsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent,
      selectedLocation = "",
      locationIds,
      events,
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
  }, [selectedEvent]);

  return (
    <Box>
      {events?.length > 0 && <EventPicker />}
      {locations?.length > 0 && (
        <>
          {useMap && (
            <APIProvider apiKey="">
              <LazMap />
            </APIProvider>
          )}
          <LocationPicker />
        </>
      )}
      <PurchaseButton />
    </Box>
  );
};

export default EventsLayout;
