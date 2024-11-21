import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  MenuList,
  Popover,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import LazMap from "./Map";
import { useTheme } from "@mui/material/styles";

const LocationPicker = ({ marginBottom = 1, isDisabled = false }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const {
    state: { locations, selectedLocation, labels, focusedLocation },
    dispatch,
  } = useAppContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClose();
  }, [selectedLocation?.id]);

  const filteredLocations = locations.filter(
    ({ isPlace }: { isPlace: boolean }) => !isPlace
  );

  const isOpen = Boolean(anchorEl);

  return (
    <FormControl fullWidth size="small" sx={{ mb: marginBottom }}>
      <InputLabel id="location-label">{labels.SELECTLOCATION}</InputLabel>
      <Select
        disabled={isDisabled}
        labelId="location-label"
        id="location"
        fullWidth
        onOpen={handleClick}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        label={labels.SELECTLOCATION}
        value={selectedLocation?.id || ""}
        renderValue={() => selectedLocation?.label}
        size="small"
        sx={{
          textAlign: "left",
        }}
      />
      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isOpen}
      >
        <Box width={288}>
          <Box
            sx={{
              padding: 1,
            }}
          >
            <LazMap height={184} />
          </Box>
          <MenuList sx={{ maxHeight: 200, overflow: "auto" }}>
            {filteredLocations.map(
              ({ id, label }: { id: string; label: string }) => {
                const isFocused = focusedLocation?.id === id;
                const isSelected = selectedLocation?.id === id;

                return (
                  <MenuItem
                    sx={{
                      backgroundColor: isSelected
                        ? theme.palette.primary.main
                        : "inherit",
                      color: isSelected ? "#fff" : "inherit",
                      whiteSpace: "normal",
                      textAlign: "left ",
                      "&:hover": {
                        backgroundColor: isSelected
                          ? theme.palette.primary.main
                          : theme.palette.primary.light,
                        color: "#fff",
                      },
                    }}
                    onClick={() =>
                      dispatch({
                        type: Actions.SELECTED_LOCATION,
                        payload: { id, label },
                      })
                    }
                    onMouseOver={() =>
                      dispatch({
                        type: Actions.FOCUSED_LOCATION,
                        payload: { id, label },
                      })
                    }
                    onMouseLeave={() =>
                      dispatch({
                        type: Actions.FOCUSED_LOCATION,
                        payload: null,
                      })
                    }
                  >
                    {label}
                  </MenuItem>
                );
              }
            )}
          </MenuList>
        </Box>
      </Popover>
    </FormControl>
  );
};

export default LocationPicker;
