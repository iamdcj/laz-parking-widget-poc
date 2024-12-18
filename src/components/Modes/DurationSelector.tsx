import React, { useEffect, useMemo } from "react";
import useApi from "../../hooks/useApi";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import ModeHeader from "./components/ModeHeader";

const DurationSelector = () => {
  const {
    state: {
      timeIncrements,
      selectedDuration,
      selectedLocation,
      labels,
      selectedMode,
    },
    dispatch,
  } = useAppContext();
  const isDisabled = selectedMode !== "PST";
  const { retrieveTimeIncrements } = useApi();

  useEffect(() => {
    retrieveTimeIncrements();
  }, [selectedLocation]);

  const withData = timeIncrements && timeIncrements.length > 0;

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="duration-label">{labels.CHOOSEPRESET}</InputLabel>
      <Select
        disabled={isDisabled || !withData}
        labelId="duration"
        id="duration"
        fullWidth
        label={labels.CHOOSEPRESET}
        value={selectedDuration || ""}
        onChange={(event) =>
          dispatch({
            type: Actions.SET_DURATION,
            payload: event.target.value,
          })
        }
      >
        {withData &&
          timeIncrements.map(
            ({ Duration, Display }: { Duration: string; Display: string }) => {
              const parkNow = Duration === "00M";

              return (
                <MenuItem key={Duration} value={Duration}>
                  {parkNow ? labels.PARKRIGHTNOW : Display}
                </MenuItem>
              );
            }
          )}
      </Select>
    </FormControl>
  );
};

export default DurationSelector;
