import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import LazMap from "./Map";

const LocationPicker = () => {
  const {
    state: { locations, selectedLocation, labels, useMap },
    dispatch,
  } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleOnLocationChange = (event: SelectChangeEvent<any>) => {
    dispatch({
      type: Actions.SELECTED_LOCATION,
      payload: event?.target?.value,
    });

    dispatch({ type: Actions.FOCUSED_LOCATION, payload: event?.target?.value });
  };

  useEffect(() => {
    setIsOpen(false);
  }, [selectedLocation]);


  const filteredLocations = locations.filter(({ isPlace }: { isPlace: boolean}) => !isPlace);

  return (
    <FormControl fullWidth size="small" sx={{ mb: 3 }}>
      <InputLabel id="location-label">{labels.SELECTLOCATION}</InputLabel>
      <Select
        labelId="location-label"
        id="location"
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        value={selectedLocation || ""}
        onChange={handleOnLocationChange}
        fullWidth
        open={isOpen}
        label={labels.SELECTLOCATION}
        disabled={locations.length === 1 && !useMap}
      >
        <Box
          sx={{
            padding: 1,
          }}
        >
          <LazMap height={184} />
        </Box>
        {filteredLocations.map(({ id, label }: { id: string; label: string }) => (
          <MenuItem
            key={`${id}-${label}`}
            value={id}
            sx={{
              mx: 1,
            }}
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
