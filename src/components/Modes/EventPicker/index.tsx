import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { memo, SyntheticEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import useApi from "../../../hooks/useApi";
import { CalendarMonth, ExpandMore } from "@mui/icons-material";
import ModeHeader from "../components/ModeHeader";
import EventOption from "./EventOption";
import EventField from "./EventField";

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

      retrieveEvents(selectedLocation.id);
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

    return isEnabled ? (
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
          <EventOption props={props} option={option} />
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

            return {
              id,
              label: label,
              date,
            };
          }
        )}
        renderInput={(params) => (
          <EventField showDateTime={showDateTime} params={params} />
        )}
      />
    ) : null;
  }
);

export default EventPicker;
