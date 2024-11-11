import React from "react";
import { Box, Button } from "@mui/material";
import { useAppContext } from "../context";
import { constructBuyLink } from "../utils/urls";
import { useTheme } from "@mui/material/styles";

const PurchaseButton = () => {
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
      buttonText,
    },
  } = useAppContext();
  const theme = useTheme();

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
        target="_blank"
        rel="noreferer"
        disabled={!canPurchase}
        sx={{
          backgroundColor: theme.palette.custom.mainButtonBackground
        }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

export default PurchaseButton;
