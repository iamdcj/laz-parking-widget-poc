import {
  AutocompleteRenderInputParams,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useAppContext } from "../../../context";

const EventField = ({
  showDateTime,
  params,
}: {
  showDateTime: boolean;
  params: AutocompleteRenderInputParams;
}) => {
  const {
    state: { selectedEvent, eventdriven, labels },
  } = useAppContext();

  const eventDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
  }).format(selectedEvent?.date);

  return (
    <>
      <TextField
        {...params}
        sx={{
          "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input":
            {
              fontWeight: selectedEvent ? 600 : 400,
            },
          "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
            paddingBottom: showDateTime ? 5 : 1,
          },
        }}
        label={eventdriven ? labels.SHOWEVENT : labels.CHOOSEEVENT}
      />
      {showDateTime && (
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 0.5,
            color: "#586171",
          }}
          position="absolute"
          left={10}
          bottom={10}
        >
          {eventDate}
        </Typography>
      )}
    </>
  );
};

export default EventField;
