import { FormControl, InputLabel, Select } from "@mui/material";
import React from "react";
import { useAppContext } from "../../../context";

const LocationsSelect = () => {
  const {
    state: { selectedLocation, labels },
  } = useAppContext();

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="location-label">{labels.SELECTLOCATION}</InputLabel>
      <Select
        labelId="location-label"
        id="location"
        fullWidth
        open={false}
        label={labels.SELECTLOCATION}
        value={selectedLocation?.id || ""}
        renderValue={() => selectedLocation?.label}
        size="small"
        sx={{
          textAlign: "left",
        }}
      />
    </FormControl>
  );
};

export default LocationsSelect;
