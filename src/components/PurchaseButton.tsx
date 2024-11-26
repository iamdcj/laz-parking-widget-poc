import React from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink } from "../utils/urls";
import { ModesTable } from "../../types";

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

  const canPurchase = () => {
    switch (selectedMode) {
      case ModesTable.TMD:
        return selectedLocation && times.start && times.end;
      case ModesTable.EVT:
        return selectedEvent && selectedLocation;
      case ModesTable.PST:
        return selectedLocation && selectedDuration;
      case ModesTable.MUP:
      case ModesTable.FEP:
      case ModesTable.FAP:
      case ModesTable.FEX:
        return selectedLocation && rate;
      default:
        return false;
    }
  };

  return (
    <Button
      href={constructBuyLink({
        duration: selectedDuration,
        l: selectedLocation?.id,
        evid: selectedEvent?.id,
        wk: widgetKey,
        mode: modes && modes.length === 1 ? modes[0] : selectedMode,
        times,
        aid: agentId,
        sc: salesChannelKey,
        rid: rate,
      })}
      variant="contained"
      color="primary"
      target="_blank"
      rel="noreferer"
      fullWidth
      disabled={!canPurchase()}
    >
      {ButtonLabels[selectedMode] || labels.GETRATE}
    </Button>
  );
};

export default PurchaseButton;
