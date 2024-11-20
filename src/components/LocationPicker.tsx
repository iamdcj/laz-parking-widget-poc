import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../context";
import { Actions } from "../state";
import LazMap from "./Map";

const LocationPicker = ({ marginBottom = 1 }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const {
    state: { locations, selectedLocation, labels, useMap },
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
      <Box>
        <Box
          component="button"
          onClick={handleClick}
          sx={{
            width: "100%",
            padding: 0,
            background: "none",
            outline: "none",
            border: "none",
          }}
        >
          <Select
            id="location"
            fullWidth
            label={labels.SELECTLOCATION}
            value={selectedLocation?.id || ""}
            renderValue={() => selectedLocation?.label}
            size="small"
            sx={{
              pointerEvents: "none",
              textAlign: "left"
            }}
          />
        </Box>
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
            <Box component="ul" sx={{ maxHeight: 200, overflow: "auto" }}>
              {filteredLocations.map(
                ({ id, label }: { id: string; label: string }) => (
                  <li>
                    <Button
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
                    >
                      {label}
                    </Button>
                  </li>
                )
              )}
            </Box>
          </Box>
        </Popover>
      </Box>
    </FormControl>
  );
};

export default LocationPicker;
