import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Box } from "@mui/material";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
import { useAppContext } from "../context";
import { Actions } from "../state";

const StartEndSelector = ({ hideEnd = false }) => {
  const {
    state: {
      times: { start, end },
    },
    dispatch,
  } = useAppContext();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="grid" gridTemplateColumns="1fr" gap={2} mb={3}>
        <DateTimePicker
          slotProps={{ textField: { size: "small" } }}
          disablePast
          label="Arrive After"
          views={["year", "day", "hours", "minutes"]}
          skipDisabled
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          value={start}
          viewRenderers={{
            hours: renderDigitalClockTimeView,
            minutes: null,
            seconds: null,
          }}
          onChange={(date) =>
            dispatch({ type: Actions.SET_START_TIME, payload: date })
          }
        />
        {!hideEnd && (
          <DateTimePicker
            slotProps={{ textField: { size: "small" } }}
            disablePast
            label="Exit Before"
            views={["year", "day", "hours", "minutes"]}
            timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
            minDateTime={start?.add(30, "minutes") || null}
            skipDisabled
            value={end}
            disabled={!start}
            viewRenderers={{
              hours: renderDigitalClockTimeView,
              minutes: null,
              seconds: null,
            }}
            onChange={(date) => {
              dispatch({ type: Actions.SET_END_TIME, payload: date });
            }}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default StartEndSelector;
