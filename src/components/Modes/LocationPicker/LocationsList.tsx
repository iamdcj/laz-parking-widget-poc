import { Box, MenuItem, MenuList } from "@mui/material";
import React from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import LazMap from "../../Map";
import { useTheme } from "@mui/material/styles";
import { APIProvider } from "@vis.gl/react-google-maps";

const LocationsList = () => {
  const theme = useTheme();
  const {
    state: { locations, selectedLocation },
    dispatch,
  } = useAppContext();

  const filteredLocations = locations.filter(
    ({ isPlace }: { isPlace: boolean }) => !isPlace
  );

  return (
    <Box width={288}>
      <APIProvider apiKey="">
        <LazMap height={184} />
      </APIProvider>
      <MenuList sx={{ maxHeight: 200, overflow: "auto" }}>
        {filteredLocations.map(
          ({ id, label }: { id: string; label: string }) => {
            const isSelected = selectedLocation?.id === id;

            return (
              <MenuItem
                key={`locations-${id}`}
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
                onClick={() => {
                  dispatch({
                    type: Actions.SELECTED_LOCATION,
                    payload: { id, label },
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
