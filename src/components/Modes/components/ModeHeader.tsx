import { Box, Radio, Typography } from "@mui/material";
import React from "react";
import { useAppContext } from "../../../context";
import { Actions } from "../../../state";
import { useTheme } from "@mui/material/styles";

const ModeHeader = ({ title, mode }: { title: string; mode: string }) => {
  const theme = useTheme();
  const {
    state: { modes },
    dispatch,
  } = useAppContext();

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
          id="TMD"
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
        {title}
      </Typography>
    </Box>
  );
};

export default ModeHeader;
