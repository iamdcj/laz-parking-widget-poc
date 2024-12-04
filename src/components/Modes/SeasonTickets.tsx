import React, { useEffect } from "react";
import useApi from "../../hooks/useApi";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import StartEndSelector from "./DateTimePicker";
import { ModesTable } from "../../../types";

const SeasonTickets = () => {
  const {
    state: {
      selectedPass,
      selectedMode,
      selectedLocation,
      seasonTickets,
      labels,
    },
    dispatch,
  } = useAppContext();
  const isFAP = selectedMode === ModesTable.FAP;
  const { retrieveSeasonTickets } = useApi();
  const isEnabled = ["MUP", "FAP", "FEX", "FEP"].includes(selectedMode);
  const withData = seasonTickets && seasonTickets.length > 0;

  useEffect(() => {
    if (!isEnabled || !selectedLocation) {
      return;
    }

    retrieveSeasonTickets();
  }, [selectedMode, selectedLocation]);

  enum Labels {
    FEP = labels.CHOOSEFIXEDEXPIRY || labels.CHOOSEFIXEDEXPIRYTICKET,
    FAP = labels.CHOOSEFIXEDACCESS || labels.CHOOSEFIXEDACCESSTICKET,
  }

  const showTimePicker = isFAP && selectedPass && !selectedPass.FixedStartTime;

  return withData ? (
    <>
      <FormControl fullWidth size="small">
        <InputLabel id="season-passes-label">
          {Labels[selectedMode] || labels.CHOOSEPASSTYPE}
        </InputLabel>
        <Select
          labelId="season-passes"
          id="season-passes"
          fullWidth
          label={Labels[selectedMode] || labels.CHOOSEPASSTYPE}
          value={selectedPass?.RateId || ""}
          disabled={!withData || !isEnabled || seasonTickets.length === 1}
          onChange={(event) => {
            const pass = seasonTickets.find(
              ({ Id, RateId }: { RateId: string; Id: string }) =>
                Id || RateId === event.target.value
            );
            dispatch({ type: Actions.SET_PASS, payload: pass });
          }}
        >
          {withData &&
            seasonTickets.map(
              ({
                RateName,
                RateDetailName,
                Id,
                RateId,
                Duration,
                StartTime,
                EndTime,
              }: {
                RateName: string;
                RateDetailName: string;
                Id: string;
                RateId: string;
                Duration: string;
                StartTime: string;
                EndTime: string;
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
      {showTimePicker && (
        <Box sx={{ mt: 3 }}>
          <StartEndSelector
            hideEnd
            startLabel={labels.ARRIVALDATE}
            endLabel={labels.DEPARTUREDATE}
          />
        </Box>
      )}
    </>
  ) : null;
};

export default SeasonTickets;
