import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";

const DateTimePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <DatePicker label="Start Date" />
        <TimePicker label="Start Time" />
      </Box>
      <Box>
        <DatePicker label="End Date" />
        <TimePicker label="End Time" />
      </Box>
    </LocalizationProvider>
  );
};

export default DateTimePicker;
