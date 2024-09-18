import React, { useCallback, useEffect } from "react";
import { useAppContext } from "../context";
import LazMap from "../components/Map";
import { Actions } from "../state";

const MapWidget = () => {
  const { state, dispatch } = useAppContext();
  const { locationIds, events, ...otherParams } = state;

  const fetchResults = useCallback(async () => {
    dispatch({ type: Actions.LOADING, payload: true });

    const params = new URLSearchParams({
      eDataLocationId: locationIds.split(","),
      ...otherParams,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: Actions.LOADING, payload: false });
      dispatch({ type: Actions.SET_EVENTS, payload: data });
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
