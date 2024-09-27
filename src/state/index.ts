import { AppDefaults, returnModes } from "../utils/misc";

export interface InitialState extends AppDefaults {
  isLoading: boolean;
  times: {
    start: null;
    end: null;
  };
  events: null | string[];
  locations: null | string[];
  selectedEvent: { id: string; label: string } | null;
  duration: null | string;
  selectedDuration: null | string;
  timeIncrements: null | any[];
  selectedMode: null | string;
  selectedLocation: null | string;
  focusedLocation: null | string;
  seasonTickets: null | any[];
  rate: null | string;
  canPurchase: boolean;
  modes: string[] | null;
}

export const initialState: InitialState = {
  widgetKey: null,
  clientId: null,
  locationIds: null,
  useMap: false,
  mapZoom: null,
  mapLat: null,
  mapLng: null,
  hideEventDateTime: false,
  salesChannelKey: null,
  agentId: null,
  startTime: null,
  endTime: null,
  arriveOffset: null,
  departOffset: null,
  useFullWidget: false,
  mapTxt: null,
  currentPage: null,
  eventDriven: false,
  isLoading: false,
  locations: null,
  events: null,
  seasonTickets: null,
  timeIncrements: null,
  times: {
    start: null,
    end: null,
  },
  selectedMode: null,
  duration: null,
  selectedEvent: null,
  selectedDuration: null,
  selectedLocation: null,
  focusedLocation: null,
  rate: null,
  canPurchase: false,
  modes: null,
  evid: null,
  modesOverride: null,
};

export enum Actions {
  LOADING = "LOADING",
  SET_EVENTS = "SET_EVENTS",
  RESET_EVENTS = "RESET_EVENTS",
  SELECTED_EVENT = "SELECTED_EVENT",
  SET_LOCATIONS = "SET_LOCATIONS",
  SELECTED_LOCATION = "SELECTED_LOCATION",
  FOCUSED_LOCATION = "FOCUSED_LOCATION",
  SET_MODES = "SET_MODES",
  SELECTED_MODE = "SELECTED_MODE",
  SET_TIME_INCREMENTS = "SET_TIME_INCREMENTS",
  SET_DURATION = "SET_DURATION",
  SET_START_TIME = "SET_START_TIME",
  SET_END_TIME = "SET_END_TIME",
  SET_SEASON_TICKETS = "SET_SEASON_TICKETS",
  SET_RATE = "SET_RATE",
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
      const defaultEvent = state.evid
        ? payload.find((event: any) => event.EventId === state.evid)
        : null;

      return {
        ...state,
        events: payload,
        selectedEvent: defaultEvent
          ? {
              id: defaultEvent.EventId,
              label: defaultEvent.EventName,
            }
          : null,
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
      return {
        ...state,
        locations: payload,
        isLoading: false,
      };
    case Actions.SELECTED_LOCATION:
      return {
        ...state,
        modes: state.modesOverride
          ? state.modes
          : returnModes(state.locations, payload),
        selectedLocation: payload,
        canPurchase: state.eventDriven && payload ? true : false,
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
    default:
      return state;
  }
};
