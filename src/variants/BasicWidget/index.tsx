import React, { Suspense } from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";
import { Box, Paper } from "@mui/material";
import Loader from "../../components/Loader";
import PurchaseButton from "../../components/PurchaseButton";
import Header from "../../components/Header";

const BasicWidget = () => {
  const {
    state: { eventDriven, isInitializing },
  } = useAppContext();

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
