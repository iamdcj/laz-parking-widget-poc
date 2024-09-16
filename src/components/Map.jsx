import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../variants/utils/maps";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

const LazMap = ({
  markers = [],
  eventId,
  focused,
  setFocused,
  setSelected,
}) => {
  const [center, recenter] = useMapSetup(markers);
  const [zoomLevel, setZoomLevel] = useState(10);

  useEffect(() => {
    if (!eventId) {
      setSelected(null);
    }
  }, [eventId]);

  return (
    <>
      <Map
        mapId="basic-map"
        style={{ width: "100%", height: "60vh", marginBottom: 10 }}
        defaultCenter={
          center ? center.getCenter() : { lat: 41.850033, lng: -87.6500523 }
        }
        gestureHandling={"greedy"}
        clickableIcons={false}
        disableDefaultUI={true}
        onZoomChanged={({ detail }) => {
          setZoomLevel(detail.zoom);
        }}
        zoom={zoomLevel}
      >
        <Box
          sx={{
            position: "absolute",
            padding: 1,
            top: 0,
            right: 0,
            zIndex: 1,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            height: `calc(100% - 14px)`,
            justifyContent: "end",
          }}
        >
          {markers?.length > 1 && (
            <Button
              variant="contained"
              aria-label="delete"
              onClick={recenter}
              sx={{
                color: "#fff",
                minWidth: "auto",
                width: 30,
                height: 30,
                mb: 0.75,
                padding: 0,
              }}
            >
              <MyLocationIcon sx={{ fontSize: 14 }} />
            </Button>
          )}
          <Box
            sx={{ display: 'flex', flexDirection: "column"}}
          >
            <Button
              variant="contained"
              onClick={() => setZoomLevel(zoomLevel + 1)}
              sx={{ minWidth: "auto", width: 30, height: 30, padding: 0, mb: 0.1 }}
            >
              +
            </Button>
            <Button
              variant="contained"
              onClick={() => setZoomLevel(zoomLevel - 1)}
              sx={{ minWidth: "auto", width: 30, height: 30, padding: 0 }}
            >
              -
            </Button>
          </Box>
        </Box>
        {markers?.length > 1 &&
          markers.map(({ ID, Latitude, Longitude }) => (
            <AdvancedMarker
              onClick={() => setSelected(ID)}
              key={ID}
              position={{ lat: Latitude, lng: Longitude }}
              style={{
                pointerEvents: "all",
              }}
            >
              <div
                onMouseOver={() => setFocused(ID)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  transition: "transform ease-in  200ms",
                  transform: ID === focused ? "scale(1.5)" : "scale(1)",
                  width: 30,
                  height: 30,
                  padding: 5,
                  borderRadius: 5,
                  pointerEvents: "all",
                  background:
                    ID === focused ? "#007dba" : "rgba(0, 125, 186, 0.65)",
                }}
              >
                <img
                  onMouseOver={() => setFocused(ID)}
                  src="https://go.lazparking.com/static/media/laz-logo.a4d328f3134864d713456684b16773d9.svg"
                  alt=""
                  style={{ width: "100%" }}
                />
              </div>
            </AdvancedMarker>
          ))}
      </Map>
    </>
  );
};

export default LazMap;
