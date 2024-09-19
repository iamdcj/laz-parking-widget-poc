import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../context";
import DateTimePicker from "../../../components/DateTimePicker";
import EventPicker from "../../../components/EventPicker";
import LocationPicker from "../../../components/LocationPicker";
import DurationSelector from "../../../components/DurationSelector";
import useApi from "../../../hooks/useApi";
import { Actions } from "../../../state";
import { Mode } from "../../../../types";
import ModePicker from "../../../components/ModePicker";
import { returnModes } from "../../../utils/misc";
import { constructBuyLink } from "../../../utils/urls";

const Components = {
  TMD: <DateTimePicker />,
  EVT: <EventPicker />,
  PST: <DurationSelector />,
};

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent = "",
      selectedLocation = "",
      selectedDuration = 0,
      selectedTime,
      widgetKey,
      modes,
      selectedMode,
    },
    dispatch,
  } = useAppContext();

  const { retrieveEvents, retrieveLocations } = useApi();

  useEffect(() => {
    retrieveLocations();
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
      {modes && modes.length > 0 && (
        <Box>
          <ModePicker />
          {Components[selectedMode as Mode]}
        </Box>
      )}
      <div>
        {(selectedEvent || selectedTime || selectedDuration) && (
          <Button
            href={constructBuyLink({
              duration: selectedDuration,
              selectedLocation,
              selectedEvent,
              widgetKey,
              mode: selectedMode,
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
