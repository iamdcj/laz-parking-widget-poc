import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";
import ErrorNotice from "./ErrorNotice";
import StartEndSelector from "./DateTimePicker";

const SeasonTickets = ({
  IsFEP = false,
  IsFAP = false,
  IsMPS = false,
  IsMUP = false,
}: {
  IsFEP?: boolean;
  IsFAP?: boolean;
  IsMPS?: boolean;
  IsMUP?: boolean;
}) => {
  const {
    state: { rate, selectedMode, isLoading, seasonTickets },
    dispatch,
  } = useAppContext();
  const { retrieveSeasonTickets } = useApi();

  useEffect(() => {
    retrieveSeasonTickets({ IsFEP, IsFAP, IsMPS, IsMUP });
  }, [selectedMode]);

  if (isLoading || !seasonTickets) {
    return null;
  }

  if (!isLoading && seasonTickets && seasonTickets.length < 1) {
    return <ErrorNotice error="Unable to retrieve time increments" />;
  }

  return (
    <>
      <FormControl fullWidth sx={{ mb: 3 }} size="small">
        <InputLabel id="location">Select Option</InputLabel>
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
            ({
              Id,
              RateName,
              RateDetailName,
              RateId,
            }: {
              Id: string;
              RateName: string;
              RateDetailName: string;
              RateId: string;
            }) => (
              <MenuItem key={Id || RateId} value={Id || RateId}>
                {RateName || RateDetailName}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      {IsFAP && <StartEndSelector hideEnd />}
    </>
  );
};

export default SeasonTickets;
