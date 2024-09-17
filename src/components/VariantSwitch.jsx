import React, { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context";
import BasicWidget from "../variants/BasicWidget";
import MapWidget from "../variants/MapWidget";
import InlineWidget from "../variants/InlineWidget";

const Variants = {
  basic: BasicWidget,
  map: MapWidget,
  inline: InlineWidget,
};

const VariantSwitch = () => {
  const { state, dispatch } = useAppContext();
  const Component = Variants[state.variant];
  const { locationId, events, ...otherParams } = state;

  const fetchResults = useCallback(async () => {
    dispatch({ type: 'loading', payload: true})

    const params = new URLSearchParams({
      eDataLocationId: locationId.split(","),
      ...otherParams,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      dispatch({ type: 'loading', payload: false})
      dispatch({ type: 'events', payload: data})
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
    }
  }, [otherParams, locationId, events]);

  useEffect(() => {
    fetchResults();
  }, []);


  console.log(events);
  

  return events && <Component results={events} />;
};

export default VariantSwitch;
