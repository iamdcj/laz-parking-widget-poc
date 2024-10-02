import React, { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import MapSidebarHeader from "./SidebarHeader";
import PayButtons from "../PayButtons";

const MapSidebar = ({
  setView,
  view,
}: {
  setView?: (view: string) => void;
  view?: string;
}) => {
  const locationsRef = useRef(null);
  const {
    state: { locations, focusedLocation, selectedLocation },
    dispatch,
  } = useAppContext();

  const getMap = () => {
    if (!locationsRef.current) {
      locationsRef.current = new Map();
    }

    return locationsRef.current;
  };

  const scrollToLocation = (location: any) => {
    const map = getMap();
    const node = map.get(location);

    if (!node) return;

    node.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };

  useEffect(() => {
    if (!selectedLocation) return;

    scrollToLocation(selectedLocation);
  }, [selectedLocation]);

  return (
    <Paper component="aside" sx={{ height: "75vh", overflow: "auto" }}>
      {locations?.length > 0 && (
        <>
          <MapSidebarHeader
            setView={setView}
            view={view}
            count={locations.length}
          />
          {locations.map(
            ({
              label,
              id,
              imageUrl,
              address,
              city,
              state,
              zipCode,
            }: {
              id: string;
              label: string;
              imageUrl: string;
              address: string;
              city: string;
              state: string;
              zipCode: string;
            }) => {
              const isActive =
                id === focusedLocation || id === selectedLocation;
              const image = imageUrl
                ? `https://xpark.lazparking.com/${imageUrl}`
                : "https://go.lazparking.com/static/media/default_bg.9175f9eefa59a42c0776.png";

              return (
                <Card
                  key={id}
                  sx={{
                    border: "1px solid lightgrey",
                    mb: 2,
                    backgroundColor: isActive && "primary.light",
                  }}
                  onMouseEnter={() =>
                    dispatch({ type: Actions.FOCUSED_LOCATION, payload: id })
                  }
                  ref={(node) => {
                    const map = getMap();

                    if (node) {
                      map.set(id, node);
                    } else {
                      map.delete(id);
                    }
                  }}
                >
                  <CardContent
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "120px 3fr",
                      rowGap: 2,
                      justifyContent: "space-between",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={image}
                      width={120}
                      height={120}
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
                      <Typography
                        sx={{ color: "text.secondary", fontSize: 14, mb: 2 }}
                      >
                        {address}
                        <br />
                        {city}, {state}, {zipCode}
                      </Typography>
                      <PayButtons id={id} />
                    </Box>
                  </CardContent>
                </Card>
              );
            }
          )}
        </>
      )}
    </Paper>
  );
};

export default MapSidebar;
