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
import LazMap from "./Map";
import SeasonTickets from "./SeasonTickets";
import DateTimePicker from "./DateTimePicker";
import EventPicker from "./EventPicker";
import DurationSelector from "./DurationSelector";

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
    state: { modes, selectedMode = "" },
    dispatch,
  } = useAppContext();

  console.log(modes, selectedMode);

  return (
    <FormControl>
      <RadioGroup
        sx={{
          display: "flex",
          flexDirection: "row",
          rowGap: 1,
          mb: 3,
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
              <Box display="flex" width="100%">
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
                      px: 2,
                      display: "inline-block",
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    or
                  </Box>
                </Typography>
              )}
            </>
          ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ModePicker;
