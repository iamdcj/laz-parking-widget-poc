import React, {  useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../../context";
import DateTimePicker from "../../../../components/DateTimePicker";
import EventPicker from "../../../../components/EventPicker";
import LocationPicker from "../../../../components/LocationPicker";
import DurationSelector from "../../../../components/DurationSelector";
import { constructBuyLink, returnModes } from "../../../../utils";
import useApi from "../../../../hooks/useApi";
import { Actions } from "../../../../state";
import { Component, Mode } from "../../../../../types";

const Components: Component = {
  TMD: DateTimePicker,
  EVT: EventPicker,
  PST: DurationSelector,
  MUP: null, // EnableMultiUseMode
  MPS: null, // EnableMonthlyPassMode
  FAP: null, // EnableFixedAccessMode
  FEX: null, // EnableFixedExpiryMode
  FEP: null, // EnableFixedExpiryMode
};

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent = "",
      selectedLocation = "",
      selectedTime,
      widgetKey,
      modes,
    },
    dispatch,
  } = useAppContext();

  const [retrieveEvents, retrieveLocations] = useApi();

  useEffect(() => {
    retrieveLocations('oi');
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      dispatch({ type: Actions.RESET_EVENTS });
    } else {
      dispatch({
        type: Actions.SET_MODES,
        payload: returnModes(locations, selectedLocation),
      });
      retrieveEvents(selectedLocation);
    }
  }, [selectedLocation, retrieveLocations]);

  return (
    <Box>
      {locations?.length > 0 && <LocationPicker />}
      {modes &&
        modes.length > 0 &&
        modes.map((mode: Mode) => {
          const Thing = Components[mode];

          return <Thing />;
        })}
      <div>
        {(selectedEvent || selectedTime) && (
          <Button
            href={constructBuyLink({
              selectedLocation,
              selectedEvent,
              widgetKey,
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

export default LocationsLayout;
