import React from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";
import Header from "../../components/Header";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const BasicWidget = () => {
  const theme = useTheme();
  const {
    state: { eventDriven, isHeaderEnabled, headerText },
  } = useAppContext();

  return (
    <Box width={400} height={300} id="WidgetFaceDiv">
      {isHeaderEnabled && <Header headerText={headerText} />}
      <Box
        position="relative"
        p={2}
        pt={3}
        border={`1px solid ${theme.palette.accent.light}`}
        borderRadius="0 0 4px 4px"
      >
        {eventDriven ? <EventsLayout /> : <LocationsLayout />}
      </Box>
    </Box>
  );
};

export default BasicWidget;
