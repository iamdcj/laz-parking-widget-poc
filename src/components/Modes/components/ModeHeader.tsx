import { Box, Radio, Typography } from "@mui/material";
import React from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { useTheme } from "@mui/material/styles";
import { Modes } from "../../../../types";

const ModeHeader = ({ mode }: { mode: string }) => {
  const theme = useTheme();
  const {
    state: { modes, labels },
    dispatch,
  } = useAppContext();

  enum LabelsFromMode {
    "TMD" = labels.TIMEDTITLE,
    "EVT" = labels.EVENTTITLE,
    "PST" = labels.PRESETTITLE,
    "MUP" = labels.PASSESTITLE,
    "FAP" = labels.PASSESTITLE,
    "FEX" = labels.PASSESTITLE,
    "FEP" = labels.PASSESTITLE,
  }
  
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      mb={1.5}
      onClick={() => {
        dispatch({
          type: Actions.SELECTED_MODE,
          payload: mode,
        });
      }}
      sx={{ cursor: "pointer" }}
    >
      {modes && modes.length > 1 && (
        <Radio
          id="widget-mode"
          value={mode}
          sx={{
            mr: 1,
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.primary.main,
            },
          }}
        />
      )}
      <Typography fontWeight={600} lineHeight={1}>
        {LabelsFromMode[mode as Modes]}
      </Typography>
    </Box>
  );
};

export default ModeHeader;
