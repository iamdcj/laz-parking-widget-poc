import React, { useEffect, useMemo } from "react";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";
import ErrorNotice from "./ErrorNotice";

const DurationSelector = () => {
  const {
    state: {
      timeIncrements,
      selectedDuration,
      selectedLocation,
      isLoading,
      labels,
    },
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

  console.log(timeIncrements);

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="duration-label">{labels.CHOOSEPRESET}</InputLabel>
      <Select
        labelId="duration"
        id="duration"
        fullWidth
        label={labels.CHOOSEPRESET}
        value={selectedDuration || ""}
        onChange={(event) =>
          dispatch({ type: Actions.SET_DURATION, payload: event.target.value })
        }
      >
        {timeIncrements.map(
          ({ Duration, Display }: { Duration: string; Display: string }) => (
            <MenuItem key={Duration} value={Duration}>
              {Duration === "00M" ? labels.PARKRIGHTNOW : Display}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default DurationSelector;
