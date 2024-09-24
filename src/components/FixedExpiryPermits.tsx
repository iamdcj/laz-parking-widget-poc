import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";
import ErrorNotice from "./ErrorNotice";

const FixedExpiryPermits = () => {
  const {
    state: { rate, selectedLocation, isLoading, seasonTickets },
    dispatch,
  } = useAppContext();
  const { retrieveSeasonTickets } = useApi();

  useEffect(() => {
    retrieveSeasonTickets({ IsFEP: true });
  }, [selectedLocation]);

  if (isLoading || !seasonTickets) {
    return null;
  }

  if (!isLoading && seasonTickets && seasonTickets.length < 1) {
    return <ErrorNotice error="Unable to retrieve time increments" />;
  }

  return (
    <FormControl fullWidth sx={{ mb: 3 }} size="small">
      <InputLabel id="location">Select Rate</InputLabel>
      <Select
        labelId="location"
        id="location"
        fullWidth
        label="Age"
        value={rate}
        onChange={(event) =>
          dispatch({ type: Actions.SET_RATE, payload: event.target.value })
        }
      >
        {seasonTickets.map(
          ({ Id, RateName }: { Id: string; RateName: string }) => (
            <MenuItem key={Id} value={Id}>
              {RateName}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};

export default FixedExpiryPermits;
