import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useMapSetup } from "../utils/maps";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { updateParams } from "../utils/location";

const LazMap = ({ markers = [], eventId }) => {
  const [center, recenter] = useMapSetup(markers);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <>
      {/* <button onClick={recenter}>Center</button> */}
      <Map
        mapId="basic-map"
        style={{ width: "100%", height: "300px", marginBottom: 10 }}
        defaultCenter={
          center ? center.getCenter() : { lat: 41.850033, lng: -87.6500523 }
        }
        gestureHandling={"greedy"}
        defaultZoom={5}
        disableDefaultUI={true}
        clickableIcons={false}
      >
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
                  width: 20,
                  height: 20,
                  padding: 5,
                  borderRadius: 5,
                  pointerEvents: 'all',
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
      {markers?.length > 1 && (
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={selected ? selected : ''}
            onChange={(event, data) => {
              setSelected(data?.props?.value);
              setFocused(data?.props?.value);
              updateParams("lot", data?.props?.value)
            }}
            fullWidth
            label="Age"
          >
            {markers.map(({ ID, Name }) => (
              <MenuItem  key={ID} value={ID} onMouseOver={() => setFocused(ID)}>
                <em>{Name}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <div>
        <Button
          href={`https://go.lazparking.com/buynow?l=${selected}&evid=${eventId}&t=e&wt=evt&isocode=EN&wk=4d7e669231e54990b6c1bbe70dd59758&start=2024-09-12T20%3A10%3A47.172Z&end=2024-09-12T22%3A10%3A47.172Z`}
          variant="outlined"
          fullWidth
          disabled={!selected}
          target="_blank"
          rel="noreferer"
        >
          Reserve
        </Button>
      </div>
    </>
  );
};

export default LazMap;
