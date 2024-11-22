import { Box, FormControl, InputLabel, Select } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { useAppContext } from "../../../context";
import LocationsList from "./LocationsList";

const LocationPicker = memo(
  ({
    marginBottom = 1,
    isDisabled = false,
  }: {
    marginBottom?: any;
    isDisabled?: any;
  }) => {
    const {
      state: { selectedLocation, labels },
    } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
      setIsOpen(false)
    }, [selectedLocation?.id])

    return (
      <Box>
        <FormControl fullWidth size="small">
          <InputLabel id="location-label">{labels.SELECTLOCATION}</InputLabel>
          <Select
            labelId="location-label"
            id="location"
            fullWidth
            label={labels.SELECTLOCATION}
            value={selectedLocation?.id || ""}
            renderValue={() => selectedLocation?.label}
            size="small"
            onClick={() => setIsOpen(!isOpen)}
            open={isOpen}
            sx={{
              textAlign: "left",
            }}
          >
            <LocationsList />
          </Select>
        </FormControl>
      </Box>
    );
  }
);

export default LocationPicker;
