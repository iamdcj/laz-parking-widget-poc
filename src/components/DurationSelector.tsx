import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/material";

const DurationSelector = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker label="Start Time" />
    </LocalizationProvider>
  );
};

export default DurationSelector;
