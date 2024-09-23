export interface InitialState {
  isLoading: boolean;
  locations: any[];
  events: any[];
  times: {
    start: null;
    end: null;
  };
  selectedEvent: string;
  duration: string;
  selectedDuration: string;
  timeIncrements: null | any[];
  modes: string;
  selectedMode: string;
  selectedLocation: string;
  focusedLocation: string;
}

export const initialState: InitialState = {
  isLoading: false,
  locations: [],
  events: [],
  times: {
    start: null,
    end: null,
  },
  selectedEvent: "",
  selectedDuration: "",
  duration: "",
  timeIncrements: null,
  modes: "",
  selectedMode: "",
  selectedLocation: "",
  focusedLocation: "",
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
}

export const appReducer = (
  state: InitialState,
  action: { type: string; payload: any }
): InitialState => {
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
        selectedEvent: "",
        times: {
          end: null,
          start: null,
        },
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
        selectedDuration: "",
        times: {
          end: null,
          start: null,
        },
        selectedEvent: "",
        selectedMode: payload,
      };
    case Actions.SELECTED_LOCATION:
      return {
        ...state,
        selectedDuration: "",
        selectedMode: null,
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
        selectedDuration: "",
        selectedEvent: "",
        times: {
          ...state.times,
          start: payload,
        },
      };
    case Actions.SET_END_TIME:
      return {
        ...state,
        selectedEvent: "",
        selectedDuration: "",
        times: {
          ...state.times,
          end: payload,
        },
      };
    default:
      return initialState;
  }
};
