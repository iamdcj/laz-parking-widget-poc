import React from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";

const BasicWidget = () => {
  const {
    state: { eventDriven },
  } = useAppContext();

  return eventDriven ? <EventsLayout /> : <LocationsLayout />;
};

export default BasicWidget;
