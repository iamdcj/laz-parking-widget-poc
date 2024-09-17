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
  const [results, setResults] = useState(null);
  const { state, dispatch } = useAppContext();
  const Component = Variants[state.variant];
  

  const fetchResults = useCallback(async () => {
    dispatch({ type: 'loading', payload: true})
    const { locationId, ...otherParams } = state;
    
    const params = new URLSearchParams({
      eDataLocationId: locationId.split(","),
      ...otherParams,
    });

    try {
      const res = await fetch(
        `https://grs-external.lazparking.com/api/events?${params}`
      );
      const data = await res.json();

      setResults(data);
      dispatch({ type: 'loading', payload: false})
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
    }
  }, [state]);

  useEffect(() => {
    if (results) return;

    fetchResults();
  }, [fetchResults, results]);

  return results && <Component results={results} />;
};

export default VariantSwitch;
