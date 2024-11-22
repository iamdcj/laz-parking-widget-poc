import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context";
import LazMap from "../../components/Map";
import { Box } from "@mui/material";
import MapSidebar from "../../components/Map/Sidebar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MapSidebarHeader from "../../components/Map/Sidebar/SidebarHeader";
import Loader from "../../components/Loader";
import { APIProvider } from "@vis.gl/react-google-maps";
import useApi from "../../hooks/useApi";

const MapWidget = () => {
  const { retrieveLocations } = useApi();
  const {
    state: { locations },
  } = useAppContext();

  useEffect(() => {
    retrieveLocations();
  }, []);

  const [view, setView] = useState("list");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <APIProvider apiKey="">
      <Box height="100%" width="100%" position="relative">
        <Loader />
        {isMobile ? (
          <>
            {view === "map" ? (
              <>
                <MapSidebarHeader
                  setView={setView}
                  view={view}
                  count={locations.length}
                />
                <LazMap height="100%" width="100%" />
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
    </APIProvider>
  );
};

export default MapWidget;
