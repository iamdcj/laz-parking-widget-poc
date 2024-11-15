import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Modes } from "../../types";
import { useAppContext } from "../context";
import { Actions } from "../state";
import { useTheme } from "@mui/material/styles";

const ModePicker = () => {
  const theme = useTheme();
  const {
    state: { modes, selectedMode = "" },
    dispatch,
  } = useAppContext();


  console.log(modes);
  

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
          modes.map((mode: Modes) => (
            <FormControlLabel
              key={mode}
              id={mode}
              value={mode}
              control={
                <Radio
                  sx={{
                    py: 0,
                    color: theme.palette.primary.main,
                    "&.Mui-checked": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={mode}
            />
          ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ModePicker;
