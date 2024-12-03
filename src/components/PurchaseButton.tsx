import React, { useCallback, useMemo } from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink, openWindow } from "../utils/urls";
import { ModesTable } from "../../types";
import { retrieveTimeDiff } from "../utils/time";

const PurchaseButton = () => {
  const {
    state: {
      agentId,
      currentPage,
      labels,
      salesChannelKey,
      selectedDuration,
      selectedEvent,
      selectedLocation,
      selectedMode,
      selectedPass,
      times,
      timezone,
      useFullWidget,
      widgetKey,
    },
  } = useAppContext();

  enum ButtonLabels {
    "EVT" = labels.CONTINUE,
    "PST" = labels.GETRATE,
    "MUP" = labels.PURCHASEPASS,
    "FAP" = labels.PURCHASEPASS,
    "FEX" = labels.PURCHASEPASS,
    "FEP" = labels.PURCHASEPASS,
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
      timeDiff: retrieveTimeDiff(selectedLocation.currentDate),
      timezone,
    });

    if (!useFullWidget) {
      openWindow(url, currentPage);
    } else {
      location.href = url;
    }
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
