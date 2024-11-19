import React from "react";
import { useAppContext } from "../context";

const Variants = {
  basic: React.lazy(() => import("../variants/BasicWidget")),
  map: React.lazy(() => import("../variants/MapWidget")),
};

const VariantSwitch = () => {
  const {
    state: { variant },
  } = useAppContext();
  const Component = Variants[variant as "basic" | "map"];

  return <Component />;
};

export default VariantSwitch;
