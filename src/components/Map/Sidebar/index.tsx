import React, { useEffect, useMemo, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import MapSidebarHeader from "./SidebarHeader";
import PayButtons from "../PayButtons";
import { useTheme } from "@mui/material/styles";

const MapSidebar = ({
  setView,
  view,
}: {
  setView?: (view: string) => void;
  view?: string;
}) => {
  const locationsRef = useRef(null);
  const {
    state: { locations, focusedLocation, selectedLocation, isHeaderEnabled },
    dispatch,
  } = useAppContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

  const filteredLocations = useMemo(
    () => locations.filter(({ isPlace }: { isPlace: boolean }) => !isPlace),
    [locations]
  );

  return (
    <Paper
      component="aside"
      sx={{
        position: "absolute",
        left: 20,
        top: 20,
        width: 400,
        height: "calc(100% - 40px)",
        overflow: "hidden",
        zIndex: 2,
      }}
    >
      {filteredLocations?.length > 0 && (
        <>
          {isHeaderEnabled && (
            <MapSidebarHeader
              setView={setView}
              view={view}
              count={filteredLocations.length}
            />
          )}
          <Box
            sx={{
              height: isMobile ? "calc(100vh - 49px)" : "100%",
              overflow: "auto",
              px: 1,
              scrollbarWidth: "none",
              pb: 10,
            }}
          >
            {filteredLocations.map(
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
                const isActive = id === selectedLocation?.id;
                const isFocused = id === focusedLocation?.id;
                const image = imageUrl
                  ? `https://xpark.lazparking.com/${imageUrl}`
                  : "https://go.lazparking.com/static/media/default_bg.9175f9eefa59a42c0776.png";

                return (
                  <Card
                    key={id}
                    sx={{
                      border: "1px solid lightgrey",
                      my: 1.5,
                      backgroundColor:
                        (isActive && "primary.dark") ||
                        (isFocused && "primary.light"),
                    }}
                    onMouseEnter={() =>
                      dispatch({
                        type: Actions.FOCUSED_LOCATION,
                        payload: { id },
                      })
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
                        sx={{
                          color: isActive ? "#fff" : "text.secondary",
                        }}
                      >
                        <Typography variant="h6" sx={{ color: "inherit" }}>
                          {label}
                        </Typography>
                        {address && (
                          <Typography
                            sx={{
                              color: "inherit",
                              fontSize: 14,
                              mb: 2,
                            }}
                          >
                            {address}
                            <br />
                            {city}, {state}, {zipCode}
                          </Typography>
                        )}

                        <PayButtons id={id} />
                      </Box>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default MapSidebar;
