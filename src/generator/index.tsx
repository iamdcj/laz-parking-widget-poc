import React from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { HexColorInput } from "react-colorful";
import { useAppContext } from "../context";
import { Actions } from "../state";

const Generator = () => {
  const appTheme = useTheme();
  const {
    state: {
      buttonText,
      isHeaderEnabled,
      headerText,
      useMap,
      theme,
      logo,
      hideEventDateTime,
    },
    dispatch,
  } = useAppContext();

  return (
    <Paper>
      <Box
        px={5}
        display="flex"
        flexDirection="column"
        height="100vh"
        padding={3}
        width={350}
      >
        <FormGroup sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isHeaderEnabled}
                onChange={(event, value) => {
                  dispatch({
                    type: Actions.SET_OVERRIDES,
                    payload: {
                      isHeaderEnabled: value,
                    },
                  });
                }}
                name="showHeader"
              />
            }
            label="Show Header"
            sx={{
              mb: 3,
            }}
          />

          <TextField
            required
            id="headerText"
            label="Header Text"
            placeholder="e.g. Reserve Parking"
            sx={{ mb: 2 }}
            value={headerText}
            inputProps={{ maxLength: 25 }}
            onChange={(event) => {
              dispatch({
                type: Actions.SET_OVERRIDES,
                payload: {
                  headerText: event.target.value,
                },
              });
            }}
            disabled={!isHeaderEnabled}
            helperText="Max. 25 Characters"
          />
          <TextField
            required
            id="logoUrl"
            type="url"
            label="Logo URL"
            helperText="Overrides Header Text"
            placeholder="e.g. https://laz.com"
            sx={{ mb: 4 }}
            value={logo}
            onChange={(event) => {
              dispatch({
                type: Actions.SET_OVERRIDES,
                payload: {
                  logo: event.target.value,
                },
              });
            }}
            disabled={!isHeaderEnabled}
          />
          {/* <TextField
            required
            id="buttonText"
            label="Button Text"
            placeholder="e.g. Get Rates"
            sx={{ mb: 2 }}
            value={buttonText}
            onChange={(event) => {
              dispatch({
                type: Actions.SET_OVERRIDES,
                payload: {
                  buttonText: event.target.value,
                },
              });
            }}
          /> */}
          <FormControlLabel
            control={
              <Switch
                checked={useMap}
                onChange={(event, value) => {
                  dispatch({
                    type: Actions.SET_OVERRIDES,
                    payload: {
                      useMap: value,
                    },
                  });
                }}
                name="showMap"
              />
            }
            label="Show Map"
          />
          <FormControlLabel
            control={
              <Switch
                checked={hideEventDateTime}
                onChange={(event, value) => {
                  dispatch({
                    type: Actions.SET_OVERRIDES,
                    payload: {
                      hideEventDateTime: value,
                    },
                  });
                }}
                name="hideEventDateTime"
              />
            }
            label="Hide Event Date - Time"
          />
        </FormGroup>
        <Box mb={4}>
          <Typography display="block">Theming</Typography>
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 33.333%)"
            position="relative"
          >
            {["primary", "secondary", "accent"].map((field) => (
              <Box position="relative">
                <Box
                  height={100}
                  width="100%"
                  position="absolute"
                  top={0}
                  left={0}
                  sx={{
                    pointerEvents: "none",
                    background:
                      appTheme.palette[
                        field as "primary" | "secondary" | "accent"
                      ].main,
                  }}
                />
                <input
                  id={field}
                  type="color"
                  style={{
                    padding: 0,
                    border: "none",
                    height: 100,
                    width: "100%",
                    outline: "none",
                    marginBottom: 5,
                  }}
                  value={
                    appTheme.palette[
                      field as "primary" | "secondary" | "accent"
                    ].main
                  }
                  onChange={(event) => {
                    dispatch({
                      type: Actions.SET_OVERRIDES,
                      payload: {
                        theme: {
                          ...theme,
                          [field]: event.target.value,
                        },
                      },
                    });
                  }}
                />
                <HexColorInput
                  prefixed
                  style={{ maxWidth: "100%" }}
                  id={field}
                  color={
                    appTheme.palette[
                      field as "primary" | "secondary" | "accent"
                    ].main
                  }
                  onChange={(value) => {
                    dispatch({
                      type: Actions.SET_OVERRIDES,
                      payload: {
                        theme: {
                          ...theme,
                          [field]: value,
                        },
                      },
                    });
                  }}
                  disabled={!isHeaderEnabled}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Button variant="outlined">Generate Snippet</Button>
      </Box>
    </Paper>
  );
};

export default Generator;
