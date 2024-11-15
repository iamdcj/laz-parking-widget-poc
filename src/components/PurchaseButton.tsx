import React from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink } from "../utils/urls";

const PurchaseButton = () => {
  const {
    state: {
      selectedEvent,
      selectedLocation,
      selectedDuration,
      widgetKey,
      modes,
      times,
      agentId,
      salesChannelKey,
      rate,
      canPurchase = false,
      labels,
      selectedMode,
    },
  } = useAppContext();

  // the commented out options reflect how the current widget code
  // deal with the button labels - feels wrong to me
  enum ButtonLabels {
    "EVT" = labels.CONTINUE,
    // "PST" = labels.GETRATE,
    // "MUP" = labels.PURCHASEPASS,
    // "FAP" = labels.PURCHASEPASS,
    // "FEX" = labels.PURCHASEPASS,
    // "FEP" = labels.PURCHASEPASS,
  }

  return (
    <Box py={1} display="flex" justifyContent="center">
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
        variant="contained"
        color="secondary"
        target="_blank"
        rel="noreferer"
        disabled={!canPurchase}
      >
        {ButtonLabels[selectedMode] || labels.GETRATE}
      </Button>
    </Box>
  );
};

export default PurchaseButton;
