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
import LazMap from "./Map";

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
    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
      <InputLabel id="location-label">Location</InputLabel>
      <Select
        labelId="location"
        id="location"
        value={selectedLocation || ""}
        onChange={handleOnLocationChange}
        fullWidth
        label="Location"
        disabled={locations.length === 1}
      >
        <LazMap />
        {locations.map(({ id, label }: { id: string; label: string }) => (
          <MenuItem
            key={`${id}-${label}`}
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
