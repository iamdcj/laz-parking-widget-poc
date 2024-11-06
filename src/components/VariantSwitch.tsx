import React, { memo } from "react";
import { useAppContext } from "../context";
import { Box } from "@mui/material";
import { APIProvider } from "@vis.gl/react-google-maps";

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
    <APIProvider apiKey="AIzaSyDXK45jkgLDFMq5Lr33HGrK2a8qITI3Lqc">
      <Component />
    </APIProvider>
  );
};

export default VariantSwitch;
