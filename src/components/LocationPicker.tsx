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
    <FormControl fullWidth sx={{ mb: 1 }}>
      <InputLabel id="location">Location</InputLabel>
      <Select
        labelId="location"
        id="location"
        value={selectedLocation || ""}
        onChange={handleOnLocationChange}
        fullWidth
        label="Age"
      >
        {locations.map(({ ID, Name }: { ID: string; Name: string }) => (
          <MenuItem
            key={ID}
            value={ID}
            onMouseOver={() =>
              dispatch({ type: Actions.FOCUSED_LOCATION, payload: ID })
            }
          >
            {Name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LocationPicker;
