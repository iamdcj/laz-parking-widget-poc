import React from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loader from "../../components/Loader";

const BasicWidget = () => {
  const theme = useTheme();
  const {
    state: { eventDriven, isHeaderEnabled, headerText },
  } = useAppContext();

  return (
    <Box id="WidgetFaceDiv" position="relative">
      <Loader />
      {isHeaderEnabled && <Header headerText={headerText} />}
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
