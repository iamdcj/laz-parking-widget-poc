import React, { memo, useMemo } from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { Box } from "@mui/material";
import RatePin from "./Pins/Rate";
import PlacePin from "./Pins/Place";
import LocationPin from "./Pins/Location";

const MapMarkerPin = memo(
  ({ id, isPlace, rate }: { id: string; isPlace: boolean; rate?: string }) => {
    const {
      state: { selectedLocation, focusedLocation },
      dispatch,
    } = useAppContext();

    const isActive = useMemo(() => {
      return id === selectedLocation?.id;
    }, [selectedLocation?.id]);

    const isFocused = useMemo(() => {
      return id === focusedLocation?.id;
    }, [focusedLocation?.id]);

    return (
      <Box
        onMouseOver={() =>
          dispatch({ type: Actions.FOCUSED_LOCATION, payload: { id } })
        }
        onMouseLeave={() =>
          dispatch({
            type: Actions.FOCUSED_LOCATION,
            payload: null,
          })
        }
      >
        {rate && <RatePin isActive={isActive} rate={rate} />}
        {isPlace ? (
          <PlacePin />
        ) : (
          <LocationPin isActive={isActive} isFocused={isFocused} />
        )}
      </Box>
    );
  }
);

export default MapMarkerPin;
