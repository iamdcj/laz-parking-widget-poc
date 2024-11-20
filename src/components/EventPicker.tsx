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

    return (
      <Autocomplete
        sx={{
          mb: marginBottom,
          position: "relative",
          pb: !showDateTime && selectedEvent?.id ?  5 : 0,
        }}
        size="small"
        popupIcon={<ExpandMore />}
        fullWidth
        disableClearable
        onOpen={() => setShowDateTime(false)}
        onClose={() => selectedEvent?.id && setShowDateTime(true)}
        onChange={handleOnEventChange}
        disabled={!isEnabled || events.length <= 1}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box>
                <Typography display="block" fontSize={14}>
                  {option.label}
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
              label: label,
              date: eventDate,
            };
          }
        )}
        renderInput={(params) => (
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
                  ml: .5,
                  color: "#586171",
                }}
                position="absolute"
                left={10}
                bottom={10}
              >
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
