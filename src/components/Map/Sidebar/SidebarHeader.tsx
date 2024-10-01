import React from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";

const MapSidebarHeader = ({
  setView,
  view,
  count,
}: {
  setView?: (view: string) => void;
  view?: string;
  count: number;
}) => {
  return (
    <Box
      padding={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography fontSize={16}>{count} Locations available</Typography>
      {setView && (
        <ToggleButtonGroup value={view} size="small">
          <ToggleButton
            value="list"
            size="small"
            onClick={() => setView("list")}
          >
            <FormatListBulletedIcon />
          </ToggleButton>
          <ToggleButton value="map" size="small" onClick={() => setView("map")}>
            <MapIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      )}
    </Box>
  );
};

export default MapSidebarHeader;
