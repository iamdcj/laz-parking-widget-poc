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
import { APIProvider } from "@vis.gl/react-google-maps";
import LazMap from "../../../components/Map";

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
      selectedDuration,
      selectedTime,
      widgetKey,
      modes,
      times,
      selectedMode,
      dataMode,
      dataModeOverwrite,
      agentId,
      salesChannelKey,
      useMap,
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
      if (dataModeOverwrite && dataMode) {
        dispatch({
          type: Actions.SET_MODES,
          payload: [dataMode],
        });
        dispatch({
          type: Actions.SELECTED_MODE,
          payload: dataMode,
        });
      } else {
        dispatch({
          type: Actions.SET_MODES,
          payload: returnModes(locations, selectedLocation),
        });
      }

      retrieveEvents(selectedLocation);
    }
  }, [selectedLocation, retrieveLocations]);

  return (
    <Box>
      {locations?.length > 0 && (
        <>
          <LocationPicker />
          {useMap && (
            <APIProvider apiKey="">
              <LazMap />
            </APIProvider>
          )}
        </>
      )}
      <Box>
        {modes && modes.length === 1 ? (
          Components[selectedMode as Mode]
        ) : (
          <>
            <ModePicker />
            {Components[selectedMode as Mode]}
          </>
        )}
      </Box>
      <div>
        {(selectedEvent ||
          selectedTime ||
          selectedDuration ||
          (times?.start && times?.end)) && (
          <Button
            id="btnGetRate"
            href={constructBuyLink({
              duration: selectedDuration,
              selectedLocation,
              selectedEvent,
              widgetKey,
              mode: selectedMode,
              times,
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

export default LocationsLayout;
