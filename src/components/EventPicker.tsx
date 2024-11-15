import { Autocomplete, TextField } from "@mui/material";
import React, { memo, SyntheticEvent, useEffect } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import useApi from "../hooks/useApi";
import ErrorNotice from "./ErrorNotice";

const EventPicker = memo(
  ({ refetchEvents = true }: { refetchEvents?: boolean }) => {
    const { retrieveEvents } = useApi();
    const {
      state: {
        events,
        hideEventDateTime,
        selectedLocation,
        selectedEvent,
        isLoading,
        eventdriven,
        labels
      },
      dispatch,
    } = useAppContext();

    useEffect(() => {
      if (!refetchEvents || !selectedLocation) return;

      retrieveEvents(selectedLocation);
    }, [selectedLocation]);

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

    if (isLoading || !events) {
      return null;
    }

    if (!isLoading && events && events.length < 1) {
      return <ErrorNotice error="Unable to events data" />;
    }
    
    return (
      <Autocomplete
        size="small"
        disablePortal
        onChange={handleOnEventChange}
        disabled={events.length === 1}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.label}
          </li>
        )}
        value={selectedEvent}
        sx={{ mb: 2 }}
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

            if (!hideEventDateTime) {
              const date = new Date(EventDate);
              const formatter = new Intl.DateTimeFormat("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              });

              label = `${EventName} - ${formatter.format(date)}`;
            }

            return {
              id,
              label,
            };
          }
        )}
        renderInput={(params) => <TextField {...params} label={eventdriven ? labels.SHOWEVENT : labels.CHOOSEEVENT} />}
      />
    );
  }
);

export default EventPicker;
