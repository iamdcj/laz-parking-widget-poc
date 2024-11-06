import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import LazMap from "../../components/Map";
import { Box } from "@mui/material";
import MapSidebar from "../../components/Map/Sidebar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MapSidebarHeader from "../../components/Map/Sidebar/SidebarHeader";

const MapWidget = () => {
  const {
    state: { locations },
  } = useAppContext();
  const [view, setView] = useState("list");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box height="100%" boxSizing="border-box">
      {isMobile ? (
        <>
          {view === "map" ? (
            <>
              <MapSidebarHeader
                setView={setView}
                view={view}
                count={locations.length}
              />
              <LazMap height="100%" />
            </>
          ) : (
            <MapSidebar setView={setView} view={view} />
          )}
        </>
      ) : (
        <>
          <MapSidebar />
          <LazMap height="100%" />
        </>
      )}
    </Box>
  );
};

export default MapWidget;
