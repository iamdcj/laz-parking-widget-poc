import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateTimePicker,
  DateTimePickerSlotProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { Box, Typography } from "@mui/material";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
import { useAppContext } from "../context";
import { Actions } from "../state";

const StartEndSelector = ({
  hideEnd = false,
  startLabel,
  endLabel,
}: {
  hideEnd?: boolean;
  startLabel?: string;
  endLabel?: string;
}) => {
  const [endStart, setEndStart] = useState(false);
  const {
    state: {
      times: { start, end },
      labels,
      selectedMode,
    },
    dispatch,
  } = useAppContext();
  const isDisabled = selectedMode !== "TMD";

  const slotProps = {
    textField: { size: "small" },
    openPickerButton: {
      color: "primary",
    },
  } as DateTimePickerSlotProps<any, any>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width="100%">
        <DateTimePicker
          slotProps={slotProps}
          label={startLabel || labels.ARRIVE}
          views={["year", "day", "hours", "minutes"]}
          disablePast
          skipDisabled
          formatDensity="dense"
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          value={start}
          disabled={isDisabled}
          viewRenderers={{
            hours: renderDigitalClockTimeView,
            minutes: null,
            seconds: null,
          }}
          onChange={(date) =>
            dispatch({ type: Actions.SET_START_TIME, payload: date })
          }
          onClose={() => {
            start && setEndStart(true);
          }}
          sx={{ width: "100%" }}
        />
        {!hideEnd && (
          <DateTimePicker
            slotProps={slotProps}
            disablePast
            label={endLabel || labels.DEPART}
            views={["year", "day", "hours", "minutes"]}
            timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
            minDateTime={start?.add(30, "minutes") || null}
            skipDisabled
            value={end}
            open={endStart}
            disabled={isDisabled || !start}
            onClose={() => {
              setEndStart(false);
            }}
            onOpen={() => setEndStart(true)}
            viewRenderers={{
              hours: renderDigitalClockTimeView,
              minutes: null,
              seconds: null,
            }}
            onChange={(date) => {
              dispatch({ type: Actions.SET_END_TIME, payload: date });
            }}
            sx={{ width: "100%", mt: 1 }}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default StartEndSelector;
