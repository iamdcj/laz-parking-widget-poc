import React, { Suspense, useEffect } from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";
import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Loader from "../../components/Loader";
import useApi from "../../hooks/useApi";
import PurchaseButton from "../../components/PurchaseButton";
import Header from "../../components/Header";

const BasicWidget = () => {
  const theme = useTheme();
  const { retrieveLanguages } = useApi();
  const {
    state: { eventDriven, isInitializing },
  } = useAppContext();

  useEffect(() => {
    retrieveLanguages();
  }, []);

  if (isInitializing) {
    return null;
  }

  return (
    <Paper
      id="WidgetFaceDiv"
      elevation={2}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 300,
      }}
    >
      <Loader />
      <Header />
      <Box position="relative" p={1} pt={3} zIndex={1}>
        <Suspense fallback={<Loader />}>
          {eventDriven ? <EventsLayout /> : <LocationsLayout />}
        </Suspense>
        <PurchaseButton />
      </Box>
    </Paper>
  );
};

export default BasicWidget;
