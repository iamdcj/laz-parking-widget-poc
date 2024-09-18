import React, { useCallback, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../../../../context";
import { Actions } from "../../../../state";
import DateTimePicker from "../../../../components/DateTimePicker";
import EventPicker from "../../../../components/EventPicker";
import LocationPicker from "../../../../components/LocationPicker";
import DurationSelector from "../../../../components/DurationSelector";

type Mode = "TMD" | "EVT" | "PST" | "MUP" | "MPS" | "FAP" | "FEX" | "FEP";

type Component = Record<string, () => React.JSX.Element | null>

const Components: Component = {
  TMD: DateTimePicker,
  EVT: EventPicker,
  PST: DurationSelector,
  MUP: null,
  MPS: null,
  FAP: null,
  FEX: null,
  FEP: null,
};

const LocationsLayout = () => {
  const {
    state: {
      locations,
      selectedEvent = "",
      selectedLocation = "",
      locationIds,
      events,
      useMap,
      selectedTime,
      hideEventDateTime,
      clientId: ClientId = "",
      widgetKey: widgetkey = "",
      ...otherParams
    },
    dispatch,
  } = useAppContext();
  const [modes, setModes] = useState(null);

  const retrieveEvents = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });

    if (!locationIds) return;

    try {
      const params = new URLSearchParams({
        eDataLocationId: locationIds?.split(","),
        widgetkey,
        eventdriven: widgetkey ? "true" : "false",
      });

      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: Actions.SET_EVENTS, payload: data });
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [otherParams, locationIds, events]);

  const retrieveLocations = useCallback(async () => {
    const params = new URLSearchParams({
      ClientId,
      ArrayeDataLocationId: locationIds?.split(","),
      evid: selectedEvent,
      WidgetKey: widgetkey,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/locations?${params}`
      );
      const data = await res.json();

      dispatch({ type: Actions.SET_LOCATIONS, payload: data });
    } catch (error) {
      console.error(error.message);
      dispatch({ type: Actions.LOADING, payload: false });
    }
  }, [selectedEvent]);

  useEffect(() => {
    retrieveLocations();
  }, []);

  useEffect(() => {
    if (!selectedLocation) {
      dispatch({ type: Actions.SET_EVENTS, payload: null });
    } else {
      retrieveEvents();
      setModes(
        locations
          .find(({ ID }: { ID: any }) => ID === selectedLocation)
          .DefaultWidgetType.split("|")
      );
    }
  }, [selectedLocation]);

  return (
    <Box>
      {locations?.length > 0 && <LocationPicker />}
      {modes?.map((mode: Mode) => {
        const Thing = Components[mode];

        return <Thing />;
      })}
      <div>
        {selectedEvent ||
          (selectedTime && (
            <Button
              href={`https://go.lazparking.com/buynow?l=${selectedLocation}&evid=${selectedEvent}&t=e&wt=evt&isocode=EN&wk=${widgetkey}`}
              variant="outlined"
              fullWidth
              target="_blank"
              rel="noreferer"
            >
              Reserve
            </Button>
          ))}
      </div>
    </Box>
  );
};

export default LocationsLayout;
