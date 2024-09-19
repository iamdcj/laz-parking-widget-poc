import React from "react";
import { useAppContext } from "../context";
import MapWidget from "../variants/MapWidget";
import BasicWidget from "../variants/BasicWidget";

const Variants = {
  basic: BasicWidget,
  map: MapWidget,
};

const VariantSwitch = () => {
  const { state: { variant = 'basic'} } = useAppContext();
  const Component = Variants[variant as 'basic' | 'map'];
 
  return <Component />;
};

export default VariantSwitch;
