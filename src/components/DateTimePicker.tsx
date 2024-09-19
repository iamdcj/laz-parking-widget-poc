import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { Box } from "@mui/material";
import dayjs from "dayjs";
import { renderDigitalClockTimeView } from "@mui/x-date-pickers";

const StartEndSelector = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DateTimePicker
          disablePast
          defaultValue={dayjs()}
          label="Start"
          views={["year", "day", "hours", "minutes"]}
          skipDisabled
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          viewRenderers={{
            hours: renderDigitalClockTimeView,
            minutes: null,
            seconds: null,
          }}
        />
        <DateTimePicker
          disablePast
          defaultValue={dayjs().add(2, 'hours')}
          label="End"
          views={["year", "day", "hours", "minutes"]}
          timeSteps={{ hours: 1, minutes: 30, seconds: 0 }}
          skipDisabled
          viewRenderers={{
            hours: renderDigitalClockTimeView,
            minutes: null,
            seconds: null,
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default StartEndSelector;
