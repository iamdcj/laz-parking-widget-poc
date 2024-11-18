import React, { memo } from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { Box } from "@mui/material";
import RatePin from "./Pins/Rate";
import PlacePin from "./Pins/Place";
import LocationPin from "./Pins/Location";

const MapMarkerPin = memo(
  ({
    id,
    isPlace,
    isActive,
    rate,
  }: {
    id: string;
    isActive: boolean;
    isPlace: boolean;
    rate?: string;
  }) => {
    const { dispatch } = useAppContext();

    return (
      <Box
        onMouseOver={() =>
          dispatch({ type: Actions.FOCUSED_LOCATION, payload: id })
        }
        onMouseLeave={() =>
          dispatch({
            type: Actions.FOCUSED_LOCATION,
            payload: null,
          })
        }
      >
        {rate && <RatePin isActive={isActive} rate={rate} />}
        {isPlace ? <PlacePin /> : <LocationPin isActive={isActive} />}
      </Box>
    );
  }
);

export default MapMarkerPin;
