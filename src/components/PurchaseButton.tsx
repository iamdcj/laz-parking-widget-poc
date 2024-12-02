import React, { useCallback } from "react";
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
      selectedPass,
      times,
      agentId,
      salesChannelKey,
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
        return selectedLocation && selectedPass;
      default:
        return false;
    }
  };

  const handleNavigation = useCallback(() => {
    const url = constructBuyLink({
      duration: selectedDuration,
      l: selectedLocation?.id,
      evid: selectedEvent?.id,
      mode: selectedMode,
      pass: selectedPass,
      times,
      wk: widgetKey,
      aid: agentId,
      sc: salesChannelKey,
    });

    location.assign(url);
  }, [
    selectedMode,
    selectedDuration,
    selectedLocation,
    selectedPass,
    selectedEvent,
    times,
  ]);

  return (
    <Button
      onClick={handleNavigation}
      variant="contained"
      color="primary"
      fullWidth
      disabled={!canPurchase()}
    >
      {ButtonLabels[selectedMode] || labels.GETRATE}
    </Button>
  );
};

export default PurchaseButton;
