import React, { useEffect } from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loader from "../../components/Loader";
import useApi from "../../hooks/useApi";

const BasicWidget = () => {
  const theme = useTheme();
  const { retrieveLanguages } = useApi();
  const {
    state: { eventDriven, isHeaderEnabled, isInitializing },
  } = useAppContext();

  useEffect(() => {
    retrieveLanguages();
  }, []);

  if(isInitializing) {
    return null
  }

  return (
    <Box id="WidgetFaceDiv" position="relative" width="100%">
      <Loader />
      {isHeaderEnabled && <Header />}
      <Box
        position="relative"
        p={2}
        pt={3}
        border={`1px solid ${theme.palette.accent.light}`}
        borderRadius="0 0 4px 4px"
        zIndex={1}
      >
        {eventDriven ? <EventsLayout /> : <LocationsLayout />}
      </Box>
    </Box>
  );
};

export default BasicWidget;
