import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../context";
import { Actions } from "../state";
import ErrorNotice from "./ErrorNotice";
import StartEndSelector from "./DateTimePicker";
import { Modes } from "../../types";
import { log } from "console";

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
    state: { rate, selectedMode, selectedLocation, seasonTickets, labels },
    dispatch,
  } = useAppContext();
  const { retrieveSeasonTickets } = useApi();
  const isEnabled = ["MUP", "FAP", "FEX", "FEP"].includes(selectedMode);
  const withData = seasonTickets && seasonTickets.length > 0;

  useEffect(() => {
    if (!isEnabled || !selectedLocation) {
      return;
    }

    retrieveSeasonTickets({ IsFEP, IsFAP, IsMPS, IsMUP });
  }, [selectedMode, selectedLocation]);

  enum Labels {
    FEP = labels.CHOOSEFIXEDEXPIRY || labels.CHOOSEFIXEDEXPIRYTICKET,
    FAP = labels.CHOOSEFIXEDACCESS || labels.CHOOSEFIXEDACCESSTICKET,
  }

  return (
    <Box width="100%">
      <FormControl fullWidth size="small">
        <InputLabel id="season-passes-label">
          {Labels[selectedMode] || labels.CHOOSEPASSTYPE}
        </InputLabel>
        <Select
          labelId="season-passes"
          id="season-passes"
          fullWidth
          label={Labels[selectedMode] || labels.CHOOSEPASSTYPE}
          value={rate || ""}
          disabled={!withData || !isEnabled || seasonTickets.length === 1}
          onChange={(event) =>
            dispatch({ type: Actions.SET_RATE, payload: event.target.value })
          }
        >
          {withData &&
            seasonTickets.map(
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
              }) => {
                const value = Id || RateId;
                
                return (
                  <MenuItem key={value} value={value}>
                    {RateName || RateDetailName}
                  </MenuItem>
                );
              }
            )}
        </Select>
      </FormControl>
      {IsFAP && (
        <Box sx={{ mt: 3 }}>
          <StartEndSelector
            hideEnd
            startLabel={labels.ARRIVALDATE}
            endLabel={labels.DEPARTUREDATE}
          />
        </Box>
      )}
    </Box>
  );
};

export default SeasonTickets;
