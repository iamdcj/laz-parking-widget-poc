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
    <Box>
      <ModeHeader mode="PST" title={labels.PRESETTITLE} />
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
              ({
                Duration,
                Display,
              }: {
                Duration: string;
                Display: string;
              }) => (
                <MenuItem key={Duration} value={Duration}>
                  {Duration === "00M" ? labels.PARKRIGHTNOW : Display}
                </MenuItem>
              )
            )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DurationSelector;
