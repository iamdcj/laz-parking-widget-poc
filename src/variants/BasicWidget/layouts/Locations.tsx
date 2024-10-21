import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../../context";
import DateTimePicker from "../../../components/DateTimePicker";
import EventPicker from "../../../components/EventPicker";
import LocationPicker from "../../../components/LocationPicker";
import DurationSelector from "../../../components/DurationSelector";
import useApi from "../../../hooks/useApi";
import { Actions } from "../../../state";
import { Modes } from "../../../../types";
import ModePicker from "../../../components/ModePicker";
import LazMap from "../../../components/Map";
import SeasonTickets from "../../../components/SeasonTickets";
import PurchaseButton from "../../../components/PurchaseButton";

const Components = {
  TMD: <DateTimePicker />,
  EVT: <EventPicker />,
  PST: <DurationSelector />,
  FEP: <SeasonTickets IsFEP />,
  FEX: <SeasonTickets IsFEP />,
  FAP: <SeasonTickets IsFAP />,
  MUP: <SeasonTickets IsMUP />,
};

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedLocation,
      modes,
      modesOverride,
      selectedMode,
      useMap,
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

  console.log(modes);
  
  return (
    <Box>
      {locations?.length > 0 && (
        <>
          <LocationPicker />
          {useMap && <LazMap />}
        </>
      )}
      <Box>
        {modes && modes.length === 1 ? (
          Components[modes[0] as Modes]
        ) : (
          <>
            <ModePicker />
            {Components[selectedMode as Modes]}
          </>
        )}
      </Box>
      <PurchaseButton />
    </Box>
  );
};

export default LocationsLayout;
