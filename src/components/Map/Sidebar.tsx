import React, { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
} from "@mui/material";
import { useAppContext } from "../../context";
import { Actions } from "../../state";

const MapSidebar = () => {
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
    <Box component="aside" sx={{ height: "100vh", overflow: "auto" }}>
      {locations?.length > 0 &&
        locations.map(
          ({
            label,
            id,
            imageUrl,
          }: {
            id: string;
            label: string;
            imageUrl: string;
          }) => {
            const isActive = id === focusedLocation || id === selectedLocation;

            console.log(imageUrl);

            return (
              <Card
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
                    gridTemplateColumns: "1fr 3fr",
                    rowGap: 2,
                    justifyContent: "space-between",
                  }}
                >
                  {imageUrl && (
                    <CardMedia
                      component="img"
                      image={`https://xpark.lazparking.com/${imageUrl}`}
                      width={100}
                      height={100}
                      sx={{
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  )}
                  <Box textAlign="right">
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                      {label}
                    </Typography>
                    <Button
                      variant="outlined"
                      component={Link}
                      href={`https://go.lazparking.com/subnow?l=${id}`}
                      target="_blank"
                    >
                      Buy Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          }
        )}
    </Box>
  );
};

export default MapSidebar;
