import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "../context";
import { Actions } from "../state";
import {
  CheckCircleOutline,
  ChevronRight,
  DragHandle,
  DragIndicator,
} from "@mui/icons-material";

const Generator = () => {
  const appTheme = useTheme();
  const [wasCopied, setWasCopied] = useState(false);

  const {
    state: {
      agentId = "",
      arriveOffset = 0,
      clientId = "",
      departOffset = 0,
      eventDriven = "",
      headerText = "",
      hideEventDateTime = "",
      isHeaderEnabled = "",
      isLoading = "",
      locationIds = "",
      logo = "",
      mapLocationLat = "",
      mapLocationLng = "",
      mapLocationText = "",
      mapZoom = "",
      modes,
      modesOverride = "",
      salesChannelKey = "",
      showSidebar,
      useMap = "",
      variant,
      widgetKey = "",
    },
    dispatch,
  } = useAppContext();

  const handleGenerateSnippet = async () => {
    const type = "text/plain";
    const blob = new Blob(
      [
        `
  <div
  id="LAZ_Widget"
  data-header="${isHeaderEnabled}"
  data-header-text="${headerText ? headerText : ""}"
  data-eventdriven="${eventDriven}"
  data-hide-event-date="${hideEventDateTime}"
  data-map="${useMap}"
  data-locationid="${locationIds ? locationIds : ""}"
  data-sc="${salesChannelKey ? salesChannelKey : ""}"
  data-agentid="${agentId ? agentId : ""}"
  data-clientid="${clientId ? clientId : ""}"
  data-wk="${widgetKey ? widgetKey : ""}"
  data-logo-url="${logo ? logo : ""}"
  data-mapzoom="${mapZoom ? mapZoom : ""}"
  data-mapplacelat="${mapLocationLat ? mapLocationLat : ""}"
  data-mapplacelng="${mapLocationLng ? mapLocationLng : ""}"
  data-mapplacetxt="${mapLocationText ? mapLocationText : ""}"
  data-mode-overwrite="${modesOverride ? true : ""}"
  data-mode="${modesOverride ? modesOverride : ""}"
  data-arrive="${arriveOffset ? arriveOffset : ""}"
  data-depart="${departOffset ? departOffset : ""}"
  data-starttime=""
  data-endtime=""
  data-fullwidget=""
  data-currentpage=""
 >
</div>
<script type="text/javascript" src="https://go.lazparking.com/checkout/js/app/main.js"></script>
    `,
      ],
      { type }
    );

    try {
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      setWasCopied(true);
    } catch (error) {}
  };

  const timedModeAvailable = modes?.includes("TMD");

  return (
    <Paper
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        transform: showSidebar ? "translateX(0)" : "translateX(100%)",
        transition: "transform 200ms ease-in",
        height: "100%",
        zIndex: 2
      }}
    >
      <IconButton
        onClick={() =>
          dispatch({
            type: Actions.SET_OVERRIDES,
            payload: {
              showSidebar: !showSidebar,
            },
          })
        }
        sx={{
          position: "absolute",
          left: -20,
          top: "50%",
          transform: "translateY(-50%)",
          width: 20,
          background: "#fff",
          boxShadow: "inherit",
          borderRadius: "2px 0 0 2px",
          zIndex: -1,
        }}
      >
        <DragIndicator />
      </IconButton>
      <Box
        px={5}
        display="flex"
        flexDirection="column"
        height="100vh"
        padding={3}
        width={350}
        overflow="auto"
      >
        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Variant
          </FormLabel>
          <RadioGroup
            sx={{ display: "flex", flexDirection: "row", pl: 1 }}
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={variant}
            onChange={(event, value) => {
              dispatch({
                type: Actions.SET_OVERRIDES,
                payload: {
                  variant: value,
                },
              });
            }}
          >
            <FormControlLabel value="basic" control={<Radio />} label="Basic" />
            <FormControlLabel value="map" control={<Radio />} label="Map" />
          </RadioGroup>
        </FormControl>
        <Divider sx={{ my: 4 }} />
        <FormGroup sx={{ mb: 2 }}>
          <Typography fontWeight={600}>Header Settings</Typography>
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
            value={headerText || ""}
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
          {/* <TextField
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
          /> */}
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
          <Divider sx={{ mb: 4 }} />
          <Typography fontWeight={600}>Global Settings</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isLoading}
                onChange={(event, value) => {
                  dispatch({
                    type: Actions.SET_OVERRIDES,
                    payload: {
                      isLoading: value,
                    },
                  });
                }}
                name="isLoading"
              />
            }
            label="Show Loader"
          />
          {variant !== "map" && (
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
          )}
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
        <Divider sx={{ mb: 4 }} />
        {timedModeAvailable && (
          <FormGroup sx={{ mb: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Timepicker Settings
            </Typography>
            <TextField
              required
              id="arriveOffset"
              label="Arrival Time offset (minutes)"
              placeholder="e.g. 30"
              sx={{ mb: 2 }}
              value={arriveOffset}
              type="number"
              onChange={(event) => {
                dispatch({
                  type: Actions.SET_OVERRIDES,
                  payload: {
                    arriveOffset: Number(event.target.value),
                  },
                });
              }}
              helperText="Offsets the starting time of the datepicker by X amount of minutes"
            />
            <TextField
              required
              id="arriveOffset"
              label="Depart Time offset (minutes)"
              placeholder="e.g. 30"
              sx={{ mb: 2 }}
              value={departOffset}
              type="number"
              onChange={(event) => {
                dispatch({
                  type: Actions.SET_OVERRIDES,
                  payload: {
                    departOffset: Number(event.target.value),
                  },
                });
              }}
              helperText="Offsets the departure time of the datepicker by X amount of minutes"
            />
          </FormGroup>
        )}
        {/* <Box mb={4}>
          <Typography mb={2} fontWeight={600}>
            Theming
          </Typography>
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
        </Box> */}

        <Button
          variant="outlined"
          onClick={handleGenerateSnippet}
          sx={{ mb: 2 }}
        >
          Copy Snippet
        </Button>
        <Snackbar
          open={wasCopied}
          autoHideDuration={3000}
          onClose={() => setWasCopied(false)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            icon={<CheckCircleOutline fontSize="inherit" />}
            severity="success"
          >
            Widget Code copied to clipboard
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default Generator;
