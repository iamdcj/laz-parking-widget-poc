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
      state: { selectedLocation, focusedLocation, variant },
      dispatch,
    } = useAppContext();

    const isActive = useMemo(() => {
      return id === selectedLocation?.id;
    }, [selectedLocation?.id]);

    const isFocused = useMemo(() => {
      return id === focusedLocation?.id;
    }, [focusedLocation?.id]);

    const size = variant === "map" ? 60 : 30;

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
          <PlacePin size={size} />
        ) : (
          <LocationPin size={size} isActive={isActive} isFocused={isFocused} />
        )}
      </Box>
    );
  }
);

export default MapMarkerPin;
