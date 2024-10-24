import React, { useEffect, useMemo } from "react";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";
import ErrorNotice from "./ErrorNotice";

const DurationSelector = () => {
  const {
    state: { timeIncrements, selectedDuration, selectedLocation, isLoading },
    dispatch,
  } = useAppContext();
  const { retrieveTimeIncrements } = useApi();

  useEffect(() => {
    retrieveTimeIncrements();
  }, [selectedLocation]);

  if (isLoading || !timeIncrements) {
    return null;
  }

  if (!isLoading && timeIncrements && timeIncrements.length < 1) {
    return <ErrorNotice error="Unable to retrieve time increments" />;
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="duration-label">Select Duration</InputLabel>
      <Select
        labelId="duration"
        id="duration"
        fullWidth
        label="Select Duration"
        value={selectedDuration || ""}
        onChange={(event) =>
          dispatch({ type: Actions.SET_DURATION, payload: event.target.value })
        }
      >
        {timeIncrements.map(
          ({ Duration, Display }: { Duration: string; Display: string }) => (
            <MenuItem key={Duration} value={Duration}>
              {Display}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default DurationSelector;
