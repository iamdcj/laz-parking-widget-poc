import { InitialState } from "../../types";
import { returnModes } from "../utils/misc";

export const initialState: InitialState = {
  agentId: null,
  apiKey: null,
  arriveOffset: null,
  bounds: null,
  canPurchase: false,
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
  locationIds: null,
  locations: null,
  mapLocationLat: null,
  mapLocationLng: null,
  mapLocationText: null,
  mapZoom: null,
  modes: null,
  modesOverride: null,
  rate: null,
  salesChannelKey: null,
  seasonTickets: null,
  selectedDuration: null,
  selectedEvent: null,
  selectedLocation: null,
  selectedMode: null,
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
  RESET_EVENTS = "RESET_EVENTS",
  SELECTED_EVENT = "SELECTED_EVENT",
  SELECTED_LOCATION = "SELECTED_LOCATION",
  SELECTED_MODE = "SELECTED_MODE",
  SET_DURATION = "SET_DURATION",
  SET_END_TIME = "SET_END_TIME",
  SET_EVENTS = "SET_EVENTS",
  SET_LOCATIONS = "SET_LOCATIONS",
  SET_MODES = "SET_MODES",
  SRT_ZOOM = "SRT_ZOOM",
  SET_RATE = "SET_RATE",
  SET_SEASON_TICKETS = "SET_SEASON_TICKETS",
  SET_START_TIME = "SET_START_TIME",
  SET_TIME_INCREMENTS = "SET_TIME_INCREMENTS",
  SET_ZOOM = "SET_ZOOM",
  SET_BOUNDS = "SET_BOUNDS",
  SET_OVERRIDES = "SET_OVERRIDES"
}

export const appReducer = (
  state: InitialState,
  action: { type: string; payload: any }
): InitialState => {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_MODES:
      return {
        ...state,
        modes: payload,
      };
    case Actions.SELECTED_MODE:
      return {
        ...state,
        rate: null,
        selectedDuration: null,
        times: {
          end: null,
          start: null,
        },
        seasonTickets: null,
        canPurchase: false,
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
      debugger;
      return {
        ...state,
        selectedEvent: payload,
        canPurchase: payload && state.selectedLocation ? true : false,
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
        canPurchase: true,
      };
    case Actions.SET_LOCATIONS:
      let locations = payload;

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
      return {
        ...state,
        modes: state.modesOverride
          ? state.modes
          : returnModes(state.locations, payload),
        selectedLocation: payload,
        canPurchase: state.eventDriven ? true : state.canPurchase,
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
        canPurchase: state.times.start ? true : false,
      };
    case Actions.SET_SEASON_TICKETS:
      return {
        ...state,
        isLoading: false,
        seasonTickets: payload,
      };
    case Actions.SET_RATE:
      return {
        ...state,
        rate: payload,
        canPurchase: true,
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
