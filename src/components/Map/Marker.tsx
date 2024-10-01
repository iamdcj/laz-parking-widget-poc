import React from "react";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import {} from "../../variants/utils/maps";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import Icons from "../Icons";
import { useTheme } from "@mui/material/styles";
import { Box, Button, Link, Typography } from "@mui/material";
import MarkerInfoWindow from "./InfoWindow";

const MapMarker = ({
  id,
  lat,
  lng,
  label,
  address,
  city,
  state,
  zipCode,
}: {
  id: string;
  lat: number;
  lng: number;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const {
    state: { focusedLocation, selectedLocation },
    dispatch,
  } = useAppContext();

  const theme = useTheme();
  const isActive = id === focusedLocation || id === selectedLocation;

  return (
    <>
      <AdvancedMarker
        onClick={() =>
          dispatch({ type: Actions.SELECTED_LOCATION, payload: id })
        }
        position={{ lat, lng }}
        style={{
          pointerEvents: "all",
        }}
        ref={markerRef}
      >
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
          sx={{
            display: "flex",
            alignItems: "center",
            transition: "all ease-in  200ms",
            transform: isActive ? "scale(1.35)" : "scale(1)",
            transformOrigin: "center center",
            pointerEvents: "all",
            opacity: isActive ? 1 : 0.8,
            willChange: "transform",
          }}
        >
          <svg width={42} height={62} viewBox="0 0 41.65 61.41">
            <path
              fill={theme.palette.primary.dark}
              d="M20.69 61.41 36.77 34.2A20.82 20.82 0 1 0 0 20.82a20.63 20.63 0 0 0 1.51 7.76h-.18l.75 1.27a19.94 19.94 0 0 0 1.79 3Z"
            />
          </svg>
          <Icons
            type="logo"
            width={25}
            style={{
              position: "absolute",
              top: 15,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </Box>
      </AdvancedMarker>
      <MarkerInfoWindow
        anchor={marker}
        id={id}
        label={label}
        address={address}
        city={city}
        state={state}
        zipCode={zipCode}
      />
    </>
  );
};

export default MapMarker;
