import React from "react";
import { Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink } from "../utils/urls";

const PurchaseButton = ({ label = "Get Rates" }) => {
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
      canPurchase = false,
    },
  } = useAppContext();

  return (
    <Button
      id="btnGetRate"
      href={constructBuyLink({
        duration: selectedDuration,
        l: selectedLocation,
        evid: selectedEvent?.id,
        wk: widgetKey,
        mode: modes && modes.length === 1 ? modes[0] : selectedMode,
        times,
        aid: agentId,
        sc: salesChannelKey,
        rid: rate,
      })}
      variant="outlined"
      fullWidth
      target="_blank"
      rel="noreferer"
      disabled={!canPurchase}
    >
      {label}
    </Button>
  );
};

export default PurchaseButton;
