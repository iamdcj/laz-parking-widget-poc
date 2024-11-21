import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { memo, SyntheticEvent, useEffect, useState } from "react";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import useApi from "../../hooks/useApi";
import { CalendarMonth, ExpandMore } from "@mui/icons-material";
import ModeHeader from "./components/ModeHeader";

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
      <Box>
        <ModeHeader mode="EVT" title={labels.EVENTTITLE} />
        <Autocomplete
          sx={{
            mb: marginBottom,
            position: "relative",
            pb: !showDateTime && selectedEvent?.id ? 5 : 0,
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
                  <Box width={50} textAlign="center">
                    <Typography
                      sx={{ backgroundColor: "#07254A" }}
                      borderRadius="4px 4px 0 0"
                      color="#fff"
                      fontSize={10}
                    >
                      {option.displayDate.year}
                    </Typography>
                    <Box border="1px solid #07254A" borderRadius="0 0 4px 4px">
                      <Typography fontSize={12} mb={0} lineHeight={1}>
                        {option.displayDate.month}
                      </Typography>
                      <Typography fontSize={16} fontWeight={600}>
                        {option.displayDate.day}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography display="block" fontSize={14} lineHeight={1}>
                    {option.label}
                  </Typography>
                  <Typography fontSize={12}>
                    {option.displayDate.hour}:{option.displayDate.minute}
                    {option.displayDate.dayPeriod}
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

              const date = new Date(EventDate);
              const formatter = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "numeric",
                minute: "numeric",
              });

              const eventDate = formatter.format();
              const [month, day, year, hour, minute, dayPeriod] = formatter
                .formatToParts(date)
                .filter(({ type }) => type !== "literal");

              return {
                id,
                label: label,
                displayDate: {
                  month: month.value,
                  day: day.value,
                  year: year.value,
                  hour: hour.value,
                  minute: minute.value,
                  dayPeriod: dayPeriod.value,
                },
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
                    ml: 0.5,
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
      </Box>
    );
  }
);

export default EventPicker;
