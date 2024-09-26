import { Autocomplete, TextField } from "@mui/material";
import React, { memo, SyntheticEvent, useEffect, useState } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { updateParams } from "../variants/utils/location";
import useApi from "../hooks/useApi";
import ErrorNotice from "./ErrorNotice";

const EventPicker = memo(() => {
  const { retrieveEvents } = useApi();
  const {
    state: { events, hideEventDateTime, selectedLocation, selectedEvent },
    dispatch,
  } = useAppContext();

  const [value, setValue] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (!selectedLocation) return;

    retrieveEvents(selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    setOptions(
      events.map(
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
      )
    );
  }, [events]);

  useEffect(() => {
    if (!options || options.length < 1) {
      return;
    }

    setValue(
      options.find((op: any) => {
        debugger;
        return op.id === selectedEvent;
      })
    );
  }, [selectedEvent, options]);

  const handleOnEventChange = (
    event: SyntheticEvent<Element, Event>,
    data: Record<string, any>
  ) => {
    if (data?.id) {
      dispatch({ type: Actions.SELECTED_EVENT, payload: data.id });
      updateParams("event", data?.id, true);
    } else {
      dispatch({ type: Actions.SELECTED_EVENT, payload: null });
      updateParams(null, null, true);
    }
  };

  if (!options || options.length < 1) {
    return null;
  }

  return (
    <Autocomplete
      size="small"
      disablePortal
      onChange={handleOnEventChange}
      value={value}
      sx={{ mb: 2 }}
      isOptionEqualToValue={(option, value) => {
        return option.id === value;
      }}
      options={options}
      renderInput={(params) => <TextField {...params} label="Select Event" />}
    />
  );
});

export default EventPicker;
