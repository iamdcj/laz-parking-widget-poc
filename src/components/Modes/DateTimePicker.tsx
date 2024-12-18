import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  DateTimePicker,
  DateTimePickerSlotProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { Box, Typography } from "@mui/material";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  returnDate,
  TimeZoneCodes,
  TimezoneCodeToString,
} from "../../utils/time";

dayjs.extend(utc);
dayjs.extend(timezone);

const StartEndSelector = ({
  showStartTime = true,
  hideEndDate = false,
  startLabel,
  endLabel,
}: {
  showStartTime?: boolean;
  hideEndDate?: boolean;
  startLabel?: string;
  endLabel?: string;
}) => {
  const [endStart, setEndStart] = useState(false);
  const {
    state: {
      times: { start, end },
      selectedLocation,
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

  const timeZone = selectedLocation.timeZone;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box width="100%" display="grid" gridTemplateColumns="1fr">
        <DateTimePicker
          timezone={timeZone}
          slotProps={slotProps}
          label={startLabel || labels.ARRIVE}
          views={["year", "day", "hours", "minutes"]}
          disablePast
          skipDisabled
          formatDensity="dense"
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          value={start}
          viewRenderers={{
            hours: showStartTime ? renderDigitalClockTimeView : null,
            minutes: null,
            seconds: null,
          }}
          format={showStartTime ?  "MM/DD/YYYY hh:mm a" : "MM/DD/YYYY"}
          onChange={(date) => {
            dispatch({
              type: Actions.SET_START_TIME,
              payload: returnDate(date, timeZone),
            });
          }}
          onClose={() => {
            start && setEndStart(true);
          }}
          sx={{ width: "100%", mb: 0.5 }}
        />
        {!hideEndDate && (
          <DateTimePicker
            slotProps={slotProps}
            timezone={timeZone}
            disablePast
            label={endLabel || labels.DEPART}
            views={["year", "day", "hours", "minutes"]}
            timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
            minDateTime={start?.add(30, "minutes") || null}
            skipDisabled
            value={end}
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
              dispatch({
                type: Actions.SET_END_TIME,
                payload: returnDate(date, timeZone),
              });
            }}
            sx={{ width: "100%", mt: 0.5 }}
          />
        )}
        <Typography sx={{ fontSize: 10 }}>
          * {TimezoneCodeToString[timeZone as TimeZoneCodes]}
        </Typography>
      </Box>
    </LocalizationProvider>
  );
};

export default StartEndSelector;
