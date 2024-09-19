import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";

const DurationSelector = () => {
  const {
    state: { timeIncrements, selectedDuration },
    dispatch,
  } = useAppContext();
  const { retrieveTimeIncrements } = useApi();

  useEffect(() => {
    retrieveTimeIncrements();
  }, []);

  if (!timeIncrements) {
    return null;
  }
  
  return (
    <FormControl fullWidth sx={{ mb: 1 }}>
      <InputLabel id="location">Select Duration</InputLabel>

      <Select
        labelId="location"
        id="location"
        fullWidth
        label="Age"
        value={selectedDuration}
        onChange={(event) =>
          dispatch({ type: Actions.SET_DURATION, payload: event.target.value.replace('M', '') })
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
