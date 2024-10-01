import React from "react";
import { InfoWindow } from "@vis.gl/react-google-maps";
import {} from "../../variants/utils/maps";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";

const MarkerInfoWindow = ({
  anchor,
  id,
  label,
  address,
  city,
  state,
  zipCode,
  imageUrl,
}: {
  imageUrl: string;
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
  const image = imageUrl
    ? `https://xpark.lazparking.com/${imageUrl}`
    : "https://go.lazparking.com/static/media/default_bg.9175f9eefa59a42c0776.png";

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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "80px 3fr",
          gap: 2,
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <CardMedia
          component="img"
          image={image}
          width={80}
          height={80}
          sx={{
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
        <Box
          textAlign="right"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="end"
        >
          <Typography variant="h6">{label}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}>
            {address}
            <br />
            {city}, {state}, {zipCode}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="outlined"
        fullWidth
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
