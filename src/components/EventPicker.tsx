import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { memo, SyntheticEvent, useEffect, useState } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import useApi from "../hooks/useApi";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import EventIcon from "@mui/icons-material/Event";
import { ExpandMore } from "@mui/icons-material";

const EventPicker = memo(
  ({
    refetchEvents = true,
    marginBottom = 0,
  }: {
    refetchEvents?: boolean;
    marginBottom?: number;
  }) => {
    const { retrieveEvents } = useApi();
    const [showDateTime, setShowDateTime] = useState(false);
    const {
      state: {
        events,
        hideEventDateTime,
        selectedLocation,
        selectedEvent,
        isLoading,
        eventdriven,
        labels,
        selectedMode,
      },
      dispatch,
    } = useAppContext();
    const isEnabled = selectedMode === "EVT";

    useEffect(() => {
      if (!isEnabled || !refetchEvents || !selectedLocation) return;

      retrieveEvents(selectedLocation);
    }, [selectedLocation, isEnabled]);

    const handleOnEventChange = (
      event: SyntheticEvent<Element, Event>,
      data: Record<string, any>
    ) => {
      if (data?.id) {
        dispatch({ type: Actions.SELECTED_EVENT, payload: data });
      } else {
        dispatch({ type: Actions.SELECTED_EVENT, payload: null });
      }
    };

    useEffect(() => {
      setShowDateTime(selectedEvent?.id ? true : false);
    }, [selectedEvent?.id]);

    console.log(showDateTime);
    

    return (
      <Autocomplete
        sx={{
          mb: marginBottom,
          position: "relative",
        }}
        size="small"
        popupIcon={<ExpandMore />}
        disablePortal
        fullWidth
        disableClearable
        onOpen={() => setShowDateTime(false)}
        onClose={() => setShowDateTime(true)}
        onChange={handleOnEventChange}
        disabled={!isEnabled || events.length <= 1}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box display="flex" alignItems="center" gap={1}>
              {/* <EventIcon fontSize="large" /> */}
              <Box>
                <Typography display="block" fontSize={14}>
                  {option.label.split("-")[0]}
                </Typography>
                <Typography fontSize={12}>
                  {option.date && !hideEventDateTime && option.date}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
        options={events.map(
          ({
            EventId: id,
            EventName,
            EventDate,
          }: {
            EventId: string;
            EventName: string;
            EventDate: string;
          }) => {
            let label = EventName;
            let eventDate = null;

            const date = new Date(EventDate);
            const formatter = new Intl.DateTimeFormat("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            });

            eventDate = formatter.format(date);

            return {
              id,
              label: `${label} - ${eventDate}`,
              date: eventDate,
            };
          }
        )}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              sx={{
                "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
                  paddingBottom: showDateTime ? 5 : 1,
                },
              }}
              label={eventdriven ? labels.SHOWEVENT : labels.CHOOSEEVENT}
            />
            {showDateTime && (
              <Typography
                sx={{ display: "flex", alignItems: "center", mt: 1, ml: 1 }}
                position="absolute"
                left={10}
                bottom={10}
              >
                {/* <QueryBuilderIcon sx={{ mr: 1 }} fontSize="small" /> */}
                {selectedEvent?.date}
              </Typography>
            )}
          </>
        )}
      />
    );
  }
);

export default EventPicker;
