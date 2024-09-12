import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context";

const Variants = {
  basic: lazy(() => import("../variants/BasicWidget")),
  map: lazy(() => import("../variants/MapWidget")),
  inline: lazy(() => import("../variants/InlineWidget")),
};

const VariantSwitch = () => {
  const [results, setResults] = useState(null);
  const { variant, ...initialParams } = useAppContext();
  const Component = Variants[variant];

  const fetchResults = useCallback(async () => {
    const { locationId, ...otherParams } = initialParams;

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
    } catch (error) {
      console.error("Unable to retrieve parking locations.");
    }
  }, [initialParams]);

  useEffect(() => {
    if (results) return;

    fetchResults();
  }, [fetchResults, results]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {results && <Component results={results} />}
    </Suspense>
  );
};

export default VariantSwitch;
