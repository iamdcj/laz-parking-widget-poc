import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { useGetCenter } from "../utils/maps";
import { useState } from "react";

const LazMap = ({ markers = [], eventId }) => {
  const center = useGetCenter(markers);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Map
        mapId="basic-map"
        style={{ width: "100%", height: "80vh" }}
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
              onMouseOver={() => setFocused(ID)}
              key={ID}
              position={{ lat: Latitude, lng: Longitude }}
              style={{
                pointerEvents: "all",
                background: "#007dba",
                padding: "5px",
                borderRadius: 5,
              }}
            >
              <img
                onMouseOver={() => setFocused(ID)}
                src="https://go.lazparking.com/static/media/laz-logo.a4d328f3134864d713456684b16773d9.svg"
                width={ID === focused ? 64 : 32}
                height={ID === focused ? 64 : 32}
                alt=""
              />
            </AdvancedMarker>
          ))}
      </Map>

      {markers?.length > 1 &&
        markers.map(({ ID, Name }) => (
          <button
            key={ID}
            onClick={() => setSelected(ID)}
            onMouseOver={() => setFocused(ID)}
            style={{
              color: ID === focused ? "#fff" : "#007dba",
              background: ID === focused ? "#007dba" : "white",
            }}
          >
            {Name}
          </button>
        ))}
      {selected && (
        <a
          href={`https://go.lazparking.com/buynow?l=${selected}&evid=${eventId}&t=e&wt=evt&isocode=EN&wk=4d7e669231e54990b6c1bbe70dd59758&start=2024-09-12T20%3A10%3A47.172Z&end=2024-09-12T22%3A10%3A47.172Z`}
          target="_blank"
          rel="noreferrer"
        >
          Purchase Parking
        </a>
      )}
    </>
  );
};

export default LazMap;