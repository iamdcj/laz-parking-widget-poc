import React from "react";
import {
  Box,
  Paper,
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
    <Paper
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid grey",
        borderRadius: "0 0 2px 2px",
        px: 2,
        height: 48,
      }}
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
    </Paper>
  );
};

export default MapSidebarHeader;
