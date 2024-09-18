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
  SELECTED_EVENT = "SELECTED_EVENT",
  SET_LOCATIONS = "SET_LOCATIONS",
  SELECTED_LOCATION = "SELECTED_LOCATION",
  FOCUSED_LOCATION = "FOCUSED_LOCATION",
}

export const appReducer = (
  state: InitialState,
  action: { type: string; payload: any }
) => {
  const { type, payload } = action;

  // console.log("--------- ACTION! ---------");
  // console.log(action.type);
  // console.log(action.payload);
  // console.log("---------------------------");
  

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
        isLoading: false
      };
    case Actions.SELECTED_EVENT:
      return {
        ...state,
        selectedEvent: payload,
      };
    case Actions.SET_LOCATIONS:
      return {
        ...state,
        locations: payload,
        isLoading: false
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
