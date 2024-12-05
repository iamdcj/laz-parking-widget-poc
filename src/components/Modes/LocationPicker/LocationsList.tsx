import { Box, MenuItem, MenuList } from "@mui/material";
import React, { useMemo } from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import LazMap from "../../Map";
import { useTheme } from "@mui/material/styles";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Dayjs } from "dayjs";

const LocationsList = () => {
  const theme = useTheme();
  const {
    state: { locations, selectedLocation, focusedLocation },
    dispatch,
  } = useAppContext();

  const filteredLocations = useMemo(
    () => locations.filter(({ isPlace }: { isPlace: boolean }) => !isPlace),
    [locations]
  );

  return (
    <Box width={288}>
      <APIProvider apiKey={process.env.REACT_APP_MAPS_API_KEY}>
        <LazMap height={184} />
      </APIProvider>
      <MenuList sx={{ maxHeight: 200, overflow: "auto" }}>
        {filteredLocations.map(
          ({ id, label, ...rest }: { id: string; label: string }) => {
            const isSelected = selectedLocation?.id === id;
            const isFocused = focusedLocation?.id === id;

            return (
              <MenuItem
                key={`locations-${id}`}
                sx={{
                  backgroundColor: isSelected
                    ? theme.palette.primary.main
                    : isFocused
                    ? theme.palette.primary.light
                    : "inherit",
                  color: isSelected || isFocused ? "#fff" : "inherit",
                  whiteSpace: "normal",
                  textAlign: "left ",
                  "&:hover": {
                    backgroundColor: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                    color: "#fff",
                  },
                }}
                onClick={() => {
                  dispatch({
                    type: Actions.SELECTED_LOCATION,
                    payload: { id, label, ...rest },
                  });
                }}
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
  );
};

export default LocationsList;
