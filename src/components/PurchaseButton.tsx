import React from "react";
import { Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink } from "../utils/urls";

const PurchaseButton = ({
    label = "Get Rates"
}) => {
  const {
    state: {
      selectedEvent,
      selectedLocation,
      selectedDuration,
      widgetKey,
      modes,
      times,
      selectedMode,
      agentId,
      salesChannelKey,
      rate,
      canPurchase = false
    },
  } = useAppContext();

  if(!canPurchase) {
    return null
  }

  return (
    <Button
      id="btnGetRate"
      href={constructBuyLink({
        duration: selectedDuration,
        l: selectedLocation,
        evid: selectedEvent,
        wk: widgetKey,
        mode: modes && modes.length === 1 ? modes[0] : selectedMode,
        times,
        aid: agentId,
        sc: salesChannelKey,
        rate,
      })}
      variant="outlined"
      fullWidth
      target="_blank"
      rel="noreferer"
    >
      {label}
    </Button>
  );
};

export default PurchaseButton;
