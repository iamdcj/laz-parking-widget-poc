import React from "react";
import { useAppContext } from "../context";
import MapWidget from "../variants/MapWidget";
import BasicWidget from "../variants/BasicWidget";
import { Box } from "@mui/material";

const Variants = {
  basic: BasicWidget,
  map: MapWidget,
};

const VariantSwitch = () => {
  const {
    state: { variant = "basic" },
  } = useAppContext();
  const Component = Variants[variant as "basic" | "map"];

  return (
    <Box padding={1}>
      <Component />
    </Box>
  );
};

export default VariantSwitch;
