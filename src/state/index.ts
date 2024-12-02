import { InitialState } from "../../types";
import { returnModes } from "../utils/misc";

export const initialState: InitialState = {
  agentId: null,
  apiKey: null,
  arriveOffset: null,
  bounds: null,
  clientId: null,
  currentPage: null,
  departOffset: null,
  duration: null,
  endTime: null,
  eventDriven: false,
  events: null,
  evid: null,
  focusedLocation: null,
  hideEventDateTime: false,
  isLoading: false,
  isInitializing: true,
  labels: null,
  locationIds: null,
  locations: null,
  mapLocationLat: null,
  mapLocationLng: null,
  mapLocationText: null,
  mapZoom: null,
  modes: null,
  modesOverride: null,
  selectedPass: null,
  salesChannelKey: null,
  seasonTickets: null,
  selectedDuration: null,
  selectedEvent: null,
  selectedLocation: null,
  selectedMode: null,
  showSidebar: true,
  startTime: null,
  timeIncrements: null,
  useFullWidget: false,
  useMap: false,
  variant: "basic",
  widgetKey: null,
  times: {
    start: null,
    end: null,
  },
};

export enum Actions {
  FOCUSED_LOCATION = "FOCUSED_LOCATION",
  LOADING = "LOADING",
  INITIALIZING = "INITIALIZING",
  RESET_EVENTS = "RESET_EVENTS",
  SELECTED_EVENT = "SELECTED_EVENT",
  SELECTED_LOCATION = "SELECTED_LOCATION",
  SELECTED_MODE = "SELECTED_MODE",
  SET_DURATION = "SET_DURATION",
  SET_END_TIME = "SET_END_TIME",
  SET_EVENTS = "SET_EVENTS",
  SET_LOCATIONS = "SET_LOCATIONS",
  SET_MODES = "SET_MODES",
  SET_PASS = "SET_PASS",
  SET_SEASON_TICKETS = "SET_SEASON_TICKETS",
  SET_START_TIME = "SET_START_TIME",
  SET_TIME_INCREMENTS = "SET_TIME_INCREMENTS",
  SET_ZOOM = "SET_ZOOM",
  SET_BOUNDS = "SET_BOUNDS",
  SET_OVERRIDES = "SET_OVERRIDES",
  SET_LABELS = "SET_LABELS",
}

export const appReducer = (
  state: InitialState,
  action: { type: string; payload: any }
): InitialState => {
  const { type, payload } = action;

  switch (type) {
    case Actions.INITIALIZING:
      return {
        ...state,
        isInitializing: payload,
      };
    case Actions.LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case Actions.SET_MODES:
      return {
        ...state,
        modes: payload,
        selectedMode: payload[0],
      };
    case Actions.SELECTED_MODE:
      return {
        ...state,
        selectedMode: payload,
      };
    case Actions.LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case Actions.SET_EVENTS:
      return {
        ...state,
        events: payload,
        isLoading: false,
      };
    case Actions.RESET_EVENTS:
      return {
        ...state,
        isLoading: false,
        events: [],
      };
    case Actions.SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: payload,
      };
    case Actions.SET_TIME_INCREMENTS:
      return {
        ...state,
        timeIncrements: payload,
        isLoading: false,
      };
    case Actions.SET_DURATION:
      return {
        ...state,
        selectedDuration: payload,
      };
    case Actions.SET_LABELS:
      return {
        ...state,
        labels: {
          ...state.labels,
          ...payload,
        },
      };
    case Actions.SET_LOCATIONS:
      let locations = payload || state.locations || [];

      if (state.mapLocationLat && state.mapLocationLng) {
        locations = [
          ...locations,
          {
            label: state.mapLocationText,
            lat: state.mapLocationLat,
            lng: state.mapLocationLng,
            isPlace: true,
          },
        ];
      }

      return {
        ...state,
        locations,
        isLoading: false,
      };
    case Actions.SELECTED_LOCATION:
      if (!payload) {
        return state;
      }

      const modes = state.modesOverride
        ? state.modes
        : returnModes(state.locations, payload.id);

      return {
        ...state,
        modes,
        selectedMode: state.selectedMode || modes?.[0],
        selectedLocation: payload,
      };
    case Actions.FOCUSED_LOCATION:
      return {
        ...state,
        focusedLocation: payload,
      };
    case Actions.SET_START_TIME:
      return {
        ...state,
        times: {
          ...state.times,
          start: payload,
        },
      };
    case Actions.SET_END_TIME:
      return {
        ...state,
        times: {
          ...state.times,
          end: payload,
        },
      };
    case Actions.SET_SEASON_TICKETS:
      return {
        ...state,
        isLoading: false,
        seasonTickets: payload,
      };
    case Actions.SET_PASS:
      return {
        ...state,
        selectedPass: payload,
      };
    case Actions.SET_ZOOM:
      return {
        ...state,
        mapZoom: payload,
      };
    case Actions.SET_BOUNDS:
      return {
        ...state,
        bounds: payload,
      };
    case Actions.SET_OVERRIDES:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
