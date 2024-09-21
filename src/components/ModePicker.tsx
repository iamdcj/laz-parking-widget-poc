import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Mode } from "../../types";
import { useAppContext } from "../context";
import { Actions } from "../state";

const ModePicker = () => {
  const {
    state: { modes, selectedMode = "" },
    dispatch,
  } = useAppContext();

  return (
    <FormControl>
      <RadioGroup
        sx={{
           display: "flex",
           flexDirection: "row",
           mb: 1.5
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
          modes.map((mode: Mode) => (
            <FormControlLabel value={mode} control={<Radio />} label={mode} />
          ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ModePicker;
