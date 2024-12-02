import React, { Fragment, useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Modes } from "../../../types";
import { useAppContext } from "../../context";
import { Actions } from "../../state";
import { useTheme } from "@mui/material/styles";
import ModeHeader from "./components/ModeHeader";
import { alpha } from "@mui/material/styles";

export const Components = {
  TMD: React.lazy(() => import("./DateTimePicker")),
  EVT: React.lazy(() => import("./EventPicker")),
  PST: React.lazy(() => import("./DurationSelector")),
  FEP: React.lazy(() => import("./SeasonTickets")),
  FEX: React.lazy(() => import("./SeasonTickets")),
  FAP: React.lazy(() => import("./SeasonTickets")),
  MUP: React.lazy(() => import("./SeasonTickets")),
};

const ModePicker = () => {
  const theme = useTheme();
  const {
    state: { modes, selectedMode = "", labels },
    dispatch,
  } = useAppContext();

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
        modes.map((mode: Modes, index: number) => {
          const Component = Components[mode as Modes];

          return (
            <Fragment key={`${mode}-mode-selector`}>
              <Box
                width="100%"
                px={1}
                py={2}
                borderRadius={2}
                sx={{
                  backgroundColor:
                    mode === selectedMode
                      ? alpha(theme.palette.primary.light, 0.0619999)
                      : "none",
                }}
              >
                <ModeHeader mode={mode} />
                {selectedMode === mode && <Component />}
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
                      display: "inline-block",
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    {labels.OR || labels.LABELOR}
                  </Box>
                </Typography>
              )}
            </Fragment>
          );
        })}
    </RadioGroup>
  );
};

export default ModePicker;
