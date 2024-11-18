import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../../context";
import LocationPicker from "../../../components/LocationPicker";
import useApi from "../../../hooks/useApi";
import { Actions } from "../../../state";
import { Modes } from "../../../../types";
import PurchaseButton from "../../../components/PurchaseButton";
import ModePicker, { Components } from "../../../components/ModePicker";

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedLocation,
      modes,
      modesOverride,
      selectedMode,
    },
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

  return (
    <Box>
      {locations?.length > 0 && <LocationPicker />}
      {modes && modes.length === 1 ? (
        <Box>{Components[modes[0] as Modes]}</Box>
      ) : (
        selectedLocation && (

            <ModePicker />
        )
      )}
      <Box py={1} display="flex" justifyContent="center">
        <PurchaseButton />
      </Box>
    </Box>
  );
};

export default LocationsLayout;
