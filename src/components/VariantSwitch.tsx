import React, { memo } from "react";
import { useAppContext } from "../context";
import MapWidget from "../variants/MapWidget";
import BasicWidget from "../variants/BasicWidget";
import { Box } from "@mui/material";
import { APIProvider } from "@vis.gl/react-google-maps";

const Variants = {
  basic: BasicWidget,
  map: MapWidget,
};

const VariantSwitch = () => {
  const {
    state: { variant },
  } = useAppContext();
  const Component = Variants[variant as "basic" | "map"];

  return (
    <Box padding={1}>
      <APIProvider apiKey="AIzaSyDXK45jkgLDFMq5Lr33HGrK2a8qITI3Lqc">
        <Component />
      </APIProvider>
    </Box>
  );
};

export default VariantSwitch;
