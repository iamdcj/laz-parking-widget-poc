import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Modes } from "../../types";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { useTheme } from "@mui/material/styles";
import SeasonTickets from "./SeasonTickets";
import DateTimePicker from "./DateTimePicker";
import EventPicker from "./EventPicker";
import DurationSelector from "./DurationSelector";
import { alpha } from "@mui/material/styles";
import { Label } from "@mui/icons-material";

export const Components = {
  TMD: <DateTimePicker />,
  EVT: <EventPicker />,
  PST: <DurationSelector />,
  FEP: <SeasonTickets IsFEP />,
  FEX: <SeasonTickets IsFEP />,
  FAP: <SeasonTickets IsFAP />,
  MUP: <SeasonTickets IsMUP />,
};

const ModePicker = () => {
  const theme = useTheme();
  const {
    state: { modes, selectedMode = "", labels },
    dispatch,
  } = useAppContext();

  enum ModeTitles {
    TMD = labels.TIMEDTITLE,
    EVT = labels.EVENTTITLE,
    PST = labels.TIMEDTITLE,
    FEP = labels.PASSESTITLE,
    FEX = labels.PASSESTITLE,
    FAP = labels.PASSESTITLE,
    MUP = labels.PASSESTITLE,
  }

  return (
    <RadioGroup
      sx={{
        display: "grid",
        rowGap: 1,
        width: "100%",
      }}
      name="modes"
      value={selectedMode}
      onChange={(event, value) => {
        dispatch({
          type: Actions.SELECTED_MODE,
          payload: value,
        });
      }}
    >
      {modes &&
        modes.length > 0 &&
        modes.map((mode: Modes, index: number) => (
          <>
            <Box
              width="100%"
              p={1}
              borderRadius={2}
              sx={{
                backgroundColor:
                  mode === selectedMode
                    ? alpha(theme.palette.primary.main, 0.0619999)
                    : "none",
              }}
            >
              <Box
                width="100%"
                display="flex"
                mb={2}
                onClick={() => {
                  dispatch({
                    type: Actions.SELECTED_MODE,
                    payload: mode,
                  });
                }}
                sx={{ cursor: "pointer" }}
              >
                <Radio
                  key={mode}
                  id={mode}
                  value={mode}
                  sx={{
                    py: 0,
                    color: theme.palette.primary.main,
                    "&.Mui-checked": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <Typography fontWeight={600}>{ModeTitles[mode]}</Typography>
              </Box>

              {Components[mode as Modes]}
            </Box>

            {index + 1 !== modes.length && (
              <Typography
                display="block"
                textAlign="center"
                position="relative"
                sx={{
                  width: "100%",
                  "&:after": {
                    content: "''",
                    width: "100%",
                    height: "1px",
                    background: "#D7DAE0",
                    display: "block",
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    background: "#fff",
                    p: 2,
                    display: "inline-block",
                    zIndex: 2,
                    position: "relative",
                  }}
                >
                  {labels.OR}
                </Box>
              </Typography>
            )}
          </>
        ))}
    </RadioGroup>
  );
};

export default ModePicker;
