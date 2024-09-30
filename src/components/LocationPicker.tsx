import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { updateParams } from "../variants/utils/location";

const LocationPicker = () => {
  const {
    state: { locations, selectedLocation },
    dispatch,
  } = useAppContext();

  const handleOnLocationChange = (event: SelectChangeEvent<any>) => {
    dispatch({
      type: Actions.SELECTED_LOCATION,
      payload: event?.target?.value,
    });
    dispatch({ type: Actions.FOCUSED_LOCATION, payload: event?.target?.value });
    updateParams("lot", event?.target?.value);
  };

  return (
    <FormControl fullWidth sx={{ mb: 1 }} size="small">
      <InputLabel id="location">Location</InputLabel>
      <Select
        labelId="location"
        id="location"
        value={selectedLocation || ""}
        onChange={handleOnLocationChange}
        fullWidth
        label="Age"
        disabled={locations.length === 1}
      >
        {locations.map(({ id, label }: { id: string; label: string }) => (
          <MenuItem
            key={id}
            value={id}
            onMouseOver={() =>
              dispatch({ type: Actions.FOCUSED_LOCATION, payload: id })
            }
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationPicker;
