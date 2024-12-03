import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../../context";
import LocationPicker from "../../../components/Modes/LocationPicker";
import useApi from "../../../hooks/useApi";
import { Actions } from "../../../state";
import { Modes } from "../../../../types";
import ModePicker, { Components } from "../../../components/Modes/ModePicker";

const LocationsLayout = () => {
  const {
    state: { locations, selectedLocation, modes, modesOverride },
    dispatch,
  } = useAppContext();

  const { retrieveLocations } = useApi();

  useEffect(() => {
    retrieveLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      dispatch({ type: Actions.RESET_EVENTS });
    } else {
      if (modesOverride) {
        dispatch({
          type: Actions.SET_MODES,
          payload: modesOverride,
        });
      } 
    }
  }, [selectedLocation, retrieveLocations]);

  const Component = Components[modes?.[0] as Modes];

  return (
    <Box display="grid" rowGap={2} mb={2}>
      {locations?.length > 0 && <LocationPicker />}
      {modes && modes.length === 1 ? (
        <Component />
      ) : (
        selectedLocation && <ModePicker />
      )}
    </Box>
  );
};

export default LocationsLayout;
