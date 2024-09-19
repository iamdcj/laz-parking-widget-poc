import React from "react";
import { useAppContext } from "../../context";
import EventsLayout from "./layouts/Events";
import LocationsLayout from "./layouts/Locations";

const BasicWidget = () => {
  const {
    state: { widgetKey },
  } = useAppContext();

  return widgetKey ? <EventsLayout /> : <LocationsLayout />;
};

export default BasicWidget;
