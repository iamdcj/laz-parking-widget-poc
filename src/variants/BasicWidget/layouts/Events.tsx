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

const EventsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent,
      selectedLocation = "",
      locationIds,
      events,
      useMap,
      widgetKey,
      agentId,
      salesChannelKey,
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
      <div>
        {selectedLocation && (
          <Button
            id="btnGetRate"
            href={constructBuyLink({
              selectedLocation,
              selectedEvent,
              widgetKey,
              agentId,
              salesChannelKey,
            })}
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

export default EventsLayout;
