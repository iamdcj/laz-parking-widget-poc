import React, { useCallback, useEffect } from "react";
import { useAppContext } from "../context";
import LazMap from "../components/Map";

const MapWidget = () => {
  const { state, dispatch } = useAppContext();
  const { locationIds, events, ...otherParams } = state;

  const fetchResults = useCallback(async () => {
    dispatch({ type: "loading", payload: true });

    const params = new URLSearchParams({
      eDataLocationId: locationIds.split(","),
      ...otherParams,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: "loading", payload: false });
      dispatch({ type: "events", payload: data });
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
    }
  }, [otherParams, locationIds, events]);

  useEffect(() => {
    fetchResults();
  }, []);

  return <LazMap />;
};

export default MapWidget;
