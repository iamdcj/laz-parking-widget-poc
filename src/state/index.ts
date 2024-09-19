import { log } from "console";

export interface InitialState {
  isLoading: boolean;
  locations: any[] | null;
  events: any[] | null;
}

export const initialState: InitialState = {
  isLoading: true,
  locations: null,
  events: null,
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
}

export const appReducer = (
  state: InitialState,
  action: { type: string; payload: any }
) => {
  const { type, payload } = action;

  switch (type) {
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
        events: null,
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
    case Actions.SET_LOCATIONS:
      return {
        ...state,
        locations: payload,
        isLoading: false,
      };
    case Actions.SET_MODES:
      return {
        ...state,
        modes: payload,
      };
    case Actions.SELECTED_MODE:
      return {
        ...state,
        selectedMode: payload,
      };
    case Actions.SELECTED_LOCATION:
      return {
        ...state,
        selectedLocation: payload,
      };
    case Actions.FOCUSED_LOCATION:
      return {
        ...state,
        focusedLocation: payload,
      };
    default:
      return initialState;
  }
};
