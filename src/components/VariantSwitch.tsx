import React, { Suspense } from "react";
import { useAppContext } from "../context";
import Loader from "./Loader";

const Variants = {
  basic: React.lazy(() => import("../variants/BasicWidget")),
  map: React.lazy(() => import("../variants/MapWidget")),
};

const VariantSwitch = () => {
  const {
    state: { variant },
  } = useAppContext();
  const Component = Variants[variant as "basic" | "map"];

  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  );
};

export default VariantSwitch;
