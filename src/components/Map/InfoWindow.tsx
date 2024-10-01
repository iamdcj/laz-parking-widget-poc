import React from "react";
import { InfoWindow } from "@vis.gl/react-google-maps";
import {} from "../../variants/utils/maps";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import { Button, Link, Typography } from "@mui/material";

const MarkerInfoWindow = ({
  anchor,
  id,
  label,
  address,
  city,
  state,
  zipCode,
}: {
  anchor: any;
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}) => {
  const {
    state: { selectedLocation },
    dispatch,
  } = useAppContext();

  const isActive = id === selectedLocation;

  if (!isActive) {
    return null;
  }

  return (
    <InfoWindow
      anchor={anchor}
      onClose={() =>
        dispatch({
          type: Actions.SELECTED_LOCATION,
          payload: null,
        })
      }
    >
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
        {label}
        {address}
        {city}
        {state}
        {zipCode}
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        component={Link}
        href={`https://go.lazparking.com/subnow?l=${id}`}
        target="_blank"
      >
        Buy Now
      </Button>
    </InfoWindow>
  );
};

export default MarkerInfoWindow;
