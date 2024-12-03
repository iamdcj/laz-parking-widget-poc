import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateTimePicker,
  DateTimePickerSlotProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { Box } from "@mui/material";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { returnDate } from "../../utils/time";

dayjs.extend(utc);
dayjs.extend(timezone);

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
      timezone,
      labels,
    },
    dispatch,
  } = useAppContext();

  const slotProps = {
    textField: { size: "small" },
    openPickerButton: {
      color: "primary",
    },
  } as DateTimePickerSlotProps<any, any>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width="100%" display="grid" gridTemplateColumns="1fr">
        <DateTimePicker
          timezone={timezone}
          slotProps={slotProps}
          label={startLabel || labels.ARRIVE}
          views={["year", "day", "hours", "minutes"]}
          disablePast
          skipDisabled
          formatDensity="dense"
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          value={returnDate(start, timezone)}
          viewRenderers={{
            hours: renderDigitalClockTimeView,
            minutes: null,
            seconds: null,
          }}
          onChange={(date, other) => {
            dispatch({
              type: Actions.SET_START_TIME,
              payload: returnDate(date, timezone),
            });
          }}
          onClose={() => {
            start && setEndStart(true);
          }}
          sx={{ width: "100%", mb: 0.5 }}
        />
        {!hideEnd && (
          <DateTimePicker
            slotProps={slotProps}
            timezone={timezone}
            disablePast
            label={endLabel || labels.DEPART}
            views={["year", "day", "hours", "minutes"]}
            timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
            minDateTime={start?.add(30, "minutes") || null}
            skipDisabled
            value={returnDate(end, timezone)}
            open={endStart}
            disabled={!start}
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
              dispatch({ type: Actions.SET_END_TIME, payload: returnDate(date, timezone) });
            }}
            sx={{ width: "100%", mt: 0.5 }}
          />
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default StartEndSelector;
